import { buildTree } from '../helpers';
import { DocumentItem } from '../types';
import type { DataProvider, DocumentTreeItem } from '../types';
import { mockData as demoData } from './mockData';

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

  async getDataForDocument(id: string): Promise<DocumentItem> {
    console.log('getDataForDocument');
    const item = demoData.find((item) => item.id === id);
    if (!item) {
      throw new Error(`Document with id ${id} not found`);
    }
    return item;
  },

  async addDocument(document: DocumentItem): Promise<void> {
    console.log('addDocument');
    demoData.push(document);
  },

  async dropDocument(id: string): Promise<void> {
    console.log('dropDocument');
    const index = demoData.findIndex((item) => item.id === id);
    demoData.splice(index, 1);
  },

  async updateDocument(document: DocumentItem): Promise<void> {
    console.log('updateDocument');
    const index = demoData.findIndex((item) => item.id === document.id);
    demoData[index] = document;
  },
} satisfies DataProvider;
