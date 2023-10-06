import { buildTree, fileTypeToMediaType } from '../helpers';
import { DocumentItem } from '../types';
import type { DataProvider, DocumentTreeItem, Medium } from '../types';
import { mockData as demoData } from '../mock';
import { mockMedia } from '../mock/media';
import { guid } from '../../../../src/services/guid';

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

  async getMedium(id: string): Promise<Medium | undefined> {
    return mockMedia.find((item) => id === item.id);
  },

  async addMedium(file: File): Promise<Medium> {
    const medium: Medium = {
      id: guid(),
      // TODO
      hash: '',
      name: file.name,
      type: fileTypeToMediaType(file),
      url: URL.createObjectURL(file),
    };

    mockMedia.push(medium);
    return medium;
  },

  async getMediumUrl(mediumId) {
    return mockMedia.find((item) => mediumId === item.id)!.url;
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

  async moveNode(id: string, parentId: string | undefined): Promise<void> {
    const node = demoData.find((item) => item.id === id);

    if (!node) {
      console.error(`Node with id ${id} not found`);
      return;
    }

    node.parent = parentId;
  },
} satisfies DataProvider;
