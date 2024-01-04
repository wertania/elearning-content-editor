<template>
  <div class="content-editor" v-if="selectedDocument">
    <MetaData
      v-model:header="selectedDocument.header"
      v-model:description="selectedDocument.description"
      v-model:lang-code="selectedDocument.langCode"
      v-model:name="selectedDocument.name"
      v-model:hidden="selectedDocument.hidden"
      :hasOrigin="selectedDocument.originId != null"
      :type="selectedDocument.type"
    />

    <!-- <div class="content-editor__label">Content</div> -->
    <div class="content-editor__block-editor">
      <BlockEditor
        v-if="selectedDocument.type === 'document'"
        v-model="page"
        :readOnly="false"
        :debug="false"
        :plugins="plugins"
        :showAllBlockControls="true"
        :disableColumns="true"
      />
    </div>

    <!-- Dummy container that adds whitespace to the editor area for usability. -->
    <div style="flex: 0 0 50vh" />
  </div>
</template>

<script setup lang="ts">
/**
 * A component that allows editing the content of a document.
 * A document is a blockful page. For that reason, the BlockEditor is used.
 */
import {
  BlockEditor,
  PluginHeader,
  PluginParagraph,
  BlockPage,
} from 'vue-blockful-editor';
import MetaData from '../components/MetaData.vue';
import { PluginMedium } from './../blocks/medium';
import { PluginMarkdown } from './../blocks/markdown';
import { PluginPdf } from './../blocks/pdf';
import { ref, computed } from 'vue';
import { useDocumentStore } from '../stores/documents';

// computed selectedDocument
const $doc = useDocumentStore();

const selectedDocument = computed({
  get() {
    return $doc.$state.selectedDocument;
  },
  set(newValue) {
    $doc.$state.selectedDocument = newValue;
  },
});

const content = computed({
  get() {
    return $doc.$state.selectedDocument?.content || [];
  },
  set(newValue) {
    if ($doc.$state.selectedDocument == null) return;
    $doc.$state.selectedDocument.content = newValue;
  },
});

const page = ref<BlockPage>({
  blocks: content.value,
});

// block editor plugins
const plugins = [
  PluginParagraph,
  PluginHeader,
  PluginMedium,
  PluginMarkdown,
  PluginPdf,
];
</script>

<style lang="scss">
@use 'vue-blockful-editor/style-mixin.scss' as vue-blockful-editor;

.content-editor {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  height: calc(100vh - 105px);
  overflow-y: scroll;

  &__label {
    font-size: 0.9em;
    font-weight: 300;
    color: var(--surface-500);
    margin-bottom: 0.25rem;
  }

  .vbe {
    @include vue-blockful-editor.style;

    display: flex;
    flex-direction: column;
    gap: 1rem;

    overflow: auto;

    // Fix for small devices.
    .flex.m-0 {
      width: 100%;
      display: grid !important;
      grid-template-columns: auto 1fr;
      gap: 0.5rem;

      > * {
        width: auto !important;
      }
    }
  }
}
</style>
