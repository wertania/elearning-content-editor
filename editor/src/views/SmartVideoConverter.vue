<template>
  <AppLayout :hide-sidebar="true">
    <template #logo>
      <img src="./../assets/logo.png" class="w-full cursor-pointer" @click="router.push({ name: 'edit' })" />
    </template>

    <template #appname>
      <GradientFont direction="rtl" start-color="#eaa3ff" end-color="#5e085a" style="font-weight: 800; font-size: 25px">
        {{ appName }}
      </GradientFont>
    </template>

    <template #end>
      <li>
        <Button icon="fa-solid fa-times" size="small" class="border-none" @click="resetForm"
          v-if="inProgress" />
      </li>
    </template>

    <template #content>
      <div v-if="loading" class="mt-5 m-0 m-auto text-center">
        <ProgressSpinner />
      </div>

      <div v-else class="svc-container mt-5 m-0 m-auto text-center">
        <div v-if="!inProgress">
          <h2>Smart Video optimizer</h2>
          <p>
            Upload a video with your normal language as speaker. The smart video
            optimizer will get the spoken words and optimize the spoken
            sentences to a profression script. It will then render a new video
            with the optimized script and a neutral speaker in different
            languages.
          </p>
          <FileUpload mode="basic" accept="video/*" customUpload :max-file-size="50000000" @uploader="upload($event)"
            :disabled="loading" />
        </div>

        <div v-if="smartVideoProcessing">
          <div>
            <h4>
              Extracted the following sentences. Please read them here to
              correct them.
            </h4>
          </div>
          <div class="grid text-left">
            <div class="col-2">
              {{ 'Starting time [s]' }}
            </div>
            <div class="col-10">
              {{ 'Text' }}
            </div>
          </div>
          <div class="grid" v-for="sentence in smartVideoProcessing.sentences">
            <div class="col-2">
              <InputNumber v-model="sentence.start_time" :min="0" class="w-full" />
            </div>
            <div class="col-10">
              <InputText v-model="sentence.text" class="w-full" />
            </div>
          </div>
          <div>
            <Button v-if="inProgress" label="Save and render Video" @click="renderVideo" />
          </div>
        </div>
      </div>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import FileUpload from 'primevue/fileupload';
import AppLayout from './../components/AppLayout.vue';
import GradientFont from './../components/GradientFont.vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import ProgressSpinner from 'primevue/progressspinner';
import { useRouter } from 'vue-router';
import { useGlobalStore } from './../stores/global';
import { ref, Ref } from 'vue';
import { SmartVideoInitResult } from './../types/services';
import { error, info } from './../services/toast';
import { dataProvider } from '../services/data';

const $global = useGlobalStore();
const router = useRouter();
const appName = import.meta.env.VITE_TEMPLATE_APP_NAME ?? 'RevDocs';

const loading = ref(false);
const inProgress = ref(false);
const smartVideoProcessing: Ref<SmartVideoInitResult | null> = ref(null);
const fileData = ref<File | null>(null);

const upload = async (event: any) => {
  smartVideoProcessing.value = null;
  loading.value = true;
  try {
    const file = event.files[0];
    // upload via Form
    const formData = new FormData();
    formData.append('file', file);
    fileData.value = file;
    const res = await fetch(`${$global.videoConverterUrl}/processVideo`, {
      method: 'POST',
      body: formData,
    });
    smartVideoProcessing.value = await res.json();
    inProgress.value = true;
  } catch (e) {
    error(e + '');
  }
  loading.value = false;
};

const renderVideo = async () => {
  try {
    loading.value = true;

    if (!fileData.value) {
      throw new Error('No file data found');
    }

    if (
      !smartVideoProcessing.value ||
      smartVideoProcessing.value.sentences.length === 0
    ) {
      throw new Error('No sentences found');
    }

    const sentences = JSON.stringify(smartVideoProcessing.value.sentences);

    const id = await dataProvider.addVideoTask(fileData.value, sentences);

    if (!id) {
      throw new Error('Video task could not be created');
    }

    info(
      'Video rendering submitted. You will be notified when it is finished.',
    );
    resetForm();
  } catch (e) {
    error(e + '');
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  smartVideoProcessing.value = null;
  inProgress.value = false;
};
</script>

<style>
.svc-container .p-inputtext.p-component.p-inputnumber-input {
  width: 100%;
}
</style>
