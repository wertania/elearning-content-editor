<template>
    <div style="margin: 0 auto; width:30%;">
        <div style="width: 100%; text-align: center;">
            <h1>{{ "Welcome" }}</h1>
        </div>
        <Button class="w-full" label="--> Editor" @click="router.push({ path: '/edit' })" />
    </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
const router = useRouter();

</script>