<template>
    <div class="flex flex-column gap-2">
        <label for="name">Name (Menu)</label>
        <InputText id="name" :value="name" @update:model-value="$emit('update:name', $event)" />
    </div>
    <div class="flex flex-column gap-2">
        <label for="header">Header</label>
        <InputText id="header" :value="header" @update:model-value="$emit('update:header', $event)" />
    </div>
    <div class="flex flex-column gap-2">
        <label for="description">Description</label>
        <InputText id="description" :value="description" @update:model-value="$emit('update:description', $event)" />
    </div>
    <div class="flex flex-column gap-2">
        <label for="langCode">Language Code</label>
        <Dropdown id="langCode" :options="[{ label: 'German', val: 'de' }, { label: 'English', val: 'en' }]"
            option-value="val" option-label="label" v-model="selectedLangCode"
            @update:model-value="$emit('update:langCode', $event)" />
    </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import { ref, Ref } from 'vue'

const props = defineProps(['name', 'header', 'description', 'langCode'])
defineEmits(['update:name', 'update:header', 'update:description', 'update:langCode'])

// dropdown needs an inner state
const selectedLangCode: Ref<string> = ref(props.langCode);
</script>