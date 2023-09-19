import { defineStore } from "pinia";
import { DataProvider } from "../services/data";
import { DocumentTreeItem } from "../services/data/types";

export const useDocumentStore = defineStore("documents", {
  state: () => ({
    documentSource: null as null | string,
    documentTree: [] as DocumentTreeItem[],
  }),

  actions: {
    async initialize() {
      const type: string = import.meta.env.VITE_SOME_KEY ?? "mock";
      this.$state.documentSource = type;

      const dataProvider = new DataProvider(type);
      this.$state.documentTree = await dataProvider.getDocumentTree();
    },
  },
});
