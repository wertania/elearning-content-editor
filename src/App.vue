<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import 'hh-components/style.css';
import './styles/globals.scss';
import { useDocumentStore } from './stores/documents';

// get the document store and initialize it
const documentStore = useDocumentStore();
documentStore.initialize();
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
