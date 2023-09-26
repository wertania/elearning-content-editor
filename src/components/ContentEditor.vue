<template>
  <div class="content-editor">
    <MetaData
      v-model:header="selectedDocument.header"
      v-model:description="selectedDocument.description"
      v-model:lang-code="selectedDocument.langCode"
      v-model:name="selectedDocument.name"
    />

    <div class="content-editor__label">Content</div>
    <div class="content-editor__block-editor">
      <BlockEditor
        v-model="editorDataProxy"
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
import { computed, onMounted, onUnmounted } from 'vue';
import {
  BlockEditor,
  PluginHeader,
  PluginParagraph,
  BlockPage,
} from 'vue-blockful-editor';
import MetaData from '../components/MetaData.vue';
import { DocumentItem } from '../services/data/types';
import { PluginMedium } from './../blocks/medium';
import { PluginMarkdown } from './../blocks/markdown';

const props = defineProps<{
  selectedDocument: DocumentItem;
  editorData: BlockPage;
}>();

const emit = defineEmits<{
  'update:editorData': [typeof props.editorData];
}>();

const editorDataProxy = computed({
  get: () => props.editorData,
  set: (value) => emit('update:editorData', value),
});

// block editor plugins
const plugins = [PluginParagraph, PluginHeader, PluginMedium, PluginMarkdown];

const unloadEventListener = (e: BeforeUnloadEvent) => {
  e.preventDefault();
  e.returnValue = '';
};

onMounted(() => {
  window.addEventListener('beforeunload', unloadEventListener);
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', unloadEventListener);
});
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

  &__block-editor {
    @include vue-blockful-editor.styles;

    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
