<template>
  <div class="bg-svg-logo" :style="{ '--bg-image': `url(${bgSvgLogoUrl})` }">
    <div class="login" v-if="!showRegisteredInfo">
      <h2>Welcome back to</h2>
      <h1 style="font-size: 3em">{{ welcomeSlogan }}</h1>
      <div v-if="provider === 'pocketbase'">
        <!--login with username and password -->
        <div class="p-fluid">
          <div class="p-field" v-if="addUser">
            <label for="email">E-Mail</label>
            <TextInput id="email" v-model="email" />
          </div>
          <div class="p-field">
            <label for="username">Username</label>
            <TextInput id="username" v-model="username" />
          </div>
          <div class="p-field" v-if="addUser">
            <label for="fullname">Full name</label>
            <TextInput id="fullname" v-model="fullname" />
          </div>
          <div class="p-field mt-2">
            <label for="password">Password</label>
            <TextInput id="password" v-model="password" type="password" />
          </div>
          <div v-if="addUser" class="p-field mt-2">
            <label for="repeat-password">Password</label>
            <TextInput
              id="repeat-password"
              v-model="repeatPassword"
              type="password"
              :class="{ 'p-invalid': password !== repeatPassword }"
            />
          </div>

          <!-- Submit Form -->
          <Button
            v-if="!addUser"
            @click="loginPocketbase()"
            :disabled="loading"
            class="mt-5"
            label="Login"
          />
          <Button
            v-else
            @click="registerPocketbase()"
            :disabled="
              loading ||
              password !== repeatPassword ||
              email === '' ||
              username === ''
            "
            class="mt-5"
            label="Register"
          />
          <p v-if="!addUser">
            Are you a new User? Please click here to
            <a
              @click="addUser = true"
              style="color: blue; text-decoration: underline; cursor: pointer"
              >register</a
            >.
          </p>
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <h2>Registration successful</h2>
      <p>
        Please check your E-Mail inbox for a confirmation link. After confirming
        your E-Mail address you can login.
        <a @click="resetForm" style="cursor: pointer; color: blue">
          Click here to go back to login
        </a>
      </p>
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

const provider = dataProvider.name;
const store = useGlobalStore();

const addUser = ref(false);
const showRegisteredInfo = ref(false);

const welcomeSlogan =
  import.meta.env.VITE_TEMPLATE_WELCOME_SLOGAN ?? 'Welcome to RevDocs';
const bgSvgLogoUrl =
  import.meta.env.VITE_TEMPLATE_START_LOGO ?? './../assets/logo.svg';

// directly redirect for localdb
if (provider === 'localdb') {
  store.loginRedirect();
}

const username = ref('');
const email = ref('');
const password = ref('');
const repeatPassword = ref('');
const fullname = ref('');
const loading = ref(false);

const loginPocketbase = async () => {
  loading.value = true;
  try {
    await dataProvider.login({
      username: username.value,
      password: password.value,
    });
    await store.loginRedirect();
  } catch (e) {
    error(e + '');
  }
  loading.value = false;
};

const registerPocketbase = async () => {
  loading.value = true;
  try {
    await dataProvider.register(
      username.value,
      password.value,
      email.value,
      fullname.value,
    );
    showRegisteredInfo.value = true;
  } catch (e) {
    error(e + '');
  }
  loading.value = false;
};

const resetForm = () => {
  addUser.value = false;
  showRegisteredInfo.value = false;
  username.value = '';
  email.value = '';
  password.value = '';
  repeatPassword.value = '';
  fullname.value = '';
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
  content: '';
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
