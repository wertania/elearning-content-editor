<template>
  <Dialog v-model:visible="showAddLanguage" modal header="Add language" :style="{ width: '40vw' }">
    <template #default>
      <div class="p-1">
        <label>Select a language</label>
        <Dropdown :options="$doc.$state.missingLanguages" option-label="name" option-value="code"
          placeholder="Select a language" class="w-full mt-2" v-model="languageToAdd"
          :disabled="$global.$state.requestPending" />
        <div class="flex flex-row flex-wrap h-4 mt-4">
          <label class="block">Pre-Translate via AI?</label>
          <Checkbox :binary="true" class="ml-2" v-model="translateViaAI" :disabled="$global.$state.requestPending" />
        </div>
        <div class="flex flex-row flex-wrap h-4 mt-5">
          <Button icon="fa-solid fa-check" @click="addTranslationToDocument()" label="Add translation"
            :disabled="$global.$state.requestPending">
          </Button>
          <Button icon="fa-solid fa-close" label="Cancel" class="ml-1" @click="showAddLanguage = false"
            :disabled="$global.$state.requestPending"></Button>
        </div>
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
      <SplitButton class="ml-5" size="small" @click="addDocument('document')" label="Add" icon="fa-solid fa-plus"
        :model="menuAdd" />
      <ConfirmPopup />
      <Button size="small" icon="fa-solid fa-trash" class="ml-1 bg-purple-600 border-none" @click="deleteSelected($event)"
        v-show="$doc.$state.selectedDocument" />
      <!-- <span class="p-input-icon-left ml-3">
        <i class="fa-solid fa-search" />
        <InputText placeholder="Search" class="w-12rem surface-100 border-round-lg border-none h-3rem font-medium"
          size="small" />
      </span> -->
    </template>

    <template #end>
      <li>
        <Button icon="fa-solid fa-photo-film" size="small" class="bg-purple-600 border-none" @click="openMediaBrowser"
          v-show="$doc.$state.selectedDocument" />
      </li>
      <li>
        <Button icon="fa-solid fa-save" size="small" class="bg-purple-600 border-none" @click="saveDocument"
          v-show="$doc.$state.selectedDocument" />
      </li>
      <li>
        <Button icon="fa-solid fa-times" size="small" class="bg-purple-600 border-none" @click="closeDocument"
          v-show="$doc.$state.selectedDocument" />
      </li>
    </template>

    <template #sidebar>
      <div class="flex flex-column">
        <!-- Tree -->
        <div style="height: calc(100vh - 6rem - 100px);" class="document-tree" @dragover="handleDragOverContainer"
          @drop="handleContainerDrop">
          <Tree class="document-editor__tree" selectionMode="single" v-model:selectionKeys="selection"
            :value="$doc.documentTree" @node-select="loadDocument" :disabled="true">
            <template #default="slotProps">
              <div class="document-editor__tree-draggable" :class="{
                'node-dragover': slotProps.node.id === draggedOver?.id,
              }" :draggable="true" @dragover="handleDragOver(slotProps.node)"
                @dragstart="handleDragStart($event, slotProps.node)" @drop="handleDragDrop($event, slotProps.node)"
                @dragend="handleDragEnd">
                <span>{{ slotProps.node.name }}</span>
              </div>
            </template>
          </Tree>
        </div>
        <!-- Settings -->
        <div class="border-round-md shadow-3" v-show="$doc.$state.selectedDocument != null">
          <div class="flex flex-column card-container">
            <div class="flex m-1 h-2rem p-2">
              <i class="fa-solid fa-language mt-1 ml-1 mr-2"></i>Assigned translations
            </div>
            <div class="flex flex-row flex-wrap m-2">
              <Button small icon="fa-solid fa-plus" @click="showAddLanguage = true"
                :disabled="$doc.$state.missingLanguages.length < 1" class="bg-purple-600"></Button>
              <Dropdown small v-model="$doc.$state.selectedLanguage" :options="$doc.$state.availableLanguages"
                option-label="name" option-value="code" class="ml-1 flex-auto"
                :disabled="$doc.availableLanguages.length < 2" @change="switchLanguage" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #content>
      <div v-if="$global.$state.isLoading || $global.$state.requestPending"
        class="flex justify-content-center flex-wrap mt-5">
        <ProgressSpinner />
      </div>
      <ContentEditor v-else-if="$doc.$state.selectedDocument" :key="$doc.$state.selectedDocument.id" />
      <div v-else class="text-center text-xl mt-5">Nothing to show. Please select a document node.</div>
    </template>

  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Tree, { TreeNode } from 'primevue/tree';
import ProgressSpinner from 'primevue/progressspinner';
import { useDocumentStore } from '../stores/documents';
import Button from 'primevue/button';
import { DocumentItem, DocumentTreeItem } from '../services/data/types';
import ContentEditor from '../components/ContentEditor.vue';
// import AppToolbar from '../components/AppToolbar.vue';
import SplitButton from 'primevue/splitbutton';
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';
import Checkbox from 'primevue/checkbox';
import ConfirmPopup from 'primevue/confirmpopup';
import { useGlobalStore } from '../stores/global';
import { useConfirm } from "primevue/useconfirm";
import AppLayout from './../components/AppLayout.vue';
import GradientFont from './../components/GradientFont.vue';
import { useRouter } from 'vue-router';

