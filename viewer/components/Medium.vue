<template>
  <ClientOnly>
    <template v-if="isLoading"> Loading... </template>

    <template v-else-if="medium && mediumUrl">
      <img v-if="medium.type === 'image'" :src="mediumUrl" />
      <audio v-if="medium.type === 'audio'" :src="mediumUrl" />
      <video v-if="medium.type === 'video'" :src="mediumUrl" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { vitepressDataProvider } from '../services/vitepressDataService';
import type { Medium } from '../../src/services/data/types';

const props = defineProps<{
  medium: Medium;
}>();

const isLoading = ref(true);
const mediumUrl = ref<string>();

const loadMediumUrl = async () => {
  isLoading.value = true;
  mediumUrl.value = await vitepressDataProvider.getMediumUrl(props.medium.id);
  isLoading.value = false;
};

onMounted(async () => {
  // Load the medium's URL.
  await loadMediumUrl();
});
</script>
