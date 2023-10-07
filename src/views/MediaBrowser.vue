<template>
  <Toolbar class="bg-purple-50">
    <template #start>
      <img src="./../assets/logo.png" alt="logo" style="height: 50px;" />
      <span class="ml-2 tx-gradient-logo mr-4">RevDocs</span>
      <SplitButton @click="addDocument()" label="Add" icon="fa-solid fa-plus" :model="menuAdd" />
      <ConfirmPopup />
      <Button icon="fa-solid fa-trash" class="ml-1 bg-purple-300 border-none" @click="deleteSelected($event)"
        v-show="selection" />
    </template>
    <template #end>
      <!-- <Button icon="fa-solid fa-save" class="ml-1 bg-purple-300 border-none" @click="saveDocument" v-show="true" /> -->
      <!-- <Button icon="fa-solid fa-times" class="ml-1 bg-purple-300 border-none" @click="closeDocument"
        v-show="true" /> -->
    </template>
  </Toolbar>

  <div class="document-editor__main">

    <div v-if="$global.$state.isLoading || $global.$state.requestPending"
      class="flex justify-content-center flex-wrap mt-5">
      <ProgressSpinner />
    </div>
    <div v-else class="grid w-full mt-1" style="height: calc(100vh - 105px);">
      <div class="col-6">
        <DataTable :value="$media.media" @row-select="selectItem($event)" selection-mode="single"
          v-model:selection="selection">
          <Column field="id" header="ID"></Column>
          <Column field="type" header="Type"></Column>
          <!-- <Column field="url" header="URL"></Column>
        <Column field="name" header="Name"></Column> -->
        </DataTable>
      </div>
      <div class="col-6">
        <div v-if="itemSelected">
          <div class="flex flex-row flex-wrap card-container blue-container ml-2 mr-2 mb-2">
            <Button icon="fa-solid fa-plus" @click="showAddLanguage = true" :disabled="false"></Button>
            <Dropdown v-model="languageToAdd" option-label="name" option-value="code"
              :options="[{ name: 'Dummy', code: 'de' }]" class="ml-1 flex-auto" :disabled="false"
              @change="switchLanguage" />
          </div>
          <MediaViewer :id="itemSelected.id" :type="itemSelected.type" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import SplitButton from 'primevue/splitbutton';
import Dropdown from 'primevue/dropdown';
import ConfirmPopup from 'primevue/confirmpopup';
import { useGlobalStore } from '../stores/global';
import { useConfirm } from "primevue/useconfirm";
import { useMediaStore } from './../stores/media';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { Medium } from './../services/data/types';
import MediaViewer from './../../viewer/components/media-viewer.vue';
import { error } from './../services/toast';
import { useRoute } from 'vue-router';

const $media = useMediaStore(); // media store
const confirm = useConfirm(); // confirm dialog
const $global = useGlobalStore(); // global store

const route = useRoute()
const documentId = route.params.documentId !== '' && !Array.isArray(route.params.documentId) ? route.params.documentId : null;


// "add" split-button
const menuAdd = [
  {
    label: 'Add smart video',
    command: () => addDocument(),
  },
  {
    label: 'Upload video',
    command: () => addDocument(),
  },
  {
    label: 'Upload image',
    command: () => addDocument(),
  },
];

// needed for datagrid selection
const selection = ref<any>(null);

// add language dialog
const showAddLanguage = ref(false); // control: dialog for adding a new language
const languageToAdd = ref('en'); // dropdown: language to add

/**
 * select item
 */
const itemSelected = ref<Medium | null>(null);
const selectItem = async (event: any) => {
  itemSelected.value = event.data;
};

/**
 * change the language
 */
const switchLanguage = async (data: any) => {
  console.log('switchLanguage', data);
};

/**
 * add a new language
 */
const addTranslationToMedia = async () => {
  console.log('addTranslationToMedia');
};

/**
 * Add a new document.
 */
const addDocument = async () => {
  console.log('addDocument');
};

/**
 * Save the current document depending on the mode.
 */
const saveDocument = async () => {
  console.log('saveDocument');
};

/**
 * Delete the selected document.
 */
const deleteSelected = (event: any) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Are you sure you want to proceed?',
    icon: 'fa-solid fa-trash',
    accept: async () => {
      error('Disabled function');
      console.log('deleteSelected', selection.value);
    },
  });
};

// App Start
onMounted(async () => {
  $global.$state.isLoading = true;
  await $media.initialize(documentId);
  $global.$state.isLoading = false;
});
</script>

<style lang="scss">
span.tx-gradient-logo {
  font-size: 24px;
  font-weight: 700;
  background: -webkit-linear-gradient(#f9f9f9, #780f72);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  direction: rtl;
}
</style>