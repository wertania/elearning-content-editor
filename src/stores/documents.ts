import { defineStore } from 'pinia';
import { dataProvider } from '../services/data';
import { DocumentItem, DocumentTreeItem } from '../services/data/types';

const DATASOURCE: string = import.meta.env.VITE_DOCUMENT_DATASOURCE ?? 'mock';

console.log('DOCUMENT_DATASOURCE', DATASOURCE);

interface DocumentState {
  documentSource: null | string;
  documentTree: DocumentTreeItem[];
  documentsFlat: DocumentItem[];
}

const isDescendant = (
  parent: DocumentItem | DocumentTreeItem,
  childId: string,
): boolean => {
  if (parent.type === 'folder' && 'children' in parent && parent.children) {
    if (parent.children.some((child) => child.id === childId)) {
      return true;
    }
    return parent.children.some((child) => isDescendant(child, childId));
  }
  return false;
};

export const useDocumentStore = defineStore('documents', {
  state: () =>
    ({
      documentSource: null,
      documentTree: [],
      documentsFlat: [],
    }) as DocumentState,

  actions: {
    async initialize() {
      this.$state.documentSource = DATASOURCE;
      const data = await dataProvider.getDocuments();
      this.$state.documentTree = data.tree;
      this.$state.documentsFlat = data.list;
    },

    async updateDocument(document: DocumentItem) {
      await dataProvider.updateDocument(document);

      // update current tree
      let item = this.$state.documentsFlat.find(
        (item) => item.id === document.id,
      );

      if (item) {
        item = document;
      }
    },

    async dropDocument(id: string) {
      await dataProvider.dropDocument(id);
      await this.initialize(); // TODO: optimize
    },

    async addDocument(document: DocumentItem) {
      await dataProvider.addDocument(document);
      // update current tree
      await this.initialize(); // TODO: optimize
    },

    async getDocument(id: string): Promise<DocumentItem> {
      return await dataProvider.getDataForDocument(id);
    },

    async dropNode(id: string) {
      // const node = this.$state.documentsFlat.find((item) => item.id === id);

      // if (!node) {
      //   console.error(`Node with id ${id} not found`);
      //   return;
      // }

      // const getNodes = (node: DocumentItem | DocumentTreeItem): string[] => {
      //   let nodes: string[] = [];

      //   if (node.type === 'document') {
      //     nodes.push(node.id);
      //   } else if (node.type === 'folder') {
      //     nodes.push(node.id);
      //     this.$state.documentsFlat.forEach((item) => {
      //       if (item.parent === node.id) {
      //         nodes = nodes.concat(getNodes(item));
      //       }
      //     });
      //   }

      //   return nodes;
      // };

      // const nodes = getNodes(node);
      await dataProvider.dropNodes([id]);
      // update current tree
      await this.initialize(); // TODO: optimize
    },

    async moveNode(nodeId: DocumentItem, parentId: DocumentItem | undefined) {
      if (!parentId) {
        // If parentId is undefined, it's probably being moved to the root or is not being moved to a different parent.
        // Depending on your requirements, you might allow or disallow this.
        // Assuming it is allowed, proceed with the move:
        await dataProvider.moveNode(nodeId.id, undefined);
        await this.initialize(); // TODO: optimize
        return;
      }

      if (isDescendant(nodeId, parentId.id)) {
        return;
      }

      await dataProvider.moveNode(nodeId.id, parentId.id);
      await this.initialize(); // TODO: optimize
    },
  },
});
