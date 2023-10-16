import { defineStore } from "pinia";
import { router } from "./../router/index";

export const useGlobalStore = defineStore("global", {
  state: () => ({
    isLoading: false,
    isLoggenIn: false,
    requestPending: false,
  }),
  actions: {
    async loginRedirect() {
      await router.push({ path: "/edit" });
    },
  },
});
