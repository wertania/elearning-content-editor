<template>
  <div :style="gradientStyle">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
/**
 * A simple component that renders text with a gradient as font-color.
 */
import { computed } from 'vue';

const props = defineProps({
  startColor: {
    type: String,
    required: true,
  },
  endColor: {
    type: String,
    required: true,
  },
  direction: {
    type: String,
    default: 'to right',
  },
});

const gradientStyle: any = computed(() => ({
  background: `-webkit-linear-gradient(${props.startColor}, ${props.endColor})`, // `linear-gradient(${props.direction}, ${props.startColor}, ${props.endColor})`,
  '-webkit-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
  direction: props.direction,
}));
</script>
