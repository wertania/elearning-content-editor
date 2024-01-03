import { DocumentItem } from '../../types';
import type {
  DataProvider,
  DocumentQuery,
  DocumentTreeItem,
  Medium,
  MediumQuery,
  MediumType,
} from '../../types';
import { buildTree, getDocumentMediaIds } from '../../helpers';
import PocketBase from 'pocketbase';
import { $global } from './../../../../main';

const URL: string =
  import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';

export default {
  name: 'pocketbase',

  cache: {
    pb: null,
    login: null,
  },

  async initialize() {
    this.cache.pb = new PocketBase(URL);
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
    console.log('checking login');
    try {
      // console.log("token: ", this.pb.authStore.token);
      const res = await this.cache.pb.collection('users').getList(1, 1, {
        expand: 'company',
      });
      if (res.items.length < 1) return false;

      // set some variables
      $global.jwtToken = this.cache.pb.authStore.token;

      return true;
    } catch (error) {
      console.log('error: ', error);
      return false;
    }
  },

  async logout(): Promise<void> {
    this.cache.pb.authStore.clear();
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

    contents.forEach((document: DocumentItem) => {
      document.media = getDocumentMediaIds(document);
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
    return { ...result.content, id: result.id, media: result.media };
  },

  async addDocument(document: DocumentItem): Promise<DocumentItem> {
    const mediaIds = getDocumentMediaIds(document);

    delete document.media;

    const result = await this.cache.pb.collection('documents').create({
      content: document,
      media: mediaIds,
    });

    return { ...result.content, id: result.id, media: result.media };
  },

  async dropDocument(id: string): Promise<void> {
    await this.cache.pb.collection('documents').delete(id);
  },

  async updateDocument(document: DocumentItem): Promise<DocumentItem> {
    // get all media-ids from document.content to update them in document.media
    const mediaIds = getDocumentMediaIds(document);

    delete document.media;

    const result = await this.cache.pb
      .collection('documents')
      .update(document.id, { content: document, media: mediaIds });

    return { ...result.content, id: result.id, media: result.media };
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

    console.log('getMedium from pocketbase', id);
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
      };

      // update db
      const updatedMedium = await this.cache.pb
        .collection('media')
        .update(result.id, {
          content: dbEntry,
        });

      if (documentId) {
        for (const id of documentId) {
          const document = await this.cache.pb
            .collection('documents')
            .getOne(id);

          await this.cache.pb.collection('documents').update(id, {
            media: [...document.media, updatedMedium.id],
          });
        }
      }

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
    console.log('new url: ', url);
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

  async moveNode(id: string, parentId: string): Promise<void> {
    // to do
    console.log(id, parentId);
  },
  // end

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

  async addVideoTask(file: File, sentences: string): Promise<string> {
    const result = await this.cache.pb.collection('videoTasks').create({
      status: 'unprocessed',
      file,
      sentences,
    });

    return result.id;
  },
} satisfies DataProvider;
