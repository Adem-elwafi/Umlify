<template>
  <main>
    <template v-if="!isLoggedIn">
      <Login 
        v-if="showLogin" 
        @login-success="handleLoginSuccess" 
        @switch-to-signup="showLogin = false"
      />
      <Signup 
        v-else 
        @signup-success="handleSignupSuccess" 
        @switch-to-login="showLogin = true"
      />
    </template>
    <Canvas v-else />
  </main>
</template>

<script setup>
import { ref } from 'vue';
import Canvas from './components/Canvas.vue';
import Login from './Views/Login.vue';
import Signup from './Views/Signup.vue';

const isLoggedIn = ref(false);
const showLogin = ref(true);

const handleLoginSuccess = () => {
  isLoggedIn.value = true;
};

const handleSignupSuccess = () => {
  isLoggedIn.value = true;
};
</script>

<style>
main {
  padding: 0;
  margin: 0;
  font-family: sans-serif;
  height: 100vh;
  width: 100vw;
}
</style>