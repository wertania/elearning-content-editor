<template>
  <!-- Toas Message boxes -->
  <Toast />
  <!-- Main entry point for views -->
  <router-view />
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import { dataProvider } from './services/data/index';
import { useRouter, useRoute } from 'vue-router';

/**
 * Initialize the app
 * - initialize data provider
 * - check if already logged in
 * - redirect to login if not logged in
 * - redirect to home if already logged in
 */
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
      router.push({ name: 'home' });
    }
  } else {
    console.log('not logged in. redirect to login');
    router.push({ name: 'login' });
  }
};
initApp();
</script>

<style lang="scss">
// overwrite some browser defaults
:root,
body,
#app {
  height: 100%;
}

#app {
  font-family: var(--font-family);
  min-height: 100%;

  display: flex;
  flex-direction: column;
}
</style>
