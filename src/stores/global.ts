import { defineStore } from 'pinia';
import { router } from './../router/index';

export const useGlobalStore = defineStore('global', {
  state: () => ({}),
  actions: {
    async loginRedirect() {
      await router.push({ path: '/edit' });
    },
  },
});
