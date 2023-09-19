<template>
  <div class="w-full">
    <div v-if="modelValue.data.src != null && modelValue.data.src !== ''" id="block-img" class="inline">
      {{ "Video-Url: " + modelValue.data.src }}
    </div>
    <div v-else class="w-[50%] m-auto text-gray-400 text-center rounded-xl">
      <div class="flex m-auto mt-2">
        <div>{{ 'Video-Url' }}</div>
        <input type="text" class="ml-2 border border-gray-600 w-[300px]" v-model="inputUrl" />
        <i class="fa-solid fa-check ml-2 text-2xl cursor-pointer hover:bg-gray-300 rounded" @click="saveWithUrl()" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';
import { BlockVideo } from './types';

const props = defineProps<{
  readOnly: boolean;
  modelValue: BlockVideo;
}>();

const src = ref(props.modelValue.data.src);
watch(props, () => {
  src.value = props.modelValue.data.src;
});

// directely set url
const inputUrl = ref('');
const saveWithUrl = async () => {
  if (inputUrl.value != null && inputUrl.value !== '') {
    props.modelValue.data.src = inputUrl.value;
  }
};
</script>

<style scoped></style>
