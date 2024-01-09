<template>
  <!-- AI Answer Dialog -->
  <Dialog v-model:visible="showAnswerDialog" modal header="Let´s answer your question..." :style="{ width: '70vw' }">
    <template #default>
      <div class="p-1">
        Hi! I´m your AI documentation assistant. Type in your question and I´ll
        try to find the answer for you.
      </div>
      <div id="search-bar">
        <div class="p-inputgroup w-full">
          <InputText placeholder="Your question in natural language"
            class="w-full surface-100 border-round-lg border-none h-3rem font-medium" size="small" v-model="questionText"
            @keydown.enter="aiSearch()" :disabled="loading" />
          <Button icon="fa-solid fa-search" class="border-none border-round-lg ml-1" @click="aiSearch()"
            :disabled="questionText.length < 10 || loading" />
        </div>
      </div>
      <div v-if="answerText.length > 0">
        <p>
          {{ answerText }}
        </p>
        <div class="flex align-items-center">
          <span class="mr-2">Sources:</span>
          <Chip v-for="doc in answerDependingDocuments" :key="doc.name" :label="doc.name" class="mr-2"
            @click="openDocument(doc.id)" />
        </div>
      </div>
      <div>
        <Button label="Close" class="mt-4" @click="
          showAnswerDialog = false;
        resetSearch();
        " />
      </div>
    </template>
  </Dialog>

  <!-- Standard Search Results -->
  <Dialog v-model:visible="showSearchResults" modal header="Search" :style="{ width: '40vw' }">
    <template #default>
      <div id="search-bar">
        <div class="p-inputgroup w-full">
          <InputText placeholder="Search" class="w-full surface-100 border-round-lg border-none h-3rem font-medium"
            size="small" v-model="searchText" :autofocus="true" @keydown.enter="search()" :disabled="loading" />
          <Button icon="fa-solid fa-search" class="border-none border-round-lg ml-1" @click="search()"
            :disabled="loading" />
        </div>
      </div>
      <div v-if="searchResults.length > 0" class="flex flex-column">
        <Chip v-for="doc in searchResults" :key="doc.id" :label="doc.metadata.name" class="mt-2 cursor-pointer" @click="
          loadDocument({ id: doc.id, type: 'document' });
        resetSearch();
        showSearchResults = false;
        " />
      </div>
      <div>
        <Button label="Close" class="mt-4" @click="
          showSearchResults = false;
        resetSearch();
        " />
      </div>
    </template>
  </Dialog>

  <AppLayout ref="appLayoutRef">
    <template #logo>
      <img :src="logoUrl" class="w-full cursor-pointer" @click="router.push({ name: 'home' })" />
    </template>

    <template #appname>
      <h2>
        {{ appName }}
      </h2>
    </template>

    <template #start>
      <span class="p-input-icon-left ml-3">
        <i class="fa-solid fa-search" />
        <InputText placeholder="Search" class="w-12rem surface-100 border-round-lg border-none h-3rem font-medium"
          size="small" v-model="searchText" />
      </span>
      <i class="fa-solid fa-wand-magic-sparkles text-xl ml-2 mt-1 cursor-pointer" @click="showAnswerDialog = true"></i>
    </template>

    <template #end>
      <div class="document-viewer__language-dropdown flex align-content-center flex-grow-1">
        <Dropdown small :options="$doc.languages" option-label="name" option-value="code" v-model="preferedLanguage" />
        <i class="fa-solid fa-language text-4xl ml-2 mt-1"></i>
      </div>
    </template>

    <template #sidebar>
      <div class="flex flex-column">
        <!-- Tree -->
        <div style="height: calc(100vh - 6rem)" class="document-tree">
          <Tree class="pt-2 pb-3 pr-2" selectionMode="single" v-model:selectionKeys="selection" :value="$doc.documentTree"
            @node-select="loadDocument" :disabled="true">
            <template #default="slotProps">
              <div class="document-editor__tree-draggable">
                <span>{{ slotProps.node.name }}</span>
              </div>
            </template>
          </Tree>
        </div>
      </div>
    </template>

    <template #content>
      <div v-if="$global.$state.isLoading || $global.$state.requestPending"
        class="flex justify-content-center flex-wrap mt-5">
        <ProgressSpinner />
      </div>
      <div v-else-if="$doc.selectedDocument != null &&
        $doc.selectedDocument.type === 'document'
        ">
        <h1>
          {{ $doc.selectedDocument?.header }}
        </h1>
        <BlockEditor :read-only="true" v-model="page" :debug="false" :plugins="plugins" />
      </div>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, ComputedRef, watch, Ref } from 'vue';
