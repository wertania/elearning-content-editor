<template>
  <table class="media-browser">
    <thead>
      <tr>
        <th>Filename</th>
        <th>Type</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="medium in media"
        :key="medium.id"
        @click="() => console.log(medium.id)"
      >
        <td>{{ medium.filename }}</td>
        <td>{{ medium.type }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { Medium } from '../services/data/types';
import { dataProvider } from '../services/data';
import { defineProps, onMounted, ref } from 'vue';

const props = defineProps<{
  documentId?: string;
}>();

let media = ref<Medium[]>([]);

onMounted(async () => {
  console.log(props.documentId);

  if (props.documentId) {
    media.value = await dataProvider.getMediums({
      documentId: props.documentId,
    });
  } else {
    media.value = await dataProvider.getMediums();
  }

  console.log(media);
});
</script>

<style lang="scss" scoped>
.media-browser {
    width: 100%;
    border-collapse: collapse;

    th, td {
        padding: 10px;
        border: 1px solid #ddd;
    }

    th {
        background-color: #4CAF50;
        color: white;
    }

    tr:hover {background-color: #f5f5f5;}
}
</style>
