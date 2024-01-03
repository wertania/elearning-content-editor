<template>
  <div class="plugin-medium">
    <template v-if="mediumUrl && loadedMedium">
      <img
        class="mt-3 mb-3"
        v-if="loadedMedium.type === 'image'"
        :src="mediumUrl"
      />

      <video
        class="mt-3 mb-3 w-full"
        v-else-if="loadedMedium.type === 'video'"
        :src="mediumUrl"
        controls
      />

      <audio
        class="mt-3 mb-3 w-full"
        v-else-if="loadedMedium.type === 'audio'"
        :src="mediumUrl"
      />

      <Message v-else severity="warn">
        Unknown medium type "{{ loadedMedium.type }}".
      </Message>
    </template>

    <template v-else-if="!readOnly">
      <FileUpload
        custom-upload
        :multiple="false"
        @uploader="uploader"
        mode="advanced"
      />
    </template>

    <Message v-if="isNotFound && !loading" severity="warn" :closable="false">
      The medium with ID {{ props.modelValue.data.id }} could not be found.
    </Message>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, computed } from 'vue';
import { BlockMedium } from './types';
import { dataProvider } from '../../services/data';
import Message from 'primevue/message';
import FileUpload, { type FileUploadUploaderEvent } from 'primevue/fileupload';
import { Medium } from '../../services/data/types';
import { useDocumentStore } from '../../stores/documents';

const $documents = useDocumentStore();

const uploader = async (e: FileUploadUploaderEvent) => {
  const file = Array.isArray(e.files) ? e.files[0] : e.files;

  // Upload the medium and receive an ID.
  const { id } = await dataProvider.addMedium(
    file,
    $documents.selectedDocument?.langCode || $documents.baseLanguage,
  );

  // Update the stored medium ID.
  const updated = props.modelValue;
  updated.data.id = id;
  emit('update:modelValue', updated);
};

const props = defineProps<{
  readOnly?: boolean;
  modelValue: BlockMedium;
}>();

const emit = defineEmits<{
  'update:modelValue': [typeof props.modelValue];
}>();

const mediumId = ref<string>();
const loadedMedium = ref<Medium>();
const mediumUrl = ref<null | string>(null);
const isNotFound = computed(() => props.modelValue.data.id && !mediumUrl.value);

// Load the medium when the ID changes.
const loading = ref(true);
watch(
  () => props.modelValue.data.id,
  async (id) => {
    mediumId.value = id;
    if (!mediumId.value) return;

    loadedMedium.value = await dataProvider.getMedium(mediumId.value);

    // get URL
    if (!loadedMedium.value) return;
    mediumUrl.value = await dataProvider.getMediumUrl(loadedMedium.value.id);
    loading.value = false;
  },
  { immediate: true },
);
</script>

<style lang="scss">
.plugin-medium {
  img {
    margin: auto;
    width: auto;
  }
}
</style>
