<template>
  <div class="card">
    <Dialog
      v-model:visible="showAddLanguage"
      modal
      header="Add language"
      :style="{ width: '40vw' }"
    >
      <template #default>
        <div class="p-1">
          <label>Select a language</label>
          <Dropdown
            :options="$document.languages"
            option-label="name"
            option-value="code"
            placeholder="Select a language"
            class="w-full mt-2"
            v-model="languageToAdd"
            :disabled="loading"
          />
          <div class="flex flex-row flex-wrap h-4 mt-4">
            <label class="block">Pre-Translate via AI?</label>
            <Checkbox
              :binary="true"
              class="ml-2"
              v-model="translateViaAI"
              :disabled="loading"
            />
          </div>
          <div class="flex flex-row flex-wrap h-4 mt-5">
            <Button
              icon="fa-solid fa-check"
              @click="addTranslation(selection)"
              label="Add translation"
              :disabled="loading"
            >
            </Button>
            <Button
              icon="fa-solid fa-close"
              label="Cancel"
              class="ml-1"
              @click="showAddLanguage = false"
              :disabled="loading"
            ></Button>
          </div>
        </div>
      </template>
    </Dialog>

    <DataTable
      :value="data"
      class="w-full"
      selection-mode="single"
      @row-select="selectRow"
      v-model:selection="selectedItem"
      paginator
      :rows="20"
    >
      <Column field="created" header="Created"></Column>
      <Column field="id" header="Id"></Column>
      <Column field="file" header="Filename"></Column>
      <Column field="targetLangCode" header="Language"></Column>
      <Column field="status" header="Status"></Column>
      <Column field="error" header="Error"></Column>
      <Column v-if="showMediaId" field="mediaId" header="Media ID"></Column>

      <Column header="" :style="{ width: '32px' }">
        <template #body="{ data }">
          <ConfirmPopup></ConfirmPopup>
          <div class="flex">
            <Button
              v-if="showDelete"
              icon="fa-solid fa-trash"
              @click="deleteTask($event, data.id)"
              class="mr-1"
              :disabled="loading"
            />
            <Button
              v-if="showDownload"
              icon="fa-solid fa-download"
              @click="downloadVideo(data)"
              :disabled="loading"
            />
            <Button
              v-if="data.status === 'processed'"
              icon="fa-solid fa-check"
              @click="markAsFinished(data)"
              class="ml-1"
              :disabled="loading"
            />
            <Button
              v-if="
                data.status === 'processed' || data.status === 'preprocessed'
              "
              icon="fa-solid fa-language"
              @click="
                selection = data;
                showAddLanguage = true;
              "
              class="ml-1"
              :disabled="loading"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable, { DataTableRowSelectEvent } from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ConfirmPopup from 'primevue/confirmpopup';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import { dataProvider } from './../services/data';
import { ref, Ref, onMounted, watch, onUnmounted } from 'vue';
import { SmartVideoStatus, SmartVideoTask } from './../services/data/types';
import { useConfirm } from 'primevue/useconfirm';
import { error, info } from './../services/toast';
import { useDocumentStore } from '@/stores/documents';

const confirm = useConfirm();
const $document = useDocumentStore();

const loading = ref(false);

const showAddLanguage = ref(false);
const languageToAdd = ref($document.languages[0] ?? null);
const translateViaAI = ref(true);
const selection = ref<SmartVideoTask | null>(null);

const props = defineProps<{
  status: SmartVideoStatus[];
  triggerReload?: number;
  showDelete?: boolean;
  showMediaId?: boolean;
  showDownload?: boolean;
}>();

// const emit = defineEmits<{
//   'update:selected-item': [SmartVideoTask];
// }>();
const emit = defineEmits(['select-item']);

const selectedItem: Ref<SmartVideoTask | null> = ref(null);
const selectRow = (row: DataTableRowSelectEvent) => {
  console.log('send', row);
  emit('select-item', row.data);
};

/**
 * main data
 */
const data: Ref<SmartVideoTask[]> = ref([]);
const getData = async () => {
  data.value = await dataProvider.getVideoTasks(props.status);
};

/**
 * delete task
 */
const deleteTask = async (event: Event, id: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        loading.value = true;
        await dataProvider.dropVideoTask(id);
        info('Deleted', 'The video task has been deleted');
        await getData();
        loading.value = false;
      } catch (e) {
        error('Error', 'Could not delete the video task. ' + e);
        return;
      }
    },
  });
};

/**
 * download video
 */
const downloadVideo = async (data: SmartVideoTask) => {
  if (!data.id) return;
  console.log('download', data);
  loading.value = true;
  if (data.mediaId && data.mediaId !== '') {
    const url = await dataProvider.getMediumUrl(data.mediaId);
    console.log('download', url);
    window.open(url, '_blank');
    return;
  } else {
    const url = await dataProvider.getVideoTaskBlobUrl(data.id);
    console.log('download', url);
    window.open(url, '_blank');
  }
  loading.value = false;
};

/**
 * mark as finished. this will update the status to "done"
 */
const markAsFinished = async (data: SmartVideoTask) => {
  if (!data.id) return;
  loading.value = true;
  try {
    await dataProvider.updateVideoStatus(data.id, 'done');
    info('Updated', 'The video task has been updated');
    await getData();
  } catch (e) {
    error('Error', 'Could not update the video task. ' + e);
    return;
  }
  loading.value = false;
};

/**
 * Add translation
 * - will get a translation for all sentences
 * - will create a duplicate of the video task with the new language sentences
 */
const addTranslation = async (data: null | SmartVideoTask) => {
  if (!data || !data.id) return;
  loading.value = true;
  try {
    await dataProvider.addDuplicateWithTranslation(
      data.id,
      languageToAdd.value.name,
      translateViaAI.value,
    );
    info('Updated', 'The new video task has been created as "preprocessed"');
    await getData();
  } catch (e) {
    error('Error', 'Could not update the video task. ' + e);
    return;
  }
  showAddLanguage.value = false;
  selection.value = null;
  loading.value = false;
};

/**
 * reload trigger
 */
watch(
  () => props.triggerReload,
  () => {
    if (props.triggerReload && props.triggerReload > 0) getData();
  },
);

onMounted(() => {
  getData();
});
// reload data every 30 seconds
const interval = setInterval(() => {
  getData();
}, 10000);
// restart interval on unmount
onUnmounted(() => {
  clearInterval(interval);
});
</script>
