<template>
  <Toast />
  <router-view />
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import './styles/globals.scss';
import { dataProvider } from './services/data/index';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const initApp = async () => {
  // initialize data provider
  await dataProvider.initialize();
  // check if already logged in
  const login = await dataProvider.checkLogin();
  if (login) {
    console.log('logged in');
    if (route.name === 'login') {
      // redirect if on login page
      router.push({ name: 'edit' });
    }
  } else {
    console.log('not logged in. redirect to login');
    router.push({ name: 'login' });
  }
};
initApp();
</script>

<style lang="scss">
#app {
  font-family: var(--font-family);
  height: 100%;

  .app {
    height: 100%;

    main {
      overflow: hidden;
    }
  }
}

:root {
  --primary-color: #781a6d !important;
  --primary-50: #dfd6e1 !important;
  --primary-100: rgb(235, 184, 220) !important;
  --primary-200: rgb(203, 133, 182) !important;
  --primary-300: rgb(190, 111, 167) !important;
  --primary-400: rgb(181, 105, 158) !important;
  --primary-500: rgb(153, 88, 134) !important;
  --primary-600: rgb(135, 81, 119) !important;
  --primary-700: rgb(113, 69, 100) !important;
  --primary-800: rgb(81, 53, 73) !important;
  --primary-900: rgb(60, 31, 52) !important;
}
</style>