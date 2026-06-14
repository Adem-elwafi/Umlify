<template>
  <div class="min-h-screen w-screen flex items-center justify-center bg-[#121214] text-gray-100 p-4">
    <div class="w-full max-w-md bg-[#1a1a1e] border border-gray-800 rounded-xl p-8 shadow-2xl">
      <div class="text-center mb-8">
        <div class="inline-flex w-12 h-12 rounded-xl bg-indigo-600 items-center justify-center font-bold text-white text-xl shadow-lg tracking-wider mb-3">U</div>
        <h2 class="text-2xl font-bold text-white">Welcome Back</h2>
        <p class="text-sm text-gray-400 mt-1">Log in to open your UMLify canvases</p>
      </div>

      <div v-if="authStore.apiErrorMessage" class="mb-5 p-3.5 bg-rose-950/40 border border-rose-900/50 rounded-lg flex items-start space-x-2 text-rose-400 text-xs leading-relaxed">
        <span class="mt-0.5 shrink-0">⚠️</span>
        <p class="font-mono">{{ authStore.apiErrorMessage }}</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
          <input 
            v-model="email" 
            type="email" 
            required
            class="w-full px-4 py-3 rounded-lg bg-[#26262b] border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
            placeholder="name@university.tn"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required
            class="w-full px-4 py-3 rounded-lg bg-[#26262b] border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none text-white font-semibold text-sm rounded-lg shadow-lg transition-all"
        >
          {{ isLoading ? 'Authenticating...' : 'Sign In' }}
        </button>
      </form>

      <div class="mt-6 text-center text-xs text-gray-400">
        Don't have an account? 
        <router-link to="/signup" class="text-indigo-400 hover:underline font-medium ml-1">Create an account</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  const success = await authStore.login(email.value, password.value)
  isLoading.value = false
  
  if (success) {
    router.push('/')
  }
}
</script>
<style scoped lang="css">
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--c-beige) 0%, #e8d5cf 100%);
  padding: 2rem;
}

.login-card {
  background: white;
  border-radius: 24px;
  padding: 3rem;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(23, 65, 67, 0.15);
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--c-dark-teal);
  margin: 0 0 0.5rem;
  background: linear-gradient(135deg, var(--c-teal), var(--c-dark-teal));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-header p {
  color: var(--text-light);
  margin: 0;
  font-size: 1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.875rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  border-color: var(--c-teal);
  box-shadow: 0 0 0 3px var(--c-teal-transparent);
}

.form-group input::placeholder {
  color: #999;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text-primary);
}

.remember-me input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--c-teal);
}

.forgot-password {
  color: var(--c-teal);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: var(--c-dark-teal);
}

.btn-login {
  padding: 1rem;
  background: linear-gradient(135deg, var(--c-teal), var(--c-dark-teal));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(66, 122, 118, 0.3);
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 122, 118, 0.4);
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.divider {
  position: relative;
  text-align: center;
  margin: 0.5rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background: #e0e0e0;
}

.divider span {
  position: relative;
  background: white;
  padding: 0 1rem;
  color: #999;
  font-size: 0.9rem;
}

.btn-google {
  padding: 1rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--text-primary);
}

.btn-google:hover {
  background: #f8f8f8;
  border-color: #d0d0d0;
}

.signup-link {
  text-align: center;
  margin-top: 2rem;
  color: var(--text-light);
  font-size: 0.95rem;
}

.signup-link a {
  color: var(--c-teal);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.signup-link a:hover {
  color: var(--c-dark-teal);
}

@media (max-width: 640px) {
  .login-card {
    padding: 2rem 1.5rem;
  }
  
  .login-header h1 {
    font-size: 2rem;
  }
  
  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
