/**
 * Cache for all media items
 * Will handle some interactions with the backend
 */

import { defineStore } from "pinia";
import { dataProvider } from "../services/data";
import { Medium } from "../services/data/types";
import { error } from "../services/toast";

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
     * get all media items
     * if documentId is provided, get all media items for that document
     */
    async initialize(documentId?: undefined | string): Promise<void> {
      try {
        const data = await dataProvider.getMediums({ documentId });
        this.$state.media = data;
      } catch (e) {
        error(e + "");
      }
    },

    /**
     * Get all media items without a documentId
     * get full list from the store
     * each item will have "documents" property which is an array of documentIds
     * filter out all items that have a documentId or an "originId" which means that they are translations
     */
    async getMediaWithoutDocument() {
      const data = await dataProvider.getMediums();
      this.$state.media = data.filter(
        (item) => (!item.documents || item.documents.length === 0) && (!item.originId || item.originId === "")
      );
    }
  },
});
