<template>
    <div>Placeholder. Get ({{ type }}) from: {{ src }}</div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

type MediaType = 'image' | 'video' | 'audio';

const props = defineProps({
    type: {
        type: String as PropType<MediaType>,
        required: true,
    },
    src: {
        type: String,
    }
})
</script>