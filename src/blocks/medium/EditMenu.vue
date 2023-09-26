<template>
  <div class="plugin-medium-edit-menu">
    <label for="id"> Medium ID </label>
    <InputText
      id="id"
      v-model="idProxy"
      @keydown.enter="handleSubmit"
      @blur="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { BlockMedium } from './types';
import InputText from 'primevue/inputtext';

const props = defineProps<{
  readOnly: boolean;
  modelValue: BlockMedium;
}>();

const emit = defineEmits<{
  'update:modelValue': [typeof props.modelValue];
}>();

const idProxy = ref<typeof props.modelValue.data.id>();

watch(
  () => props.modelValue.data.id,
  (id) => (idProxy.value = id),
  { immediate: true },
);

const handleSubmit = () => {
  const updated = { ...props.modelValue };
  updated.data.id = idProxy.value;
  emit('update:modelValue', updated);
};
</script>

<style lang="scss">
.plugin-medium-edit-menu {
  display: grid;
  grid-template-columns: auto auto;
  gap: 0.5rem;
  place-content: center;
  align-items: center;

  .p-inputtext {
    width: 100%;
    height: 2rem;
    border: 1px solid var(--surface-300);
  }
}
</style>
