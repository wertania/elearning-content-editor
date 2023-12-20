<template>
    <AppLayout :mode="'dark'">
        <template #logo>
            <img src="./../assets/logo.png" class="w-full">
        </template>
        <template #appname>
            <span class="appname">
                {{ appName }}
            </span>
        </template>
        <template #start>
            <span class="p-input-icon-left ml-3">
                <i class="fa-solid fa-search" />
                <InputText placeholder="Search" class="w-12rem surface-100 border-round-lg border-none h-3rem font-medium"
                    size="small" />
            </span>
        </template>
        <template #end>
            <li>
                <div class="flex align-items-center">
                    <i class="fa-solid fa-search" /><span class="ml-2">Test Item 1</span>
                </div>
            </li>
            <li>
                <div class="flex align-items-center">
                    <i class="fa-solid fa-search" /><span class="ml-2">Test Item 2</span>
                </div>
            </li>
            <li>
                <div class="flex align-items-center">
                    <i class="fa-solid fa-search" /><span class="ml-2">Test Item 3</span>
                </div>
            </li>
        </template>

        <template #sidebar>
            <ul>
                <li>
                    <div class="flex align-items-center">
                        <i class="fa-solid fa-search" /><span class="ml-2">Test Item 1</span>
                    </div>
                </li>
                <li>
                    <div class="flex align-items-center">
                        <i class="fa-solid fa-search" /><span class="ml-2">Test Item 2</span>
                    </div>
                </li>
                <li>
                    <div class="flex align-items-center">
                        <i class="fa-solid fa-search" /><span class="ml-2">Test Item 3</span>
                    </div>
                </li>
            </ul>
        </template>

        <template #content>
            <div>
                <div class="m-0 m-auto">
                    <img src="./../assets/logo.png" />
                </div>
            </div>
        </template>
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from './../components/AppLayout.vue';
import InputText from 'primevue/inputtext';
const appName = import.meta.env.VITE_APP_NAME;

</script>

<style scoped>
.appname {
    font-size: 24px;
    font-weight: 700;
    background: -webkit-linear-gradient(#f9f9f9, #780f72);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    direction: rtl;
}
</style>