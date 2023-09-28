<template>
  <App class="document-editor" title="e-Learning Plattform">
    <template #toolbar>
      <Button label="New" @click="addDocument" :disabled="!!selectedDocument" />

      <Button
        label="Save"
        @click="saveDocument"
        severity="success"
        :disabled="!selectedDocument"
      />

      <Button
        label="Close"
        @click="closeDocument"
        :disabled="!selectedDocument"
        severity="danger"
      />

      <Button
        label="Delete"
        @click="deleteSelected"
        :disabled="!selectedNode"
        severity="danger"
      />
    </template>

    <template #main>
      <div class="document-editor__main">
        <div
          class="document-editor__tree-container"
          @dragover="handleDragOverContainer"
          @drop="handleContainerDrop"
        >
          <Tree
            class="document-editor__tree"
            selectionMode="single"
            v-model:selectionKeys="selection"
            :value="documentStore.documentTree"
            @node-select="handleSelection"
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
          v-if="selectedDocument"
          :selected-document="selectedDocument"
          v-model:editor-data="editorData"
        />

        <div v-else class="g-center-content">
          <Button
            class="document-editor__load-button"
            :disabled="!isDocumentSelected"
            @click="loadDocument"
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
  </App>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Tree, { TreeNode } from 'primevue/tree';
import { useDocumentStore } from '../stores/documents';
import Button from 'primevue/button';
import { DocumentItem, DocumentTreeItem } from '../services/data/types';
import { guid } from '../services/guid';
import ContentEditor from '../components/ContentEditor.vue';
import { App, toastService } from 'hh-components';
import { BlockPage } from 'vue-blockful-editor';

// tree data
const documentStore = useDocumentStore();
const selection = ref<Record<string, boolean>>({});
const selectedDocument = ref<DocumentItem>();
const selectedNode = ref<DocumentTreeItem>();

const draggedNode = ref<DocumentItem | null>(null);
const draggedOver = ref<DocumentItem | null>(null);

const isDocumentSelected = computed(
  () => selectedNode.value?.type === 'document',
);

// document handling
const mode = ref<'new' | 'edit'>('new');

// interactive editor state
const editorData = ref<BlockPage>({
  blocks: [],
});

const handleSelection = (node: TreeNode) => {
  selectedNode.value = node as DocumentTreeItem;
};

/**
 * Asynchronously load a document from API.
 */
const loadDocument = async () => {
  const selectedKeys = Object.keys(selection.value ?? {});

  if (!selectedKeys.length) return;

  const id = selectedKeys[0];

  mode.value = 'edit';
  selectedDocument.value = await documentStore.getDocument(id);
  editorData.value.blocks = selectedDocument.value.content;
};

/**
 * Add a new document.
 */
const addDocument = async () => {
  mode.value = 'new';
  selection.value = {};
  editorData.value.blocks = [];

  const parent =
    selectedNode.value?.type === 'folder'
      ? selectedNode.value.key
      : selectedNode.value?.parent;

  selectedDocument.value = {
    version: 1,
    type: 'document',
    parent,
    id: guid(),
    name: 'New document',
    header: '',
    description: '',
    langCode: 'de',
    content: [
      {
        type: 'paragraph',
        data: {
          text: 'Some text here...',
        },
      },
    ],
  };

  editorData.value = {
    blocks: selectedDocument.value.content,
  };
};

/**
 * Save the current document depending on the mode.
 */
const saveDocument = async () => {
  if (!selectedDocument.value) return;

  if (mode.value === 'new') {
    await documentStore.addDocument(selectedDocument.value);

    selectedDocument.value = undefined;
    editorData.value.blocks = [];
  } else {
    await documentStore.updateDocument(selectedDocument.value);

    toastService.success('Successfully saved the document!');
  }
};

const closeDocument = () => {
  if (!selectedDocument.value) return;

  const confirmed = confirm(
    'Are you sure you want to close the document? Save your progress before confirming!',
  );
  if (!confirmed) return;

  selectedDocument.value = undefined;
};

const deleteSelected = async () => {
  if (!selectedNode.value) return;

  const confirmed = confirm(
    `Are you sure you want to delete the selected ${selectedNode.value.type}?`,
  );

  if (!confirmed) return;

  await documentStore.dropNode(selectedNode.value.id);

  selectedDocument.value = undefined;
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
