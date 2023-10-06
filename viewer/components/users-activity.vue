<template>
    [Hidden tracker]
</template>

<script setup lang="ts">
import { onBeforeUnmount, PropType } from 'vue';
// import getUser() from somewhere...
const user = 'demo';

const props = defineProps({
    documentId: {
        type: String as PropType<string>,
        required: true,
    },
})

// start timer here to track the time the user spend on the page
// and send it to the server when the user leaves the page    
const startReading = new Date();
onBeforeUnmount(() => {
    const endReading = new Date();
    const timeSpent = endReading.getTime() - startReading.getTime();
    // time in minutes (rounded)
    const timeSpentInMinutes = Math.round(timeSpent / 60000);
    // send timeSpent to the server
    // to do...
    console.log(`User ${user} spent ${timeSpentInMinutes} minutes on page ${props.documentId}`);
});
</script>