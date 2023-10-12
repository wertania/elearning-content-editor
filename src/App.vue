<template>
  <Toast />
  <router-view />
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import './styles/globals.scss';
import { dataProvider } from './services/data/index';
import { useRouter } from 'vue-router';

const router = useRouter();

const start = async () => {
  await dataProvider.initialize();

  console.log('check login');
  const l = await dataProvider.checkLogin();
  console.log('login', l);
  if (!l) {
    router.push({ name: 'login' });
  } else {
    router.push({ name: 'edit' });
  }
};
start();
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
