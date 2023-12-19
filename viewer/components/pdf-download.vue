<template>
  <div class="pdf-container">
    <span>{{ name }}</span>
    <VPButton :href="url" text="Download" theme="alt" />
    <div class="pdf-container-preview">
      <iframe :src="url" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { VPButton } from "vitepress/theme";

defineProps<{
  url: string;
  name: string;
}>();
</script>

<style>
.pdf-container {
  margin: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  background-color: var(--vp-c-default-soft);
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.pdf-container > * {
  margin: 0.5rem;
}

.pdf-container-preview {
  width: 100%;
  height: auto;
  max-height: 80vh;
  aspect-ratio: 1 / 1.414;
}

iframe {
  border: none;
  width: 100%;
  height: 100%;
}
</style>
