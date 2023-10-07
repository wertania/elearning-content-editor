<template>
  <template v-if="isLoading"> Loading... </template>
  <template v-else-if="id && mediumUrl">
    <img v-if="type === 'image'" :src="mediumUrl" style="width: 100%;" />
    <audio v-if="type === 'audio'" :src="mediumUrl" style="width: 100%;" />
    <video v-if="type === 'video'" :src="mediumUrl" style="width: 100%;" />
  </template>
  <template v-else>
    Unknown medium type "{{ type }}".
  </template>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { vitepressDataProvider } from '../services/vitepressDataService';

const props = defineProps<{
  id: string;
  type: string;
}>();

const isLoading = ref(true);
const mediumUrl = ref<string>();

const loadMediumUrl = async () => {
  console.log('Loading medium URL...' + props.id + ' ' + props.type);
  isLoading.value = true;
  mediumUrl.value = await vitepressDataProvider.getMediumUrl(props.id);
  isLoading.value = false;
};

onMounted(async () => {
  // Load the medium's URL.
  await loadMediumUrl();
});
</script>
