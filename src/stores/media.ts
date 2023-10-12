import { defineStore } from "pinia";
import { dataProvider } from "../services/data";
import { Medium } from "../services/data/types";
import { error, info } from "../services/toast";

interface DocumentState {
  media: Medium[];
}

export const useMediaStore = defineStore("media", {
  state: () =>
    ({
      media: [],
    }) as DocumentState,

  actions: {
    /**
     * Initialize the store with data from the backend
     * get all documents and build a tree
     */
    async initialize(documentId?: undefined | string): Promise<void> {
      try {
        const data = await dataProvider.getMediums({ documentId });
        this.$state.media = data;
      } catch (e) {
        error(e + "");
      }
    },
  },
});
