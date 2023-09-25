import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import { createPinia } from 'pinia';
import { setup } from 'hh-components';

import '@fortawesome/fontawesome-free/css/all.min.css';

const pinia = createPinia();
const app = createApp(App).use(router).use(pinia);
setup(app);

app.mount('#app');
