<template>
  <div class="dark-mode-toggle flex justify-content-end">
    <i v-if="colorMode === 'dark'" class="fa-solid fa-moon" />
    <i v-if="colorMode === 'light'" class="fa-solid fa-sun" />

    <InputSwitch
      v-model="$global.mode"
      class="ml-3"
      :true-value="'dark'"
      :false-value="'light'"
    />
  </div>
</template>

<script lang="ts" setup>
import { useGlobalStore } from '@/stores/global';
import InputSwitch from 'primevue/inputswitch';
import { computed } from 'vue';

const $global = useGlobalStore();
const colorMode = computed(() => $global.mode);
</script>
