<template>  
      <Toolbar>
          <template #start>            
            <SplitButton
              label="Add"
              icon="fa-solid fa-plus"
              :model="addmenu"
            />
            <Button
              icon="fa-solid fa-trash"
              class="ml-1"
              @click="deleteSelected"
              v-show="selectedNode"
              severity="danger"
            />
          </template>
          <template #end>
            <Button
              icon="fa-solid fa-save"
              class="ml-1"
              @click="saveDocument"
              severity="success"
              v-show="selectedStore.$state.selectedDocument && changesDetected"
            />
            <Button
            icon="fa-solid fa-times"
            class="ml-1"
            @click="closeDocument"
            v-show="selectedStore.$state.selectedDocument && changesDetected"
            severity="warning"
            />
        </template>
      </Toolbar>     

      <div class="document-editor__main">
        <div
          class="document-editor__tree-container document-tree"
          @dragover="handleDragOverContainer"
          @drop="handleContainerDrop"
        >
          <Tree
            class="document-editor__tree"
            selectionMode="single"
            v-model:selectionKeys="selection"
            :value="documentStore.documentTree"
            @node-select="handleSelection"
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

        <ContentEditor
          v-if="selectedStore.$state.selectedDocument"
        />

        <div v-else class="g-center-content">
          <Button
            class="document-editor__load-button"
            :disabled="!isDocumentSelected"
            @click="loadDocument()"
          >
            <template v-if="isDocumentSelected">
              Load &nbsp;
              <code> <i class="fa fa-file" /> {{ selectedNode?.name }} </code>
            </template>

            <template v-else> Select a document node. </template>
          </Button>
        </div>
      </div>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Tree, { TreeNode } from 'primevue/tree';
import { useDocumentStore } from '../stores/documents';
import Button from 'primevue/button';
import { DocumentItem, DocumentTreeItem } from '../services/data/types';
import ContentEditor from '../components/ContentEditor.vue';
import { info } from './../services/toast';
import Toolbar from 'primevue/toolbar';
import SplitButton from 'primevue/splitbutton';
import { useSelectedStore } from '../stores/selected';

// tree data
const documentStore = useDocumentStore();
const selectedStore = useSelectedStore();
const selection = ref<Record<string, boolean>>({});
// const selectedDocument = ref<DocumentItem>();
const selectedNode = ref<DocumentTreeItem>();

// document handling
// const mode = ref<'new' | 'edit'>('new');

const draggedNode = ref<DocumentItem | null>(null);
const draggedOver = ref<DocumentItem | null>(null);

const changesDetected = ref(true);

const isDocumentSelected = computed(
  () => selectedNode.value?.type === 'document',
);

// add documents
const addmenu = [
  {
      label: 'Add document',
      command: () => addDocument("document"),
  }, 
  {
      label: 'Add folder',
      command: () => addDocument("folder"),
  }, 
];

/**
 * Asynchronously load a document from API.
 */
const loadDocument = async (id?: string) => {
  let documentId = id ?? null;
  if (!documentId) {
    const selectedKeys = Object.keys(selection.value ?? {});
    if (!selectedKeys.length) return;
    documentId = selectedKeys[0];
  }
  selectedStore.$state.mode = 'edit';
  const document = await documentStore.getDocument(documentId);
  selectedStore.$state.selectedDocument = document;
};

/**
 * Handle the selection of a tree node.
 */
const handleSelection = async (node: TreeNode) => {
  // console.log('handleSelection', node);
  selectedNode.value = node as DocumentTreeItem;
  await loadDocument(selectedNode.value.id);
  // changesDetected.value = false;
};

/**
 * Add a new document.
 */
const addDocument = async (type: "folder" | "document" = "document") => {
  // console.log('addDocument', type);
  selectedStore.$state.mode = 'new';
  selection.value = {};

  const parent =
    selectedNode.value?.type === 'folder'
      ? selectedNode.value.key
      : selectedNode.value?.parent;

    selectedStore.$state.selectedDocument = {
    version: 1,
    type,
    parent,
    id: 'new-document-xxx',
    name: 'New ' + type,
    header: '',
    description: '',
    langCode: import.meta.env.VITE_DEFAULT_LANG_CODE as string,
    content: type === "document" ? [
      {
        type: 'header',
        data: {
          level: 1,
          text: 'New ' + type,
        },
      },
    ] : [],
  };
};

/**
 * Save the current document depending on the mode.
 */
const saveDocument = async () => {
  if (!selectedStore.$state.selectedDocument) return;

  if (selectedStore.$state.mode === 'new') {
    await documentStore.addDocument(selectedStore.$state.selectedDocument);

    // selectedDocument.value = undefined;
    // editorData.value.blocks = [];
    selectedStore.$state.mode = 'edit';
  } else {
    await documentStore.updateDocument(selectedStore.$state.selectedDocument);

    info('Successfully saved the document!');
  }
};

const closeDocument = () => {
  if (!selectedStore.$state.selectedDocument) return;

  const confirmed = confirm(
    'Are you sure you want to close the document? Save your progress before confirming!',
  );
  if (!confirmed) return;

  selectedStore.$state.selectedDocument = null;
};

const deleteSelected = async () => {
  if (!selectedNode.value) return;

  const confirmed = confirm(
    `Are you sure you want to delete the selected ${selectedNode.value.type}?`,
  );
  if (!confirmed) return;

  await documentStore.dropNode(selectedNode.value.id);

  selectedStore.$state.selectedDocument = null;
  selectedNode.value = undefined;
};

const handleDragStart = (event: DragEvent, parent: DocumentItem) => {
  if (!event.dataTransfer) return;
  draggedNode.value = parent;
};

const handleDragDrop = (event: DragEvent, parent: DocumentItem) => {
  event.preventDefault();

  if (parent.type !== 'folder') return;
  if (!event.dataTransfer) return;
  if (!draggedNode.value) return;

  documentStore.moveNode(draggedNode.value, parent);
};

const handleContainerDrop = (event: DragEvent) => {
  if (event.target !== event.currentTarget) return;
  if (!event.dataTransfer) return;
  if (!draggedNode.value) return;

  documentStore.moveNode(draggedNode.value, undefined);
};

const handleDragOver = (node: DocumentItem) => {
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
  &__main,
  .content-editor {
    overflow: auto;
  }

  &__main {
    display: grid;
    grid-template-columns: minmax(300px, 1fr) 3fr;
    gap: 1rem;
    height: 100%;
    padding: 0.5rem;
  }

  &__tree-container {
    display: flex;
    height: 100%;
    overflow: auto;
    padding: 1.25rem;
    border: 1px solid #dee2e6;
  }

  &__load-button {
    code {
      display: inline;
      background-color: var(--surface-500);
      padding: 0.2rem 0.4rem;
      border-radius: 0.4rem;
    }
  }

  &__tree-draggable {
    padding: 0.5rem;
  }
}

.p-tree {
  border: none;
  padding: 0;
}

.node-dragover {
  background-color: var(--surface-100);
}
</style>
