<template>
    <AppLayout :hide-sidebar="true">
        <template #logo>
            <img src="./../assets/logo.png" class="w-full">
        </template>

        <template #appname>
            <GradientFont direction="rtl" start-color="#eaa3ff" end-color="#5e085a"
                style="font-weight: 800; font-size: 25px;">
                {{ appName }}
            </GradientFont>
        </template>

        <template #content>
            <div class="m-auto m-0 w-4 mt-5 h-screen">
                <GradientFont class=" mt-5 mb-5 text-center" start-color="rgb(255 249 154)" end-color="rgb(255 162 222)"
                    style="font-weight: 800; font-size: 25px;">
                    <h2>Welcome back</h2>
                </GradientFont>

                <GardientBox start="rgb(255 251 189)" end="#ffa8fa" class="cursor-pointer text-center text-white"
                    bg="transparent" @click="router.push({ name: 'view' })">
                    <h2 style="color: #ca566f"><i class="fa-regular fa-newspaper"></i>
                        Live Docs (live rendered)
                    </h2>
                </GardientBox>

                <GardientBox start="rgb(255 251 189)" end="#ffa8fa" class="mt-4 cursor-pointer text-center text-white"
                    bg="transparent" @click="openFastViewer()">
                    <h2 style="color: #ca566f"><i class="fa-solid fa-eye"></i>
                        FastViewer (static rendered)
                    </h2>
                </GardientBox>

                <GardientBox start="rgb(255 251 189)" end="#ffa8fa" class="mt-4 cursor-pointer text-center text-white"
                    bg="transparent" @click="router.push({ name: 'edit' })">
                    <h2 style="color: #ca566f"><i class="fa-solid fa-pen-nib"></i>
                        Document Editor
                    </h2>
                </GardientBox>
            </div>
        </template>
    </AppLayout>
</template>
  
<script setup lang="ts">
import GardientBox from './../components/GardientBox.vue';
import AppLayout from './../components/AppLayout.vue';
import GradientFont from './../components/GradientFont.vue';
import { useRouter } from 'vue-router';
import MediaBrowser from './../components/MediaBrowser.vue';
const router = useRouter();
const appName = import.meta.env.VITE_TEMPLATE_APP_NAME ?? 'RevDocs';

const staticViewerRoute = import.meta.env.VITE_STATIC_RENDERED_PAGE_URL ?? "/";
const openFastViewer = () => {
    window.open(staticViewerRoute, '_blank');
}
</script>