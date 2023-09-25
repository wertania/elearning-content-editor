<template>
  <App class="document-editor" title="e-Learning Plattform">
    <template #toolbar>
      <Button label="New" @click="addDocument" />
      <Button label="Save" @click="saveDocument" severity="success" />
      <Button
        label="Close"
        @click="closeDocument"
        :disabled="!selectedDocument"
        severity="danger"
      />
    </template>

    <template #main>
      <div class="document-editor__main">
        <Tree
          class="document-editor__tree"
          selectionMode="single"
          v-model:selectionKeys="selection"
          :value="documentStore.documentTree"
          @node-select="handleSelection"
        />

        <ContentEditor
          v-if="selectedDocument"
          :selected-document="selectedDocument"
          v-model:editor-data="editorData"
        />

        <div v-else class="g-center-content">
          <Button
            v-if="selectedNode && selectedNode.type === 'document'"
            class="document-editor__load-button"
            @click="loadDocument"
          >
            Load &nbsp;
            <code>{{ selectedNode.name }}</code>
          </Button>

          <template v-else>Select a document node.</template>
        </div>
      </div>
    </template>
  </App>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Tree, { TreeNode } from 'primevue/tree';
import { useDocumentStore } from '../stores/documents';
import Button from 'primevue/button';
import { DocumentItem, DocumentTreeItem } from '../services/data/types';
import { guid } from '../services/guid';
import ContentEditor from '../components/ContentEditor.vue';
import { App } from 'hh-components';
import { BlockPage } from 'vue-blockful-editor';

// tree data
const documentStore = useDocumentStore();
const selection = ref<Record<string, boolean>>({});
const selectedDocument = ref<DocumentItem>();
const selectedNode = ref<DocumentTreeItem>();

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
    name: 'New_Document',
    header: 'New_Document',
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

  editorData.value.blocks = selectedDocument.value.content;
};

/**
 * Save the current document depending on the mode.
 */
const saveDocument = async () => {
  if (!selectedDocument.value) return;

  if (mode.value === 'new') {
    await documentStore.addDocument(selectedDocument.value);
  } else {
    await documentStore.updateDocument(selectedDocument.value);
  }

  selectedDocument.value = undefined;
  editorData.value.blocks = [];
};

const closeDocument = () => {
  if (!selectedDocument.value) return;

  const confirmed = confirm(
    'Are you sure you want to close the document? Save your progress before confirming!',
  );
  if (!confirmed) return;

  selectedDocument.value = undefined;
};
</script>

<style lang="scss">
.document-editor {
  &__main {
    display: grid;
    grid-template-columns: minmax(300px, 1fr) 3fr;
    gap: 1rem;
    height: 100%;
    padding: 0.5rem;
  }

  &__load-button {
    code {
      display: inline;
      background-color: var(--surface-500);
      padding: 0.1rem 0.2rem;
      border-radius: 0.2rem;
    }
  }
}
</style>
