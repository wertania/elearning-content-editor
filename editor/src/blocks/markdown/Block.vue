<template>
  <div class="plugin-markdown">
    <InkMde v-model="codeProxy" />
  </div>
</template>

<script lang="ts" setup>
import { InkMde } from 'ink-mde/vue';
import { computed } from 'vue';
import { BlockMarkdown } from './types';

const props = defineProps<{
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
