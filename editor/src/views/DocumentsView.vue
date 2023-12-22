<template>
  <DocumentViewer v-if="mode === 'view'" />
  <DocumentEditor v-if="mode === 'edit'" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useDocumentStore } from '../stores/documents';
import DocumentViewer from './DocumentViewer.vue';
import { useRoute, useRouter } from 'vue-router';
import { useGlobalStore } from '../stores/global';
import DocumentEditor from './DocumentEditor.vue';

const router = useRouter();
const route = useRoute();

const $global = useGlobalStore(); // global store
const $doc = useDocumentStore();

type DocumentMode = 'edit' | 'view';

const mode: DocumentMode = route.name === 'edit' ? 'edit' : 'view';

const browserLanguageSupported = $doc.languages.find(
  (l) => l.code === navigator.language.split('-')[0],
);

const preferedLanguage = ref<string>(
  route.query.lang?.toString() ??
    browserLanguageSupported?.code ??
    $doc.baseLanguage,
);

const selectDocument = async () => {
  const id = route.params.documentId?.toString();

  if (!id) {
    return;
  }

  const document = await $doc.getDocument(id, preferedLanguage.value);

  if (!document) {
    router.replace({ name: mode });
    return;
  }
};

watch(
  () => route.query.lang?.toString(),
  (lang?: string) => {
    if (!lang) return;
    preferedLanguage.value = lang;
    selectDocument();
  },
);

watch(
  () => route.params.documentId,
  (id) => {
    if (!id) return;
    selectDocument();
  },
);

// App Start
onMounted(async () => {
  $global.$state.isLoading = true;

  await $doc.initialize();
  await selectDocument();

  $global.$state.isLoading = false;
});
</script>
