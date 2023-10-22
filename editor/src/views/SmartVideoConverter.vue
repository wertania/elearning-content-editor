<template>
  <AppLayout>
    <template #logo>
      <img src="./../assets/logo.png" class="w-full cursor-pointer" @click="router.push({ name: 'edit' })">
    </template>

    <template #appname>
      <GradientFont direction="rtl" start-color="#eaa3ff" end-color="#5e085a" style="font-weight: 800; font-size: 25px;">
        RevDocs
      </GradientFont>
    </template>

    <template #start>
      <FileUpload mode="basic" accept="video/*" :maxFileSize="1000000" customUpload @uploader="upload($event)" />
    </template>

    <template #end>
      <li>
        Use...
      </li>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import FileUpload from 'primevue/fileupload';
import AppLayout from './../components/AppLayout.vue';
import GradientFont from './../components/GradientFont.vue';
import {useRouter} from 'vue-router';

const router = useRouter();

const upload = async (event: any) => {
  const file = event.files[0];
  // upload via Form
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('http://localhost:3000/upload', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  console.log(data);
};
</script>