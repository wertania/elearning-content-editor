import {
  DocumentItem,
  SmartVideoStatus,
  SmartVideoTranscriptWithTimestamps,
  SmartVideoTask,
} from '../../types';
import type {
  DataProvider,
  DocumentQuery,
  DocumentTreeItem,
  Medium,
  MediumQuery,
  MediumType,
  TrackingItem,
} from '../../types';
import { buildTree } from '../../helpers';
import PocketBase from 'pocketbase';
import { $global } from './../../../../main';
import translationService from './../../../openai/aiservice';

const URL: string =
  import.meta.env.VITE_DATAPROVIDER_PUBLIC_URL || 'http://127.0.0.1:8090';

export default {
  name: 'pocketbase',

  cache: {
    pb: null as null | PocketBase,
    login: null,
  },

  async initialize() {
    this.cache.pb = new PocketBase(URL);
    this.cache.pb.autoCancellation(false);
  },

  async login(data: { username: string; password: string }): Promise<boolean> {
    try {
      await this.cache.pb
        .collection('users')
        .authWithPassword(data.username, data.password);
      return this.checkLogin();
    } catch (err) {
      throw Error(`Login failed. ${err}`);
      // return false;
    }
  },

  async checkLogin(): Promise<boolean> {
    try {
      // console.log("token: ", this.pb.authStore.token);
      const res = await this.cache.pb.collection('users').getList(1, 1, {
        expand: 'company',
      });
      if (res.items.length < 1) return false;

      // set some variables
      $global.isContentCreator = res.items[0].isContentCreator;
      $global.jwtToken = this.cache.pb.authStore.token;
      $global.userId = res.items[0].id;
      $global.userName = res.items[0].username;

      return true;
    } catch (error) {
      console.log('error: ', error);
      return false;
    }
  },

  async logout(): Promise<void> {
    this.cache.pb.authStore.clear();
  },

  async register(
    username: string,
    password: string,
    email: string,
    name: string,
    invitationCode: string,
  ): Promise<void> {
    await this.cache.pb.collection('users').create({
      email,
      username,
      password,
      passwordConfirm: password,
      name,
      invitationCode,
    });
  },

  // mail verification is done by background service
  // async requestEmailVerification(email: string): Promise<void> {
  //   await this.cache.pb.collection('users').requestVerification(email);
  // },

  async requestPasswordReset(email: string): Promise<void> {
    await this.cache.pb.collection('users').requestPasswordReset(email);
  },

  async updateEmail(email: string): Promise<void> {
    // send request email change email
    await this.cache.pb.collection('users').requestEmailChange(email);
  },

  async getDocuments(query?: DocumentQuery): Promise<{
    tree: DocumentTreeItem[];
    list: DocumentItem[];
  }> {
    let filter = `${
      query?.langCodes ? "content.langCode ~ '" + query.langCodes + "'" : ''
    } `;
    filter = filter + (query?.hasOrigin ? 'content.originId != null ' : '');
    filter =
      filter +
      (query?.originId ? "content.originId = '" + query.originId + "'" : '');
    filter = filter.trim();

    const result = await this.cache.pb.collection('documents').getList(1, 500, {
      filter,
    });
    if (result.status && result.status !== 200) {
      throw Error(`Documents could not be fetched. ${result.message}`);
    }
    const contents = result.items.map((item: any) => {
      return { ...item.content, id: item.id }; // overwrite id since this is empty in content
    });

    return {
      tree: buildTree(contents),
      list: contents,
    };
  },

  // -------------
  // | DOCUMENTS |
  // -------------

  async getDataForDocument(id: string): Promise<DocumentItem> {
    const result = await this.cache.pb.collection('documents').getOne(id);
    const document = { ...result.content, id: result.id };
    return document;
  },

  async addDocument(document: DocumentItem): Promise<DocumentItem> {
    const result = await this.cache.pb.collection('documents').create({
      content: document,
    });
    return { ...result.content, id: result.id };
  },

  async dropDocument(id: string): Promise<void> {
    await this.cache.pb.collection('documents').delete(id);
  },

  async updateDocument(document: DocumentItem): Promise<DocumentItem> {
    // get all media-ids from document.content to update them in document.media
    const mediaIds = [];
    for (const item of document.content) {
      if (item.type === 'medium' && item.data.id && item.data.id !== '') {
        mediaIds.push(item.data.id);
      }
    }
    document.media = mediaIds;
    const result = await this.cache.pb
      .collection('documents')
      .update(document.id, { content: document });

    // update also all media-entries
    for (const id of mediaIds) {
      const medium = await this.getMedium(id);
      if (!medium) continue;
      if (!medium.documents || medium.documents.indexOf(document.id) === -1) {
        medium.documents = medium.documents || [];
        medium.documents.push(document.id);
        // console.log('updating medium: ', medium);
        await this.cache.pb.collection('media').update(id, {
          content: medium,
        });
      }
    }
    return { ...result.content, id: result.id };
  },

  // ---------
  // | MEDIA |
  // ---------

  async getMediums(query?: MediumQuery): Promise<any> {
    let filter = `${
      query?.documentId ? "content.documents ~ '" + query.documentId + "'" : ''
    } `;
    filter =
      filter +
      (query?.originId ? "content.originId = '" + query.originId + "' " : '');
    filter =
      filter + (query?.type ? "content.type = '" + query.type + "' " : '');
    filter = filter.trim();
    // let url = MEDIA_URL + "query" + "?";
    // if (query?.documentId) {
    //   url += `documentId=${query.documentId}&`;
    // }
    // if (query?.originId) {
    //   url += `originId=${query.originId}&`;
    // }
    // if (query?.type) {
    //   url += `type=${query.type}&`;
    // }

    const result = await this.cache.pb.collection('media').getList(1, 9999, {
      filter,
    });
    const contents = result.items.map((item: any) => {
      return { ...item.content, id: item.id };
    });
    return contents;
  },

  async getMedium(id) {
    const pb: PocketBase = this.cache.pb;

    // console.log('getMedium from pocketbase', id);
    const result = await pb
      .collection('media')
      .getOne(id, { requestKey: null });
    if (result.status && result.status !== 200) {
      throw Error(`Medium ${id} could not be fetched. ${result.message}`);
    }
    return { ...result.content, id: result.id };
  },

  async addMedium(
    file: File,
    langCode: string,
    documentId?: string | string[],
    originId?: string,
  ) {
    try {
      let type: MediumType = 'image';
      if (file.name.endsWith('.mp4') || file.name.endsWith('.webm')) {
        type = 'video';
      }
      // first upload the file itself
      const result = await this.cache.pb.collection('media').create({
        file,
      });
      const url = await this.cache.pb.files.getUrl(result, result.file);
      const dbEntry: Medium = {
        id: result.id,
        version: 1,
        type,
        langCode,
        name: result.id,
        url,
        hash: '',
        filename: result.id,
        originId: originId || undefined,
        documents: documentId
          ? Array.isArray(documentId)
            ? documentId
            : [documentId]
          : [],
      };

      // update db
      const updatedMedium = await this.cache.pb
        .collection('media')
        .update(result.id, {
          content: dbEntry,
        });
      // console.log(updatedMedium);
      return updatedMedium.content;
    } catch (e) {
      throw Error(`Medium ${file.name} could not be uploaded. ${e}`);
    }
  },

  async updateMedium(id: string, file: File) {
    // get db entry
    const result = await this.cache.pb.collection('media').update(id, {
      file,
    });
    const url = await this.cache.pb.files.getUrl(result, result.file);
    // ('new url: ', url);
    // get actual db entry
    const medium = await this.getMedium(id);
    if (!medium) {
      throw Error(`Medium ${id} could not be fetched after uploading file.`);
    }
    medium.url = url;
    // update db
    const updatedMedium = await this.cache.pb
      .collection('media')
      .update(id, { content: medium });
    return updatedMedium;
  },

  async getMediumUrl(id) {
    const pb: PocketBase = this.cache.pb;

    const result = await pb
      .collection('media')
      .getOne(id, { requestKey: null });
    if (result.status && result.status !== 200) {
      throw Error(`Medium ${id} could not be fetched. ${result.message}`);
    }
    const url = pb.files.getUrl(result, result.file, { requestKey: null });
    return url.startsWith('http') ? url : URL + url;
  },

  async dropMedium(mediumId: string): Promise<void> {
    await this.cache.pb.collection('media').delete(mediumId);
  },

  // ---------
  // | Nodes |
  // ---------

  async dropNodes(ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.cache.pb.collection('documents').delete(id);
    }
  },

  /**
   * update the given id. set parentId to new value
   * if parentId is null, the node will be a root node
   */
  async moveNode(id: string, parent: string): Promise<void> {
    const item = await this.cache.pb.collection('documents').getOne(id);
    item.content.parent = parent;
    await this.cache.pb
      .collection('documents')
      .update(id, { content: item.content });
    return;
  },

  // -------
  // | PDF |
  // -------

  async addPDF(file) {
    const result = await this.cache.pb.collection('pdfs').create({
      file,
    });

    return result.id;
  },

  async getPDFUrl(id) {
    const pb: PocketBase = this.cache.pb;

    const item = await pb.collection('pdfs').getOne(id, { requestKey: null });
    return pb.files.getUrl(item, item.file, { requestKey: null });
  },

  async dropPDF(id) {
    await this.cache.pb.collection('pdfs').delete(id);
  },

  // --------------
  // | SmartVideo |
  // --------------

  async addVideoTask(file: File): Promise<string> {
    const result = await this.cache.pb.collection('videoTasks').create({
      status: 'unpreprocessed',
      file,
    });

    return result.id;
  },

  async getVideoTask(id: string): Promise<SmartVideoTask> {
    const result = await this.cache.pb.collection('videoTasks').getOne(id, {
      requestKey: null,
    });
    return result;
  },

  async getVideoTasks(status: SmartVideoStatus[]) {
    const result = await this.cache.pb
      .collection('videoTasks')
      .getList(1, 999, {
        filter: `${status.map((s) => `status = '${s}'`).join(' || ')}`,
      });
    return result.items;
  },

  async dropVideoTask(id: string): Promise<void> {
    await this.cache.pb.collection('videoTasks').delete(id);
  },

  async updateVideoStatus(id: string, status: SmartVideoStatus): Promise<void> {
    await this.cache.pb.collection('videoTasks').update(id, { status });
  },

  async updateVideoTranscript(
    id: string,
    sentences: SmartVideoTranscriptWithTimestamps[],
  ): Promise<void> {
    await this.cache.pb.collection('videoTasks').update(id, { sentences });
  },

  async getVideoTaskBlobUrl(id: string): Promise<string> {
    const item = await this.cache.pb.collection('videoTasks').getOne(id, {
      requestKey: null,
    });
    return this.cache.pb.files.getUrl(item, item.file, { requestKey: null });
  },

  async addDuplicateWithTranslation(
    id: string,
    targetLangCode: string,
    translate = true,
  ) {
    const item = await this.getVideoTask(id);
    const fileUrl = await this.getVideoTaskBlobUrl(id);

    if (item.sentences == null || item.sentences.length === 0) {
      throw new Error('No sentences found in video task');
    }

    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const file = new File([blob], item.file ?? blob.name, { type: blob.type }); // item.file is a string here at this point

    // edit item
    delete item.id;
    delete item.file;
    item.status = 'preprocessed';
    item.targetLangCode = targetLangCode;

    // translate all sentences
    let sentences = item.sentences;
    if (translate) {
      const translateSentence = async (
        sentenceItem: SmartVideoTranscriptWithTimestamps,
      ): Promise<SmartVideoTranscriptWithTimestamps> => {
        const answer = await translationService.getTranslation(
          sentenceItem.text,
          '',
          targetLangCode,
        );
        return { start_time: sentenceItem.start_time, text: answer };
      };
      // iterate over all sentences and translate them with Promise.all
      sentences = await Promise.all(item.sentences.map(translateSentence));
    }

    // @ts-ignore
    item.sentences = JSON.stringify(sentences);
    // @ts-ignore
    item.file = file;
    await this.cache.pb.collection('videoTasks').create(item);
  },

  async addTrackingEntry(item: TrackingItem): Promise<void> {
    await this.cache.pb.collection('tracking').create(item);
  },
} satisfies DataProvider;
