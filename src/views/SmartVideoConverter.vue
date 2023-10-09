<template>
  
  <FileUpload mode="basic" accept="video/*" :maxFileSize="1000000" customUpload @uploader="upload($event)" />
</template>

<script setup lang="ts">
import FileUpload from 'primevue/fileupload';

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