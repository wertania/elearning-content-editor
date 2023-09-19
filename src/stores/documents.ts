import { defineStore } from "pinia";
import { DataProvider } from "../services/data";
import { DocumentItem, DocumentTreeItem } from "../services/data/types";

const TYPE: string = import.meta.env.VITE_SOME_KEY ?? "mock";
const DATA_PROVIDER = new DataProvider(TYPE);

interface DocumentState {
  documentSource: null | string;
  documentTree: DocumentTreeItem[];
}

export const useDocumentStore = defineStore("documents", {
  state: () => ({
    documentSource: null,
    documentTree: [],
  } as DocumentState),

  actions: {
    async initialize() {
      this.$state.documentSource = TYPE;
      this.$state.documentTree = await DATA_PROVIDER.getDocumentTree();
    },

    async updateDocument(document: DocumentItem) {
      await DATA_PROVIDER.updateDocument(document);
      // update current tree
      let item = this.$state.documentTree.find((item) =>
        item.id === document.id
      );
      if (item) {
        item = document;
      }
    },

    async dropDocument(id: string) {
      await DATA_PROVIDER.dropDocument(id);
      // update current tree
      this.$state.documentTree = this.$state.documentTree.filter(
        (item) => item.id !== id,
      );
    },

    async addDocument(document: DocumentItem) {
      await DATA_PROVIDER.addDocument(document);
      // update current tree
      if (document.parent != null) {
        const parent = this.$state.documentTree.find(
          (item) => item.id === document.parent,
        );
        if (parent) {
          parent.children.push(document);
        } else {
          console.error("Parent not found");
        }
      } else {
        this.documentTree.push({
          key: document.id,
          label: document.name,
          icon: document.icon,
          type: document.type,
        } as DocumentTreeItem);
      }
    },

    async getDocument(id: string): Promise<DocumentItem> {
      return await DATA_PROVIDER.getDataForDocument(id);
    },
  },
});
