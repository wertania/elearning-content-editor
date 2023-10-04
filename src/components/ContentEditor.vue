<template>
  <div class="content-editor" v-if="selectedDocument">
    <MetaData
      v-model:header="selectedDocument.header"
      v-model:description="selectedDocument.description"
      v-model:lang-code="selectedDocument.langCode"
      v-model:name="selectedDocument.name"
      :hasOrigin="selectedDocument.originId != null"
    />

    <div class="content-editor__label">Content</div>
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
import {
  BlockEditor,
  PluginHeader,
  PluginParagraph,
  BlockPage,
} from 'vue-blockful-editor';
import MetaData from '../components/MetaData.vue';
import { PluginMedium } from './../blocks/medium';
import { PluginMarkdown } from './../blocks/markdown';
import { ref, computed } from 'vue';
import { useSelectedStore } from '../stores/selected';

// computed selectedDocument
const selectedStore = useSelectedStore();
const selectedDocument = computed({
  get() {
    return selectedStore.$state.selectedDocument;
  },
  set(newValue) {
    console.log('set selected document');
    selectedStore.$state.selectedDocument = newValue;
  },
});
const content = computed({
  get() {
    return selectedStore.$state.selectedDocument?.content || [];
  },
  set(newValue) {
    if (selectedStore.$state.selectedDocument == null) return;
    selectedStore.$state.selectedDocument.content = newValue;
  },
});

const page = ref<BlockPage>({
  blocks: content.value,
});

// block editor plugins
const plugins = [PluginParagraph, PluginHeader, PluginMedium, PluginMarkdown];
</script>

<style lang="scss">
@use 'vue-blockful-editor/style-mixin.scss' as vue-blockful-editor;

.content-editor {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  height: 100%;

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
  }
}
</style>
