import { defineStore } from "pinia";
import { router } from "./../router/index";

const aiSearchUrl: string = import.meta.env.VITE_AISEARCH_URL ?? "";
const videoConverterUrl: string = import.meta.env.VITE_VIDEOCONVERTER_URL ?? "";

interface GlobalState {
  isLoading: boolean;
  isLoggenIn: boolean;
  requestPending: boolean;
  aiSearchUrl: string;
  videoConverterUrl: string;
  jwtToken: string;

  // user settings
  mode: "light" | "dark";
}

export const useGlobalStore = defineStore("global", {
  state: () => (<GlobalState> {
    isLoading: false,
    isLoggenIn: false,
    requestPending: false,
    mode: "light",

    aiSearchUrl,
    videoConverterUrl,

    jwtToken: "",
  }),
  actions: {
    async loginRedirect() {
      await router.push({ path: "/edit" });
    },

    saveUserSettings() {
      // store user settings in local storage
      localStorage.setItem("ece_mode", this.mode);
    },

    getUserSettings() {
      // get user settings from local storage
      const mode = localStorage.getItem("ece_mode");
      if (mode && (mode === "light" || mode === "dark")) {
        this.mode = mode;
      }
    },
  },
});
