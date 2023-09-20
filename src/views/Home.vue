<template>
    <div class="text-center mt-5">
        <Button @click="triggerSignIn()">Bei O365 anmelden</Button>
    </div>
</template>
  
<script setup lang="ts">
import { signIn } from './../services/auth';
import Button from "primevue/button";
import { useGlobalStore } from './../stores/global';

const store = useGlobalStore()

const triggerSignIn = async () => {
    const loginSuccess = await signIn('popup')
    if (loginSuccess) {
        await store.loginRedirect()
    }
}
</script>