const confirm = useConfirm(); // confirm dialog
const $doc = useDocumentStore(); // main store
const $global = useGlobalStore(); // global store
const router = useRouter(); // router

// "add" split-button
const menuAdd = [
  {
    label: 'Add document',
    command: () => addDocument('document'),
  },
  {
    label: 'Add folder',
    command: () => addDocument('folder'),
  },
  {
    label: 'Add smart video',
    command: () => router.push({ name: 'smart-video-converter' }),
  },
];

// tree data
const selection = ref<Record<string, boolean>>({}); // selected node keys in tree (single selection enabled)

// add language dialog
const showAddLanguage = ref(false); // control: dialog for adding a new language
const translateViaAI = ref(true); // checkbox: translate via AI
const languageToAdd = ref('en'); // dropdown: language to add

// drag and drop states
const draggedNode = ref<DocumentItem | null>(null);
const draggedOver = ref<DocumentItem | null>(null);

/**
 * load a document from API.
 */
const nodeSelected = ref<{ type: string; id: string, parent?: string } | null>(null);
const loadDocument = async (node: TreeNode) => {
  const n = node as DocumentTreeItem;
  nodeSelected.value = { type: n.type, id: n.id, parent: n.parent };
  console.log('loadDocument', node.id);
  $doc.$state.editMode = 'edit';
  await $doc.getDocument(node.id);
  if ($doc.$state.missingLanguages.length > 0) {
    languageToAdd.value = $doc.$state.missingLanguages[0].code;
  }
};

/**
 * change the language
 */
const switchLanguage = async (data: any) => {
  await $doc.switchLanguage(data.value);
};

/**
 * add a new language
 */
const addTranslationToDocument = async () => {
  $global.$state.requestPending = true;
  await $doc.addTranslation(true, languageToAdd.value);
  showAddLanguage.value = false;
  $global.$state.requestPending = false;
};

/**
 * Add a new document.
 */
const addDocument = async (type: 'folder' | 'document' = 'document') => {
  $doc.addEmtpyDocument(type, nodeSelected.value?.type === 'folder' ? nodeSelected.value?.id : nodeSelected.value?.parent);
};

/**
 * Save the current document depending on the mode.
 */
const saveDocument = async () => {
  if (!$doc.$state.selectedDocument) return;
  // first save
  if ($doc.$state.editMode === 'new') {
    await $doc.addDocument($doc.$state.selectedDocument);
    $doc.$state.editMode = 'edit';
  }
  // save openend document
  else {
    await $doc.updateDocument($doc.$state.selectedDocument);
  }
};

/**
 * only clear the selected document.
 */
const closeDocument = () => {
  if (!$doc.$state.selectedDocument) return;
  $doc.resetSelectedDocument();
  selection.value = {};
};

/**
 * Delete the selected document.
 */
const deleteSelected = (event: any) => {
  console.log('deleteSelected', event);
  confirm.require({
    target: event.currentTarget,
    message: 'Are you sure you want to proceed?',
    icon: 'fa-solid fa-trash',
    accept: async () => {
      if (!$doc.$state.selectedDocument) return;
      await $doc.dropNode($doc.$state.selectedDocument.id);
    },
  });
};

/**
 * Open the media browser for the current document.
 */
const openMediaBrowser = () => {
  // router.push({ name: 'media', params: { documentId: $doc.$state.selectedDocument?.id } });
  // open in new tab
  window.open(`/#/media/${$doc.$state.selectedDocument?.id}`, '_blank');
};

/**
 * Drag n drop support 
 */
const handleDragStart = (event: DragEvent, parent: any /*DocumentItem*/) => {
  if (!event.dataTransfer) return;
  draggedNode.value = parent;
};
const handleDragDrop = (event: DragEvent, parent: any /*DocumentItem*/) => {
  event.preventDefault();

  if (parent.type !== 'folder') return;
  if (!event.dataTransfer) return;
  if (!draggedNode.value) return;

  $doc.moveNode(draggedNode.value, parent);
};
const handleContainerDrop = (event: DragEvent) => {
  if (event.target !== event.currentTarget) return;
  if (!event.dataTransfer) return;
  if (!draggedNode.value) return;

  $doc.moveNode(draggedNode.value, undefined);
};
const handleDragOver = (node: any /*DocumentItem*/) => {
  draggedOver.value = node;
};
const handleDragOverContainer = (event: DragEvent) => {
  if (draggedOver.value?.type === 'document') return;

  if (event.target === event.currentTarget) {
    draggedOver.value = null;
  }

  event.preventDefault();
};
const handleDragEnd = () => {
  draggedOver.value = null;
};

// App Start
onMounted(async () => {
  // get the document store and initialize it
  $global.$state.isLoading = true;
  await $doc.initialize();
  $global.$state.isLoading = false;
});
</script>

<style lang="scss">
.p-splitbutton button {
  background-color: #852196;
}

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

.node-dragover {
  background-color: var(--surface-100);
}

.p-dropdown .p-inputtext {
  padding: 10px;
}

.p-button.p-button-icon-only {
  width: auto !important;
}
</style>