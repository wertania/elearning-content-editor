import { defineStore } from "pinia";
import { router } from "./../router/index";
import { checkForValidToken } from "../services/auth";

export const useGlobalStore = defineStore("global", {
  state: () => ({
    isLoggedIn: false,
  }),
  actions: {
    async init() {
      const token = await checkForValidToken();
      if (token.accessToken) {
        this.isLoggedIn = true;
      }
    },
    async loginRedirect() {
      this.isLoggedIn = true;
      await router.push({ path: "/edit" });
    },
  },
});
