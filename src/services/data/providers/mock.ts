import { buildTree } from '../helpers';
import { DocumentItem } from '../types';
import type { DataProvider, DocumentTreeItem } from '../types';
import { mockData as demoData } from '../mock';
import { mockMedia } from '../mock/media';

export default {
  name: 'mock',

  async getDocuments(): Promise<{
    tree: DocumentTreeItem[];
    list: DocumentItem[];
  }> {
    return {
      tree: buildTree(demoData),
      list: demoData,
    };
  },

  // -------------
  // | DOCUMENTS |
  // -------------

  async getDataForDocument(id: string): Promise<DocumentItem> {
    const item = demoData.find((item) => item.id === id);

    if (!item) {
      throw new Error(`Document with id ${id} not found`);
    }

    return item;
  },

  async addDocument(document: DocumentItem): Promise<void> {
    demoData.push(document);
  },

  async dropDocument(id: string): Promise<void> {
    const index = demoData.findIndex((item) => item.id === id);
    demoData.splice(index, 1);
  },

  async updateDocument(document: DocumentItem): Promise<void> {
    const index = demoData.findIndex((item) => item.id === document.id);
    demoData[index] = document;
  },

  // ---------
  // | MEDIA |
  // ---------

  async getMedium(id) {
    return mockMedia.find((item) => id === item.id);
  },

  // ---------
  // | Nodes |
  // ---------

  async dropNodes(ids: string[]): Promise<void> {
    for (const id of ids) {
      const index = demoData.findIndex((item) => item.id === id);
      demoData.splice(index, 1);
    }
  },
} satisfies DataProvider;
