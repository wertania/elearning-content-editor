<template>
  <div v-if="!showDetails" class="flex card-container">
    <div class="flex-grow-1 flex align-items-center font-bold surface-100 border-round-md mr-2 pl-2">
      {{ header }}</div>
    <!-- <div class="flex-none flex align-items-center justify-content-center bg-blue-500 font-bold text-white m-2 px-5 py-3 border-round">PrimeFlex</div> -->
    <Button icon="fa-solid fa-pen" @click="showDetails = true" class="flex-none" />
  </div>
  <Transition :duration="550">
    <div v-if="showDetails" class="border-round-md p-2 border-300 border-solid border-1">
      <div class="meta-data__item">
        <label class="content-editor__label" for="name">
          Name for menu (please write in base language: {{ baseLang }})
        </label>
        <InputText small id="name" :value="name" @update:model-value="$emit('update:name', $event)" />
      </div>

      <div class="meta-data__item">
        <label class="content-editor__label" for="header">Header</label>
        <InputText small id="header" :value="header" @update:model-value="$emit('update:header', $event)" />
      </div>

      <div class="meta-data__item" v-show="type === 'document'">
        <label class="content-editor__label" for="description">Short description</label>
        <InputText small id="description" :value="description"
          @update:model-value="$emit('update:description', $event)" />
      </div>

      <div class="meta-data__item">
        <label class="content-editor__label" for="langCode">
          Language Code
          {{ hasOrigin ? '' : ' (automatically set to base language)' }}
        </label>
        <Dropdown small id="langCode" :disabled="!hasOrigin" :options="[
          { label: 'German', val: 'de' },
          { label: 'English', val: 'en' },
        ]" option-value="val" option-label="label" v-model="selectedLangCode"
          @update:model-value="$emit('update:langCode', $event)" />
      </div>
      <Button small label="Hide Details" @click="showDetails = false" class="mt-2 mb-2" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
/**
 * A component that allows editing the meta data of a document.
 * Will be rendered at the top of the content editor.
 */
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import { computed, ref } from 'vue';
import Button from 'primevue/button';

const baseLang = import.meta.env.VITE_BASE_LANGUAGE;

const props = defineProps<{
  name: string;
  header: string;
  description: string;
  langCode: string;
  hasOrigin: boolean;
  type: string;
}>();

const showDetails = ref<boolean>(false);
if (props.name === '' || props.header === '') {
  showDetails.value = true;
}

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

<style lang="scss" scoped>
.meta-data {
  &__item {
    display: flex;
    flex-direction: column;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease, height 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}</style>