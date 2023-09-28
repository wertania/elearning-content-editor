<template>
  <div class="login">
    <h1 class="login__title">E-Learning Platform</h1>
    <Button @click="triggerSignIn()" class="login__button" :disabled="loading">
      <div class="login__loading-spinner" v-if="loading"></div>
      <span v-else> Bei O365 anmelden </span>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { signIn } from './../services/auth';
import Button from 'primevue/button';
import { useGlobalStore } from './../stores/global';
import { ref } from 'vue';

const store = useGlobalStore();

const loading = ref(false);

const triggerSignIn = async () => {
  try {
    loading.value = true;
    const loginSuccess = await signIn('popup');
    if (loginSuccess) {
      await store.loginRedirect();
    }
    loading.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss">
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  margin-top: 50px;

  &__title {
    margin: 10px 10px 10px 10px;
  }

  &__button {
    display: flex;
    justify-content: center;
    margin: 100px 10px 10px 10px;
    height: 45px;
    width: 190px;
  }
  &__loading-spinner {
    border: 4px solid var(--primary-color);
    border-top: 4px solid var(--surface-0);
    border-right: 4px solid var(--surface-0);
    border-left: 4px solid var(--surface-0);
    border-radius: 50%;
    animation: spin 2s linear infinite;
    -webkit-animation: spin 2s linear infinite;
    width: 30px;
    height: 30px;
  }
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
</style>
