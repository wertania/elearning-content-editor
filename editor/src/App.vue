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
</style>