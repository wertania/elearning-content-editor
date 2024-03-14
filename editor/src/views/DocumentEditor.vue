<template>
  <Dialog
    v-model:visible="showAddLanguage"
    modal
    header="Add language"
    :style="{ width: '40vw' }"
  >
    <template #default>
      <div class="p-1">
        <label>Select a language</label>
        <Dropdown
          :options="$doc.$state.missingLanguages"
          option-label="name"
          option-value="code"
          placeholder="Select a language"
          class="w-full mt-2"
          v-model="languageToAdd"
          :disabled="$global.$state.requestPending"
        />
        <div class="flex flex-row flex-wrap h-4 mt-4">
          <label class="block">Pre-Translate via AI?</label>
          <Checkbox
            :binary="true"
            class="ml-2"
            v-model="translateViaAI"
            :disabled="$global.$state.requestPending"
          />
        </div>
        <div class="flex flex-row flex-wrap h-4 mt-5">
          <Button
            icon="fa-solid fa-check"
            @click="addTranslationToDocument()"
            label="Add translation"
            :disabled="$global.$state.requestPending"
          >
          </Button>
          <Button
            icon="fa-solid fa-close"
            label="Cancel"
            class="ml-1"
            @click="showAddLanguage = false"
            :disabled="$global.$state.requestPending"
          ></Button>
        </div>
      </div>
    </template>
  </Dialog>

  <AppLayout ref="appLayoutRef">
    <template #logo>
      <img
        :src="logoUrl"
        class="w-full cursor-pointer"
        @click="router.push({ name: 'view' })"
      />
    </template>

    <template #appname>
      <h2>{{ appName }}</h2>
    </template>

    <template #start>
      <SplitButton
        class="ml-5"
        size="small"
        @click="addDocument('document')"
        label="Add"
        icon="fa-solid fa-plus"
        :model="menuAdd"
        v-tooltip="'Add entry'"
      />
      <ConfirmPopup />
      <Button
        size="small"
        icon="fa-solid fa-trash"
        class="ml-1 border-none"
        @click="deleteSelected($event)"
        v-show="$doc.$state.selectedDocument"
        v-tooltip="'Delete entry'"
      />
      <!-- <span class="p-input-icon-left ml-3">
        <i class="fa-solid fa-search" />
        <InputText placeholder="Search" class="w-12rem surface-100 border-round-lg border-none h-3rem font-medium"
          size="small" />
      </span> -->
    </template>

    <template #end>
      <div class="flex flex-row gap-1">
        <Button
          icon="fa-solid fa-arrow-up-right-from-square"
          size="small"
          class="border-none"
          @click="openViewer"
          v-show="$doc.$state.selectedDocument"
          v-tooltip="'Show document in viewer'"
        />

        <Button
          icon="fa-solid fa-photo-film"
          size="small"
          class="border-none"
          @click="openMediaBrowser"
          v-show="$doc.$state.selectedDocument"
          v-tooltip="'Show media for this document'"
        />

        <Button
          icon="fa-solid fa-save"
          size="small"
          class="border-none"
          @click="saveDocument"
          v-show="$doc.$state.selectedDocument"
          v-tooltip="'Save document'"
        />

        <Button
          icon="fa-solid fa-times"
          size="small"
          class="border-none"
          @click="closeDocument"
          v-show="$doc.$state.selectedDocument"
          v-tooltip="'Close document'"
        />
      </div>
    </template>

    <template #sidebar>
      <div class="flex flex-column h-full flex-grow-1 gap-2">
        <!-- Tree -->
        <div
          class="document-tree flex-grow-1"
          @dragover="handleDragOverContainer"
          @drop="handleContainerDrop"
        >
          <Tree
            class="document-editor__tree"
            selectionMode="single"
            v-model:selectionKeys="selection"
            v-model:expanded-keys="$doc.expandedKeys"
            :value="$doc.documentTree"
            @node-select="loadDocument"
            :disabled="true"
          >
            <template #default="slotProps">
              <div
                class="document-editor__tree-draggable"
                :class="{
                  'node-dragover': slotProps.node.id === draggedOver?.id,
                }"
                :draggable="true"
                @dragover="handleDragOver(slotProps.node)"
                @dragstart="handleDragStart($event, slotProps.node)"
                @drop="handleDragDrop($event, slotProps.node)"
                @dragend="handleDragEnd"
              >
                <span>{{ slotProps.node.name }}</span>
              </div>
            </template>
          </Tree>
        </div>
        <!-- Settings -->
        <div
          class="border-round-md shadow-3"
          v-show="
            $doc.$state.selectedDocument != null &&
            $doc.$state.selectedDocument.type === 'document'
          "
        >
          <div class="flex flex-column card-container">
            <div class="flex m-1 h-2rem p-2">
              <i class="fa-solid fa-language mt-1 ml-1 mr-2"></i>Assigned
              translations
            </div>
            <div class="flex flex-row flex-wrap m-2">
              <Button
                small
                icon="fa-solid fa-plus"
                @click="showAddLanguage = true"
                :disabled="$doc.$state.missingLanguages.length < 1"
                v-tooltip="'Add translation'"
              ></Button>
              <Dropdown
                small
                v-model="$doc.$state.selectedLanguage"
                :options="$doc.$state.availableLanguages"
                option-label="name"
                option-value="code"
                class="ml-1 flex-auto"
                :disabled="$doc.availableLanguages.length < 2"
                @change="switchLanguage"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #content>
      <div
        v-if="$global.$state.isLoading || $global.$state.requestPending"
        class="flex justify-content-center flex-wrap mt-5"
      >
        <ProgressSpinner />
      </div>
      <ContentEditor
        v-else-if="$doc.$state.selectedDocument"
        :key="$doc.$state.selectedDocument.id"
      />
      <div v-else class="text-center text-xl mt-5">
        Nothing to show. Please select a document node.
      </div>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Tree from 'primevue/tree';
