import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";
import ToastService from "primevue/toastservice";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import Tooltip from "primevue/tooltip";
import { useGlobalStore } from "./stores/global";
import "./styles/global.scss"

// Icons
import "@fortawesome/fontawesome-free/css/all.min.css";
// Utility classes by PrimeVue
import "primeflex/primeflex.css";

const pinia = createPinia();

export const app = createApp(App)
  .use(router)
  .use(pinia)
  .use(PrimeVue)
  .use(ConfirmationService)
  .use(ToastService);

app.directive("tooltip", Tooltip);

app.mount("#app");

// export the global store also here that it can be used in services
// otherwise there will be errors with Pinia
export const $global = useGlobalStore();
