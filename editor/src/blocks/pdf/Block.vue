<template>
  <div class="plugin-pdf">
    <template v-if="pdfUrl">
      <div class="plugin-pdf__pdf-container">
        <iframe :src="pdfUrl" />
      </div>
    </template>

    <template v-else-if="!readOnly">
      <FileUpload
        custom-upload
        :multiple="false"
        @uploader="uploader"
        accept="application/pdf"
        mode="advanced"
      />
    </template>

    <Message v-if="isNotFound && !loading" severity="warn" :closable="false">
      The medium with ID {{ props.modelValue.data.id }} could not be found.
    </Message>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, computed } from "vue";
import { BlockPdf } from "./types";
import { dataProvider } from "../../services/data";
import Message from "primevue/message";
import FileUpload, { type FileUploadUploaderEvent } from "primevue/fileupload";

const uploader = async (e: FileUploadUploaderEvent) => {
  const file = Array.isArray(e.files) ? e.files[0] : e.files;

  // Upload the medium and receive an ID.
  const id = await dataProvider.addPDF(file);

  // Update the stored medium ID.
  const updated = props.modelValue;
  updated.data.id = id;
  emit("update:modelValue", updated);
};

const props = defineProps<{
  readOnly: boolean;
  modelValue: BlockPdf;
}>();

const emit = defineEmits<{
  "update:modelValue": [typeof props.modelValue];
}>();

const pdfUrl = ref<null | string>(null);
const isNotFound = computed(() => props.modelValue.data.id && !pdfUrl.value);

// Load the URL when the ID changes.
const loading = ref(true);

watch(
  [() => props.modelValue.data.id, () => props.readOnly],
  async ([id]) => {
    pdfUrl.value = null;
    if (!id) return;

    loading.value = true;

    try {
      pdfUrl.value = await dataProvider.getPDFUrl(id);
    } catch {}

    loading.value = false;
  },
  { immediate: true },
);
</script>

<style lang="scss">
.plugin-pdf {
  img {
    margin: auto;
    width: 80%;
  }

  &__pdf-container {
    width: 100%;
    height: auto;
    max-height: 80vh;
    aspect-ratio: 1 / 1.414; // DIN A4

    iframe {
      border: none;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
