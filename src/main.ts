import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";

import "./../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import "./../node_modules/primeflex/primeflex.css";
import "./../node_modules/primevue/resources/themes/nano/theme.css";

const pinia = createPinia();

const app = createApp(App)
  .use(PrimeVue)
  .use(router)
  .use(pinia);

app.mount("#app");
