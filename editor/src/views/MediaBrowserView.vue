<template>
  <AppLayout :hide-sidebar="true">
    <template #logo>
      <img
        src="./../assets/logo.png"
        class="w-full cursor-pointer"
        @click="router.push({ name: 'edit' })"
      />
    </template>

    <template #appname>
      <GradientFont
        direction="rtl"
        start-color="#eaa3ff"
        end-color="#5e085a"
        style="font-weight: 800; font-size: 25px"
      >
        {{ appName }}
      </GradientFont>
    </template>

    <template #content>
      <MediaBrowser :document-id="props.documentId" />
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import AppLayout from '../components/AppLayout.vue';
import MediaBrowser from '../components/MediaBrowser.vue';

const router = useRouter();

const props = defineProps({
  documentId: {
    type: String,
    default: undefined,
  },
});

const appName = import.meta.env.VITE_TEMPLATE_APP_NAME ?? 'RevDocs';
</script>
