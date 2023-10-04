import { defineStore } from 'pinia';
import { DocumentItem } from 'src/services/data/types';

export const useSelectedStore = defineStore('selected', {
  state: () => ({
    mode: <'new' | 'edit'>'new',
    selectedDocument: <null | DocumentItem>null,
    changesDetected: false,
  }),
  actions: {},
});
