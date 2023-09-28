<template>
  <div class="plugin-medium">
    <template v-if="loadedMedium?.url">
      <img v-if="loadedMedium.type === 'image'" :src="loadedMedium.url" />

      <video
        v-else-if="loadedMedium.type === 'video'"
        :src="loadedMedium.url"
      />

      <audio
        v-else-if="loadedMedium.type === 'audio'"
        :src="loadedMedium.url"
      />
    </template>

    <template v-else>
      <Button icon="upload" @click="openUpload" />
      <input
        ref="refInput"
        type="file"
        @change="handleUpload"
        icon="upload"
        hidden
      />
    </template>

    <Message v-if="isNotFound" severity="warn" :closable="false">
      The medium with ID {{ props.modelValue.data.id }} could not be found.
    </Message>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, computed } from 'vue';
import { BlockMedium } from './types';
import { dataProvider } from '../../services/data';
import Message from 'primevue/message';
import { Button } from 'hh-components';
import { Medium } from '../../services/data/types';
import uploader from '../../services/data/upload';

const props = defineProps<{
  readOnly: boolean;
  modelValue: BlockMedium;
}>();

const emit = defineEmits<{
  'update:modelValue': [typeof props.modelValue];
}>();

const mediumId = ref<string>();

const loadedMedium = ref<Medium>();

const refInput = ref<HTMLInputElement>();

const isNotFound = computed(
  () => props.modelValue.data.id && !loadedMedium.value?.url,
);

const openUpload = () => {
  refInput.value?.click();
};

// Update the stored medium ID.
const handleUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const id = await uploader.uploadMedium(file);
  const updated = { ...props.modelValue };
  updated.data.id = id;
  emit('update:modelValue', updated);
};

// Load the medium when the ID changes.
watch(
  () => props.modelValue.data.id,
  async (id) => {
    mediumId.value = id;
    if (!mediumId.value) return;

    loadedMedium.value = await dataProvider.getMedium(mediumId.value);
  },
  { immediate: true },
);
</script>

<style lang="scss">
.plugin-medium {
  img {
    margin: auto;
    width: 80%;
  }
}
</style>
