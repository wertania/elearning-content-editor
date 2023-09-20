import { defineStore } from "pinia";
import { DataProvider } from "../services/data";
import { DocumentItem, DocumentTreeItem } from "../services/data/types";

const TYPE: string = import.meta.env.VITE_DOCUMENT_DATASOURCE ?? "mock";
console.log("DOCUMENT_DATASOURCE", TYPE);
const DATA_PROVIDER = new DataProvider(TYPE);

interface DocumentState {
  documentSource: null | string;
  documentTree: DocumentTreeItem[];
  documentsFlat: DocumentItem[];
}

export const useDocumentStore = defineStore("documents", {
  state: () => ({
    documentSource: null,
    documentTree: [],
    documentsFlat: [],
  } as DocumentState),

  actions: {
    async initialize() {
      this.$state.documentSource = TYPE;
      const data = await DATA_PROVIDER.getDocumentTreeAndList();
      this.$state.documentTree = data.tree;
      this.$state.documentsFlat = data.list;
    },

    async updateDocument(document: DocumentItem) {
      await DATA_PROVIDER.updateDocument(document);
      // update current tree
      let item: undefined | DocumentItem = this.$state.documentsFlat.find((
        item,
      ) => item.id === document.id);
      if (item) {
        item = document;
      }
    },

    async dropDocument(id: string) {
      await DATA_PROVIDER.dropDocument(id);
      await this.initialize(); // TODO: optimize
    },

    async addDocument(document: DocumentItem) {
      await DATA_PROVIDER.addDocument(document);
      // update current tree
      await this.initialize(); // TODO: optimize
    },

    async getDocument(id: string): Promise<DocumentItem> {
      return await DATA_PROVIDER.getDataForDocument(id);
    },
  },
});
