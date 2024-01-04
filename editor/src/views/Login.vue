<template>
  <div class="bg-svg-logo" :style="{ '--bg-image': `url(${bgSvgLogoUrl})` }">
    <div class="login">
      <GradientFont start-color="#f15bff" end-color="#780f72">
        <h1 style="font-size: 3em;">{{ welcomeSlogan }}</h1>
      </GradientFont>
      <div v-if="provider === 'pocketbase'">
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
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { useGlobalStore } from './../stores/global';
import { ref } from 'vue';
import { dataProvider } from './../services/data/index';
import TextInput from 'primevue/inputtext';
import { error } from './../services/toast';
import GradientFont from './../components/GradientFont.vue';

const provider = dataProvider.name;
const store = useGlobalStore();

const welcomeSlogan = import.meta.env.VITE_TEMPLATE_WELCOME_SLOGAN ?? "Welcome to RevDocs";
const bgSvgLogoUrl = import.meta.env.VITE_TEMPLATE_START_LOGO ?? "./../assets/logo.svg";

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
};
</script>

<style lang="scss">
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 50px;
}

.bg-svg-logo {
  position: relative;
  width: 100%;
  height: calc(100vh - 100px);
}

.bg-svg-logo::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: var(--bg-image);
  background-repeat: no-repeat;
  background-position: -5% 100%;
  background-size: 35%;
  opacity: 0.1;
  z-index: -1; // Damit es hinter den Kinderelementen liegt
}
</style>