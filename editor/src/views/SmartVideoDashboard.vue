<template>
  <AppLayout :hide-sidebar="true">
    <template #logo>
      <img
        :src="logoUrl"
        class="w-full cursor-pointer"
        @click="router.push({ name: 'edit' })"
      />
    </template>

    <template #appname>
      <div class="flex align-items-center">
        <h2>
          {{ appName + ' ' }}
        </h2>
        <h4 class="ml-2">> Smart Video</h4>
      </div>
    </template>

    <template #content>
      <TabView>
        <TabPanel header="Upload RAW Videos">
          <Dialog v-model:visible="showUploadDialog">
            <template #default>
              <FileUpload
                custom-upload
                :multiple="false"
                @uploader="uploadRawVideo"
                mode="advanced"
              />
            </template>
          </Dialog>

          <h2>Smart Video optimizer</h2>
          <p>
            Upload a video with your normal language as speaker. The smart video
            optimizer will get the spoken words and optimize the spoken
            sentences to a profression script. It will then render a new video
            with the optimized script and a neutral speaker in different
            languages.
          </p>
          <Toolbar>
            <template #end>
              <Button
                label="Upload Video"
                icon="fa-solid fa-upload"
                @click="showUploadDialog = true"
                :disabled="loading"
              ></Button>
            </template>
          </Toolbar>

          <SmartVideoTaskList
            :status="['unpreprocessed']"
            :trigger-reload="triggerReload"
            :showDelete="true"
          />
        </TabPanel>

        <TabPanel header="Edit Pre-processed Videos">
          <SmartVideoTaskList
            :status="['preprocessed']"
            @select-item="selectItem"
            :trigger-reload="triggerReload"
          />

          <Dialog
            v-model:visible="showSentencesEditor"
            maximizable
            :style="{ width: '80rem' }"
          >
            <div class="card sentences-editor">
              <div>
                <h4>Extracted data</h4>
              </div>
              <div class="grid text-left">
                <div class="col-2">
                  {{ 'Starting time [s]' }}
                </div>
                <div class="col-10">
                  {{ 'Text' }}
                </div>
              </div>
              <div class="grid" v-for="sentence in sentences">
                <div class="col-2">
                  <InputNumber
                    v-model="sentence.start_time"
                    :min="0"
                    class="w-full"
                  />
                </div>
                <div class="col-10">
                  <Textarea
                    v-model="sentence.text"
                    class="w-full"
                    :rows="1"
                    :auto-resize="true"
                  />
                </div>
              </div>
              <div>
                <Button
                  label="Only save"
                  @click="saveSentences"
                  :disabled="loading"
                />
                <Button
                  label="Save and render Video"
                  @click="saveAndRenderVideo"
                  :disabled="loading"
                  class="ml-2"
                />
              </div>
            </div>
          </Dialog>
        </TabPanel>

        <TabPanel header="Converted Videos">
          <SmartVideoTaskList :status="['processed']" :showMediaId="true" />
        </TabPanel>

        <TabPanel header="(Processing)">
          <SmartVideoTaskList :status="['preprocessing', 'processing']" />
        </TabPanel>
      </TabView>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import FileUpload, { type FileUploadUploaderEvent } from 'primevue/fileupload';
import { ref } from 'vue';
import AppLayout from './../components/AppLayout.vue';
import SmartVideoTaskList from './../components/SmartVideoTaskList.vue';
import { dataProvider } from './../services/data';
import { useRouter } from 'vue-router';
import {
  SmartVideoTask,
  SmartVideoTranscriptWithTimestamps,
} from '@/services/data/types';

const router = useRouter();
const appName = import.meta.env.VITE_TEMPLATE_APP_NAME ?? 'RevDocs';
const logoUrl =
  import.meta.env.VITE_TEMPLATE_LOGO_URL ?? './../assets/logo.png';

const triggerReload = ref<number>(0);
const selectedId = ref<string | null>(null);
const showUploadDialog = ref<boolean>(false);
const loading = ref(false);
const showSentencesEditor = ref(false);

/**
 * Upload a new raw video
 */
const uploadRawVideo = async (e: FileUploadUploaderEvent) => {
  loading.value = true;
  const file = Array.isArray(e.files) ? e.files[0] : e.files;
  // Upload the medium and receive an ID.
  await dataProvider.addVideoTask(file);
  // refresh tables
  triggerReload.value++;
  // hide dialog
  showUploadDialog.value = false;
  loading.value = false;
};

/**
 * Edit a preprocessed video
 */
const sentences = ref<SmartVideoTranscriptWithTimestamps[]>([]);
const selectItem = (data: SmartVideoTask) => {
  console.log('selected', data);
  sentences.value = [];
  selectedId.value = data.id;
  sentences.value = data.sentences;
  showSentencesEditor.value = true;
};

/**
 * Save the sentences
 */
const saveSentences = async () => {
  loading.value = true;
  if (selectedId.value == null) return;
  await dataProvider.updateVideoTranscript(selectedId.value, sentences.value);
  loading.value = false;
  showSentencesEditor.value = false;
};

/**
 * Save and render the video
 */
const saveAndRenderVideo = async () => {
  loading.value = true;
  if (selectedId.value == null) return;
  await dataProvider.updateVideoTranscript(selectedId.value, sentences.value);
  await dataProvider.updateVideoStatus(selectedId.value, 'unprocessed'); // trigger rendering
  // refresh tables
  triggerReload.value++;
  loading.value = false;
  showSentencesEditor.value = false;
};
</script>

<style>
.sentences-editor .p-inputnumber-input {
  width: 100% !important;
}
</style>
