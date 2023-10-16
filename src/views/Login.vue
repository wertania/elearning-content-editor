<template>
  <div class="login">
    <h1 class="txt-gradient">Welcome to RevDocs</h1>
    <div v-if="provider === 'cosmosdb'">
      <Button @click="/*triggerMicrosoftSignIn()*/" class="login__button" :disabled="loading">
        <div class="login__loading-spinner" v-if="loading"></div>
        <span v-else> Bei O365 anmelden </span>
      </Button>
    </div>
    <div v-else-if="provider === 'pocketbase'">
      <!--login with username and password -->
      <div class="p-fluid">
        <div class="p-field">
          <label for="username">Username</label>
          <TextInput id="username" v-model="username" />
        </div>
        <div class="p-field mt-2">
          <label for="password">Password</label>
          <TextInput id="password" v-model="password" type="password" />
        </div>
        <Button @click="loginPocketbase()" :disabled="loading" class="mt-5" label="Login" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { signIn } from './../services/auth';
import Button from 'primevue/button';
import { useGlobalStore } from './../stores/global';
import { ref } from 'vue';
import { dataProvider } from './../services/data/index';
import TextInput from 'primevue/inputtext';
import { error } from './../services/toast';
const provider = dataProvider.name;
const store = useGlobalStore();

// directly redirect for localdb
if (provider === 'localdb') {
  store.loginRedirect();
}

const username = ref('');
const password = ref('');
const loading = ref(false);

const loginPocketbase = async () => {
  loading.value = true;
  try {
    await dataProvider.login({ username: username.value, password: password.value });
    await store.loginRedirect();
  } catch (e) {
    error(e + "");
  }
  loading.value = false;
}

// const triggerMicrosoftSignIn = async () => {
//   try {
//     loading.value = true;
//     const loginSuccess = await signIn('popup');
//     if (loginSuccess) {
//       await store.loginRedirect();
//     }
//     loading.value = false;
//   } catch (error) {
//     console.error(error);
//   } finally {
//     loading.value = false;
//   }
// };
</script>

<style lang="scss">
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  margin-top: 50px;
}

h1.txt-gradient {
  font-size: 40px;
  font-weight: 700;
  background: -webkit-linear-gradient(#f9f9f9, #780f72);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
