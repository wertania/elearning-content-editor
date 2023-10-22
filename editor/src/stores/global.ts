import { defineStore } from "pinia";
import { router } from "./../router/index";

const aiSearchUrl: string = import.meta.env.VITE_AISEARCH_URL ?? "";

interface GlobalState {
  isLoading: boolean;
  isLoggenIn: boolean;
  requestPending: boolean;
  mode: "light" | "dark";
  aiSearchUrl: string;
}

export const useGlobalStore = defineStore("global", {
  state: () => (<GlobalState> {
    isLoading: false,
    isLoggenIn: false,
    requestPending: false,
    mode: "light",

    aiSearchUrl,
  }),
  actions: {
    async loginRedirect() {
      await router.push({ path: "/edit" });
    },
  },
});
