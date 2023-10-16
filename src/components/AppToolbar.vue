<template>
    <Toolbar class="bg-purple-50">
        <template #start>
            <img src="./../assets/logo.png" alt="logo" style="height: 50px;" />
            <span class="ml-2 tx-gradient-logo mr-4">RevDocs</span>
            <slot name="start" />
        </template>
        <template #end>
            <slot name="end" />
        </template>
    </Toolbar>
</template>

<script setup lang="ts">
import Toolbar from 'primevue/toolbar';
</script>

<style scoped>
span.tx-gradient-logo {
    font-size: 24px;
    font-weight: 700;
    background: -webkit-linear-gradient(#f9f9f9, #780f72);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    direction: rtl;
}
</style>