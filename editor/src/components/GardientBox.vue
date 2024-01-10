<template>
  <div :style="boxStyle" class="gradient-box-wrap">
    <div class="gradient-box" :style="innerStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * A simple component that renders a box with a gradient background.
 */
import { computed } from 'vue';

const props = defineProps({
  direction: {
    type: String,
    default: 'to right',
  },
  start: {
    type: String,
    default: '#000',
  },
  end: {
    type: String,
    default: '#fff',
  },
  bg: {
    type: String,
    default: 'white',
  },
});

const boxStyle = computed(() => {
  return `background: linear-gradient(${props.direction}, ${props.start}, ${props.end});`;
});
const innerStyle = computed(() => {
  return `background: ${props.bg};`;
});
</script>

<style>
.gradient-box-wrap {
  padding: 0.3rem;
  border-radius: 0.7rem;
}

.gradient-box {
  border-radius: 0.4rem;
  height: 100%;
}
</style>
