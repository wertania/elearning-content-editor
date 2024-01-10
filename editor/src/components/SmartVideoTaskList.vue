<template>
  <div class="card">
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
      <Column field="status" header="Status"></Column>
      <Column field="error" header="Error"></Column>
      <Column v-if="showMediaId" field="mediaId" header="Media ID"></Column>

      <Column header="" :style="{ width: '32px' }">
        <template #body="{ data }">
          <ConfirmPopup></ConfirmPopup>
          <Button
            v-if="showDelete"
            icon="fa-solid fa-trash"
            @click="deleteTask($event, data.id)"
          />
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
import { dataProvider } from './../services/data';
import { ref, Ref, onMounted, watch, onUnmounted } from 'vue';
import { SmartVideoStatus, SmartVideoTask } from './../services/data/types';
import { useConfirm } from 'primevue/useconfirm';
import { error, info } from './../services/toast';

const confirm = useConfirm();

const props = defineProps<{
  status: SmartVideoStatus[];
  triggerReload?: number;
  showDelete?: boolean;
  showMediaId?: boolean;
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
 * delete task
 */
const deleteTask = async (event: Event, id: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Are you sure you want to proceed?',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await dataProvider.dropVideoTask(id);
        info('Deleted', 'The video task has been deleted');
        await getData();
      } catch (e) {
        error('Error', 'Could not delete the video task. ' + e);
        return;
      }
    },
  });
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

/**
 * main data
 */
const data: Ref<SmartVideoTask[]> = ref([]);
const getData = async () => {
  data.value = await dataProvider.getVideoTasks(props.status);
};

onMounted(() => {
  getData();
});
// reload data every 30 seconds
const interval = setInterval(() => {
  getData();
}, 30000);
// restart interval on unmount
onUnmounted(() => {
  clearInterval(interval);
});
</script>