import { TreeNode } from 'primevue/treenode';
import ProgressSpinner from 'primevue/progressspinner';
import { useDocumentStore } from '../stores/documents';
import Button from 'primevue/button';
import { DocumentItem, DocumentTreeItem } from '../services/data/types';
import ContentEditor from '../components/ContentEditor.vue';
import SplitButton from 'primevue/splitbutton';
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';
import Checkbox from 'primevue/checkbox';
import ConfirmPopup from 'primevue/confirmpopup';
import { useGlobalStore } from '../stores/global';
import { useConfirm } from 'primevue/useconfirm';
import AppLayout from './../components/AppLayout.vue';
import { useRouter } from 'vue-router';

const confirm = useConfirm(); // confirm dialog
const $doc = useDocumentStore(); // main store
const $global = useGlobalStore(); // global store
const router = useRouter(); // router
const appName = import.meta.env.VITE_TEMPLATE_APP_NAME ?? 'RevDocs';
const logoUrl =
  import.meta.env.VITE_TEMPLATE_LOGO_URL ?? './../assets/logo.png';

const appLayoutRef = ref<InstanceType<typeof AppLayout>>();

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
    label: 'Manage smart videos',
    command: () => router.push({ name: 'smart-video-dashboard' }),
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
const nodeSelected = ref<{ type: string; id: string; parent?: string } | null>(
  null,
);
const loadDocument = async (node: TreeNode) => {
  $global.requestPending = true;

  const n = node as DocumentTreeItem;
  nodeSelected.value = { type: n.type, id: n.id, parent: n.parent };
  $doc.$state.editMode = 'edit';

  router.push({ name: 'edit', params: { documentId: node.id } });

  if ($doc.$state.missingLanguages.length > 0) {
    languageToAdd.value = $doc.$state.missingLanguages[0].code;
  }

  $global.requestPending = false;

  appLayoutRef.value?.closeSidebar();
};

/**
 * change the language
 */
const switchLanguage = async (data: any) => {
  router.push({
    name: 'edit',
    params: {
      documentId: $doc.$state.baseDocument?.id,
    },
    query: { lang: data.value },
  });
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
  $doc.addEmtpyDocument(
    type,
    nodeSelected.value?.type === 'folder'
      ? nodeSelected.value?.id
      : nodeSelected.value?.parent,
  );
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
 * Open the viewer for the current document.
 */
const openViewer = () => {
  window.open(`/#/view/${$doc.$state.selectedDocument?.id}`, '_self');
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
</script>

<style lang="scss">
.document-editor {
  &__tree {
    min-width: fit-content;
    height: 100%;
    padding: 0.5rem;
  }
}
</style>