import Tree, { TreeNode } from 'primevue/tree';
import ProgressSpinner from 'primevue/progressspinner';
import { useDocumentStore } from '../stores/documents';
import { DocumentTreeItem } from '../services/data/types';
import { useGlobalStore } from '../stores/global';
import AppLayout from './../components/AppLayout.vue';
import {
  BlockEditor,
  PluginHeader,
  PluginParagraph,
  BlockPage,
} from 'vue-blockful-editor';
import { PluginMedium } from './../blocks/medium';
import { PluginMarkdown } from './../blocks/markdown';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Chip from 'primevue/chip';
import { useRoute, useRouter } from 'vue-router';
import { error } from './../services/toast';
import { post } from './../services/http';
import {
  AiSearchResult,
  DocumentMeta,
  DocumentSearchResult,
} from './../types/services';
import { PluginPdf } from '../blocks/pdf';
const logoUrl = import.meta.env.VITE_TEMPLATE_LOGO_URL ?? "./../assets/logo.svg";

const router = useRouter();
const route = useRoute();
const $doc = useDocumentStore(); // main store
const $global = useGlobalStore(); // global store
const loading = ref(false);

const appLayoutRef = ref<InstanceType<typeof AppLayout>>();

// ai search
const showAnswerDialog = ref(false);
const questionText = ref('');
const answerText = ref('');
const answerDependingDocuments: Ref<DocumentMeta[]> = ref([]);
// search dialog
const searchText = ref('');
const showSearchResults = ref(false);
const searchResults: Ref<DocumentSearchResult[]> = ref([]);

const appName = import.meta.env.VITE_TEMPLATE_APP_NAME ?? 'RevDocs';

watch(searchText, () => {
  if (searchText.value.length > 0) {
    showSearchResults.value = true;
  }
});
// const searchMode: Ref<'simple' | 'ai'> = ref('search');

// selected language
// check if browser language is supported
const browserLanguageSupported = $doc.languages.find(
  (l) => l.code === navigator.language.split('-')[0],
);

const preferedLanguage = computed({
  get() {
    return (
      route.query.lang?.toString() ??
      browserLanguageSupported?.code ??
      $doc.baseLanguage
    );
  },

  set(newLang: string) {
    router.push({
      name: 'view',
      params: {
        documentId: $doc.baseDocument?.id,
      },
      query: { lang: newLang },
    });
  },
});

const page: ComputedRef<BlockPage> = computed(() => {
  return {
    blocks: $doc.selectedDocument?.content || [],
  };
});
const plugins = [
  PluginParagraph,
  PluginHeader,
  PluginMedium,
  PluginMarkdown,
  PluginPdf,
];

// tree data
const selection = ref<Record<string, boolean>>({}); // selected node keys in tree (single selection enabled)

/**
 * search
 */
const search = async () => {
  loading.value = true;
  try {
    const res: DocumentSearchResult[] = await post(
      `${$global.aiSearchUrl}/search`,
      { text: searchText.value, count: 5 },
      true,
    );
    searchResults.value = res;
  } catch (e) {
    error(e + '');
  }
  loading.value = false;
};

/**
 * AI Search
 */
const aiSearch = async () => {
  if (questionText.value.length < 10) {
    error('Please enter a question with at least 10 characters.');
    return;
  }
  // clone question
  const question = questionText.value + '';
  // reset old values
  resetSearch();
  // fetch new answer
  loading.value = true;
  try {
    const res: AiSearchResult = await post(
      `${$global.aiSearchUrl}/question`,
      { text: question, count: 5 },
      true,
    );
    answerText.value = res.answer;
    answerDependingDocuments.value = res.documents;
  } catch (e) {
    error(e + '');
  }
  loading.value = false;
};

/**
 * open document with given id
 */
const openDocument = (id: string) => {
  const url = '/view/' + id;
  console.log('openDocument', url);
  router.push(url);
};

/**
 * reset search
 */
const resetSearch = () => {
  searchText.value = '';
  searchResults.value = [];
  questionText.value = '';
  answerText.value = '';
  answerDependingDocuments.value = [];
};

/**
 * load a document from API.
 */
const nodeSelected = ref<{ type: string; id: string; parent?: string } | null>(
  null,
);
const loadDocument = async (node: TreeNode) => {
  if (node.type === 'folder') return;
  const n = node as DocumentTreeItem;
  nodeSelected.value = { type: n.type, id: n.id, parent: n.parent };
  console.log('loadDocument', node.id);
  await $doc.getDocument(node.id, preferedLanguage.value);

  openDocument(n.id);

  appLayoutRef.value?.closeSidebar();
};
</script>

<style lang="scss">
.document-viewer {
  &__language-dropdown {
    margin-right: 1rem;

    .p-dropdown {
      flex-grow: 1;
    }
  }
}
</style>
