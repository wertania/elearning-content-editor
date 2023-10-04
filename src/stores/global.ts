import { defineStore } from 'pinia';
import { router } from './../router/index';
import { checkForValidToken } from '../services/auth';

const AUTHENTICATION_TYPE =
  import.meta.env.VITE_AZURE_AUTHENTICATION_TYPE || 'None';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    isLoggedIn: false,
  }),
  actions: {
    async init() {
      if (AUTHENTICATION_TYPE !== 'None') {
        const token = await checkForValidToken();
        if (token.accessToken) {
          this.isLoggedIn = true;
        }
      } else {
        this.isLoggedIn = true;
      }
    },
    async loginRedirect() {
      this.isLoggedIn = true;
      await router.push({ path: '/edit' });
    },
  },
});
