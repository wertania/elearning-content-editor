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
/**
 * A component that renders a medium. (video, audio, image)
 * The medium's URL is loaded from the data service and then rendered.
 */
import { onMounted, ref, watch } from 'vue';
import { dataProvider } from './../services/data/index';

const props = defineProps<{
  id: string;
  type: string;
  url?: string;
}>();

const isLoading = ref(true);
const mediumUrl = ref<string>();

const loadMediumUrl = async () => {
  if (props.url != null && props.url !== '') {
    mediumUrl.value = props.url;
    isLoading.value = false;
    return;
  }
  // else try to load the medium's URL from the data service.
  console.log('Loading medium URL...' + props.id + ' ' + props.type);
  if (isLoading.value) {
    console.log('Already loading...');
  }
  isLoading.value = true;
  mediumUrl.value = await dataProvider.getMediumUrl(props.id);
  console.log('Loaded medium URL: ' + mediumUrl.value);
  isLoading.value = false;
};

watch(() => props.id, async () => {
  await loadMediumUrl();
});

onMounted(async () => {
  // Load the medium's URL.
  await loadMediumUrl();
});
</script>
