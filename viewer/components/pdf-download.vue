<template>
  <div class="pdf-download">
    <span>{{ name }}</span>
    <VPButton :href="url" text="Download" theme="alt" />
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
.pdf-download {
  margin: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  background-color: var(--vp-c-default-soft);
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.pdf-download > * {
  margin: 0.5rem;
}
</style>
