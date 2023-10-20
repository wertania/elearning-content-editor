<template>
  <AppLayout>
    <template #logo>
      <img src="./../assets/logo.png" class="w-full">
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
          size="small" />
      </span>
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
      <BlockEditor v-else-if="$doc.selectedDocument != null" :read-only="true"
        v-if="$doc.selectedDocument.type === 'document'" v-model="page" :debug="false" :plugins="plugins" />
    </template>

  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, ComputedRef, watch } from 'vue';
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

const $doc = useDocumentStore(); // main store
const $global = useGlobalStore(); // global store

// selected language
// check if browser language is supported
const browserLanguageSupported = $doc.languages.find((l) => l.code === navigator.language.split('-')[0]);
const preferedLanguage = ref<string>(browserLanguageSupported?.code ?? $doc.baseLanguage);
watch(preferedLanguage, () => {
  if (!$doc.selectedDocument) return;
  // const orgId = $doc.selectedDocument.id;
  // reset view
  // $doc.selectedDocument = null;
  // load document in new language
  $doc.getDocument($doc.selectedDocument.id, preferedLanguage.value)
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