import { DocumentItem } from '../types';
import type { DataProvider, DocumentTreeItem } from '../types';
import { buildTree } from '../helpers';
import env from '../../env';

const URL = env.VITE_LOCALDB_HOST || 'http://localhost:8077';
const DOCUMENTS_URL = URL + '/document/';
const MEDIA_URL = URL + '/media/';

export default {
  name: 'localdb',

  initialize() {
    console.log('nothing to initialize');
  },

  async getDocuments(): Promise<{
    tree: DocumentTreeItem[];
    list: DocumentItem[];
  }> {
    const res = await fetch(DOCUMENTS_URL);
    const documents = await res.json();

    return {
      tree: buildTree(documents),
      list: documents,
    };
  },

  // -------------
  // | DOCUMENTS |
  // -------------

  async getDataForDocument(id: string): Promise<DocumentItem> {
    const res = await fetch(DOCUMENTS_URL + id);
    const document = await res.json();
    // console.log(document);
    return document;
  },

  async addDocument(document: DocumentItem): Promise<void> {
    const res = await fetch(URL + '/document', {
      method: 'POST',
      body: JSON.stringify(document),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const newDocument = await res.json();
    console.log(newDocument);
    return;
  },

  async dropDocument(id: string): Promise<void> {
    console.log('dropDocument', id);
    const res = await fetch(DOCUMENTS_URL + id, {
      method: 'DELETE',
    });
    const deletedDocument = await res.json();
    console.log(deletedDocument);
    return;
  },

  async updateDocument(document: DocumentItem): Promise<void> {
    const res = await fetch(DOCUMENTS_URL + document.id, {
      method: 'PUT',
      body: JSON.stringify(document),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const updatedDocument = await res.json();
    console.log(updatedDocument);
    return;
  },

  // ---------
  // | MEDIA |
  // ---------

  async getMedium(id) {
    const res = await fetch(`${MEDIA_URL}${id}`);
    const medium = await res.json();
    return medium;
  },

  async addMedium(_file) {
    throw Error(`Not implemented`);
  },

  // ---------
  // | Nodes |
  // ---------

  async dropNodes(ids: string[]): Promise<void> {
    for (const id of ids) {
      await fetch(DOCUMENTS_URL + id, {
        method: 'DELETE',
      });
    }
  },

  async moveNode(id: string, parentId: string): Promise<void> {
    // to do
    console.log(id, parentId);
  },
  // end
} satisfies DataProvider;
