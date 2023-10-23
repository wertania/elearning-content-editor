<template>
  <!-- AI Answer Dialog -->
  <Dialog v-model:visible="showAnswerDialog" modal header="Let´s answer your question..." :style="{ width: '70vw' }">
    <template #default>
      <div class="p-1">
        Hi! I´m your RevDocs AI documentation assistant. Type in your question and I´ll try to find the answer for you.
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
            @click="info(doc.source)" />
        </div>
      </div>
      <div>
        <Button label="Close" class="mt-4" @click="showAnswerDialog = false; resetSearch();" />
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
        <Chip v-for="doc in searchResults" :key="doc.id" :label="doc.metadata.name" class="mt-2 cursor-pointer"
          @click="loadDocument({ id: doc.id, type: 'document' }); resetSearch(); showSearchResults = false;" />
      </div>
      <div>
        <Button label="Close" class="mt-4" @click="showSearchResults = false; resetSearch();" />
      </div>
    </template>
  </Dialog>

  <AppLayout>
    <template #logo>
      <img src="./../assets/logo.png" class="w-full cursor-pointer" @click="router.push({ name: 'home' })">
    </template>

    <template #appname>
      <GradientFont direction="rtl" start-color="#eaa3ff" end-color="#5e085a" style="font-weight: 800; font-size: 25px;">
        RevDocs
      </GradientFont>
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
      <li>
        <div class="flex align-content-center">
          <Dropdown small :options="$doc.languages" option-label="name" option-value="code" v-model="preferedLanguage" />
          <i class="fa-solid fa-language text-4xl ml-2 mt-1"></i>
        </div>
      </li>
    </template>

    <template #sidebar>
      <div class="flex flex-column">
        <!-- Tree -->
        <div style="height: calc(100vh - 6rem);" class="document-tree">
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
      <div v-else-if="$doc.selectedDocument != null && $doc.selectedDocument.type === 'document'">
        <h1>
          <GradientFont start-color="purple" end-color="#ff26a4">
            {{ $doc.selectedDocument?.name }}
          </GradientFont>
        </h1>
        <BlockEditor :read-only="true" v-model="page" :debug="false" :plugins="plugins" />
      </div>
    </template>

  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, ComputedRef, watch, Ref } from 'vue';
import Tree, { TreeNode } from 'primevue/tree';
import ProgressSpinner from 'primevue/progressspinner';
import { useDocumentStore } from '../stores/documents';
import { DocumentTreeItem } from '../services/data/types';
import { useGlobalStore } from '../stores/global';
import AppLayout from './../components/AppLayout.vue';
import GradientFont from './../components/GradientFont.vue';
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
import { useRouter } from 'vue-router';
import { error, info } from './../services/toast';
import { post } from "./../services/http";
import { AiSearchResult, DocumentMeta, DocumentSearchResult } from "./../types/global";

const router = useRouter();
const $doc = useDocumentStore(); // main store
const $global = useGlobalStore(); // global store
const loading = ref(false);

// ai search
const showAnswerDialog = ref(false);
const questionText = ref('');
const answerText = ref('');
const answerDependingDocuments: Ref<DocumentMeta[]> = ref([]);
// search dialog
const searchText = ref('');
const showSearchResults = ref(false);
const searchResults: Ref<DocumentSearchResult[]> = ref([]);

watch(searchText, () => {
  if (searchText.value.length > 0) {
    showSearchResults.value = true;
  }
});
// const searchMode: Ref<'simple' | 'ai'> = ref('search');

// selected language
// check if browser language is supported
const browserLanguageSupported = $doc.languages.find((l) => l.code === navigator.language.split('-')[0]);
const preferedLanguage = ref<string>(browserLanguageSupported?.code ?? $doc.baseLanguage);
watch(preferedLanguage, () => {
  if (!$doc.baseDocument) return;
  // const orgId = $doc.selectedDocument.id;
  // reset view
  // $doc.selectedDocument = null;
  // load document in new language
  $doc.getDocument($doc.baseDocument.id, preferedLanguage.value)
});

const page: ComputedRef<BlockPage> = computed(() => {
  return {
    blocks: $doc.selectedDocument?.content || [],
  };
});
const plugins = [PluginParagraph, PluginHeader, PluginMedium, PluginMarkdown];

// tree data
const selection = ref<Record<string, boolean>>({}); // selected node keys in tree (single selection enabled)

/**
 * search
 */
const search = async () => {
  loading.value = true;
  try {
    const res: DocumentSearchResult[] = await post(`${$global.aiSearchUrl}/search`, { text: searchText.value, count: 5 }, true);
    searchResults.value = res;
  } catch (e) {
    error(e + "");
  }
  loading.value = false;
}

/**
 * AI Search
 */
const aiSearch = async () => {
  // reset old values
  resetSearch();
  // fetch new answer
  loading.value = true;
  try {
    const res: AiSearchResult = await post(`${$global.aiSearchUrl}/question`, { text: questionText.value, count: 5 }, true);
    answerText.value = res.answer;
    answerDependingDocuments.value = res.documents;
  } catch (e) {
    error(e + "");
  }
  loading.value = false;
}

/**
 * reset search
 */
const resetSearch = () => {
  searchText.value = '';
  searchResults.value = [];
  questionText.value = '';
  answerText.value = '';
  answerDependingDocuments.value = [];
}

/**
 * load a document from API.
 */
const nodeSelected = ref<{ type: string; id: string, parent?: string } | null>(null);
const loadDocument = async (node: TreeNode) => {
  if (node.type === 'folder') return;
  const n = node as DocumentTreeItem;
  nodeSelected.value = { type: n.type, id: n.id, parent: n.parent };
  console.log('loadDocument', node.id);
  await $doc.getDocument(node.id, preferedLanguage.value);
};

// App Start
onMounted(async () => {
  // get the document store and initialize it
  $global.$state.isLoading = true;
  await $doc.initialize();
  // check if a document is selected
  if (!$doc.selectedDocument && $doc.documentsFlat.length > 0) {
    console.log('select first document');
    $doc.getDocument($doc.documentTree[0].id, preferedLanguage.value);
  }
  $global.$state.isLoading = false;
});
</script>

<style lang="scss">
.p-tree .p-tree-container .p-treenode {
  margin: 0;
  padding: 0;
}

.p-tree .p-tree-container .p-treenode .p-treenode-content {
  padding: 0rem;
}

.p-tree {
  border: none;
  padding: 0;
}

.darkmode .p-tree {
  background-color: #343434;
}

.p-dropdown .p-inputtext {
  padding: 5px;
}

.p-button.p-button-icon-only {
  width: auto !important;
}
</style>