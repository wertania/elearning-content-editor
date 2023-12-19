<template>
  <div class="plugin-markdown">
    <InkMde v-if="!readOnly" v-model="codeProxy" :options="options" />
    <div v-else v-html="parsedMarkdown" />
  </div>
</template>

<script lang="ts" setup>
import { InkMde } from 'ink-mde/vue';
import { computed } from 'vue';
import { BlockMarkdown } from './types';
import { parseMarkdown } from './../../services/markdown/liveparser';
import type { Options } from 'ink-mde';

const props = defineProps<{
  readOnly: boolean;
  modelValue: BlockMarkdown;
}>();

const emit = defineEmits<{
  'update:modelValue': [typeof props.modelValue];
}>();

const codeProxy = computed({
  get: () => props.modelValue.data.code,
  set: (value) => {
    const updated = { ...props.modelValue };
    updated.data.code = value;
    emit('update:modelValue', updated);
  },
});

/**
 * rendered plain HTML
 * used in read-only mode
 */
const parsedMarkdown = computed(() => {
  if (props.readOnly) {
    return parseMarkdown(props.modelValue.data.code);
  }
  // else this is not needed
  return '';
});

const options: Options = {
  interface: {
    toolbar: true,
  },
  toolbar: {
    bold: true,
    code: true,
    codeBlock: true,
    heading: true,
    image: false,
    italic: true,
    link: true,
    list: true,
    orderedList: true,
    quote: true,
    taskList: true,
    upload: false,
  },
};
</script>

<style lang="scss">
.plugin-markdown {
  .ink-mde-details {
    display: none !important;
  }

  .ink {
    --ink-editor-line-height: 1.5;
    --ink-block-background-color: var(--surface-100);
  }

  // For some reason, the caret is white by default and therefore not visible in light mode.
  .ink-mde .cm-content {
    caret-color: var(--ink-internal-color, currentColor) !important;
  }
}
</style>
