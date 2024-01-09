<template>
  <AppLayout :hide-sidebar="true">
    <template #logo>
      <img :src="logoUrl" class="w-full cursor-pointer" @click="router.push({ name: 'edit' })">
    </template>

    <template #appname>
      <div class="flex align-items-center">
        <h2>
          {{ appName + " " }}
        </h2>
        <h4 class="ml-2">
          > Media Browser
        </h4>
      </div>
    </template>

    <template #content>
      <MediaBrowser :document-id="documentId" />
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppLayout from './../components/AppLayout.vue';
import MediaBrowser from './../components/MediaBrowser.vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const logoUrl = import.meta.env.VITE_TEMPLATE_LOGO_URL ?? "./../assets/logo.png";
const router = useRouter();
const route = useRoute();
const appName = import.meta.env.VITE_TEMPLATE_APP_NAME ?? 'RevDocs';

// get documentId from route
const documentId = ref<string | undefined>(route.params.documentId !== '' && !Array.isArray(route.params.documentId) ? route.params.documentId : undefined);
</script>