<template>
  <div class="content-editor">
    <MetaData
      v-model:header="selectedDocument.header"
      v-model:description="selectedDocument.description"
      v-model:lang-code="selectedDocument.langCode"
      v-model:name="selectedDocument.name"
    />

    <div class="content-editor__label">Content</div>
    <div class="block-editor">
      <BlockEditor
        v-model="editorDataProxy"
        :readOnly="false"
        :debug="false"
        :plugins="plugins"
        :showAllBlockControls="true"
        :disableColumns="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  BlockEditor,
  PluginHeader,
  PluginParagraph,
  BlockPage,
} from 'vue-blockful-editor';
import MetaData from '../components/MetaData.vue';
import { DocumentItem } from '../services/data/types';
import { PluginVideo } from './../blocks/video';

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
const plugins = [
  PluginParagraph,
  PluginHeader,
  PluginVideo, // custom block zum speichern der video url.
  // hier fehlt noch der markdown block. die anderen sind unrelevant. => https://thieleundklose.atlassian.net/browse/HH-390
];
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

  .block-editor {
    @include vue-blockful-editor.styles;

    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
