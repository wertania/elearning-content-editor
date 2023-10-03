import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import { createPinia } from 'pinia';
import ToastService from 'primevue/toastservice';
import PrimeVue from 'primevue/config';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primeflex/primeflex.css';

const pinia = createPinia();
export const app = createApp(App).use(router).use(pinia).use(ToastService).use(PrimeVue);

app.mount('#app');
