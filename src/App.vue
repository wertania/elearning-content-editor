<template>
  <router-view></router-view>

  <NotificationManager />
</template>

<script setup lang="ts">
import 'hh-components/style.css';
import './styles/globals.scss';
import { useDocumentStore } from './stores/documents';
import { NotificationManager } from 'hh-components';

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
