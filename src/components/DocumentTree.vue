<template>
    
    <Tree :value="documentStore.documentTree"></Tree>
</template>

<script setup lang="ts">
import Tree from 'primevue/tree';
import { useDocumentStore } from '../stores/documents';

const documentStore = useDocumentStore();
</script>