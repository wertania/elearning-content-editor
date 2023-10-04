<template>
  <div class="meta-data__item">
    <label class="content-editor__label" for="name">
      Name for menu (please write in base language: {{ baseLang }})
    </label>
    <InputText
      id="name"
      :value="name"
      @update:model-value="$emit('update:name', $event)"
    />
  </div>

  <div class="meta-data__item">
    <label class="content-editor__label" for="header">Header</label>
    <InputText
      id="header"
      :value="header"
      @update:model-value="$emit('update:header', $event)"
    />
  </div>

  <div class="meta-data__item">
    <label class="content-editor__label" for="description">Description</label>
    <InputText
      id="description"
      :value="description"
      @update:model-value="$emit('update:description', $event)"
    />
  </div>

  <div class="meta-data__item">
    <label class="content-editor__label" for="langCode">
      Language Code
      {{ hasOrigin ? '' : ' (automatically set to base language)' }}
    </label>
    <Dropdown
      id="langCode"
      :disabled="!hasOrigin"
      :options="[
        { label: 'German', val: 'de' },
        { label: 'English', val: 'en' },
      ]"
      option-value="val"
      option-label="label"
      v-model="selectedLangCode"
      @update:model-value="$emit('update:langCode', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import { computed } from 'vue';

const baseLang = import.meta.env.VITE_BASE_LANGUAGE;

const props = defineProps<{
  name: string;
  header: string;
  description: string;
  langCode: string;
  hasOrigin: boolean;
}>();

const emit = defineEmits([
  'update:name',
  'update:header',
  'update:description',
  'update:langCode',
]);

const selectedLangCode = computed<string>({
  get: () => props.langCode,
  set: (value) => emit('update:langCode', value),
});
</script>

<style lang="scss">
.meta-data {
  &__item {
    display: flex;
    flex-direction: column;
  }
}
</style>
