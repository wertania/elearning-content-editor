import { defineStore } from "pinia";
import { router } from "./../router/index";

interface GlobalState {
  isLoading: boolean;
  isLoggenIn: boolean;
  requestPending: boolean;
  mode: "light" | "dark";
}

export const useGlobalStore = defineStore("global", {
  state: () => (<GlobalState> {
    isLoading: false,
    isLoggenIn: false,
    requestPending: false,
    mode: "light",
  }),
  actions: {
    async loginRedirect() {
      await router.push({ path: "/edit" });
    },
  },
});
