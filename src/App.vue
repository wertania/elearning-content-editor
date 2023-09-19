<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useDocumentStore } from './stores/documents';

// get the document store and initialize it
const documentStore = useDocumentStore();
documentStore.initialize();
</script>