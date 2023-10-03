<template>
  <Toast />
  <router-view></router-view>  
</template>

<script setup lang="ts">
// local styles
import './styles/globals.scss';
import { useDocumentStore } from './stores/documents';
import Toast from "primevue/toast";

// get the document store and initialize it
const documentStore = useDocumentStore();
documentStore.initialize();
</script>

<style lang="scss">
#app {
  height: 100%;

  .app {
    height: 100%;

    main {
      overflow: hidden;
    }
  }
}
</style>
