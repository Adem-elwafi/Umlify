<template>
  <div class="min-h-screen w-screen flex items-center justify-center bg-[#121214] text-gray-100 p-4">
    <div class="w-full max-w-md bg-[#1a1a1e] border border-gray-800 rounded-xl p-8 shadow-2xl">
      <div class="text-center mb-8">
        <div class="inline-flex w-12 h-12 rounded-xl bg-indigo-600 items-center justify-center font-bold text-white text-xl shadow-lg tracking-wider mb-3">U</div>
        <h2 class="text-2xl font-bold text-white">Get Started</h2>
        <p class="text-sm text-gray-400 mt-1">Create an account to save UML maps natively</p>
      </div>

      <div v-if="localError || authStore.apiErrorMessage" class="mb-5 p-3.5 bg-rose-950/40 border border-rose-900/50 rounded-lg flex items-start space-x-2 text-rose-400 text-xs leading-relaxed">
        <span class="mt-0.5 shrink-0">⚠️</span>
        <p class="font-mono">{{ localError || authStore.apiErrorMessage }}</p>
      </div>

      <form @submit.prevent="handleSignup" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Full Name</label>
          <input 
            v-model="name" 
            type="text" 
            required
            class="w-full px-4 py-2.5 rounded-lg bg-[#26262b] border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all text-sm"
            placeholder="Adem"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Email Address</label>
          <input 
            v-model="email" 
            type="email" 
            required
            class="w-full px-4 py-2.5 rounded-lg bg-[#26262b] border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all text-sm"
            placeholder="student@umlify.com"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required
            class="w-full px-4 py-2.5 rounded-lg bg-[#26262b] border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all text-sm"
            placeholder="Minimum 8 characters"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Confirm Password</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            required
            class="w-full px-4 py-2.5 rounded-lg bg-[#26262b] border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all text-sm"
            placeholder="Confirm password structure"
          />
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none text-white font-semibold text-sm rounded-lg shadow-lg transition-all"
        >
          {{ isLoading ? 'Creating Account...' : 'Register Workspace' }}
        </button>
      </form>

      <div class="mt-6 text-center text-xs text-gray-400">
        Already have an account? 
        <router-link to="/login" class="text-indigo-400 hover:underline font-medium ml-1">Sign In instead</router-link>
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

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const localError = ref(null)
const isLoading = ref(false)

const handleSignup = async () => {
  localError.value = null
  
  // Validation guard check matrices
  if (password.value.length < 8) {
    localError.value = 'Password matrix configuration must containing at least 8 elements.'
    return
  }

  if (password.value !== confirmPassword.value) {
    localError.value = 'Passwords structural confirmation inputs mismatch.'
    return
  }

  isLoading.value = true
  const success = await authStore.signup(name.value, email.value, password.value)
  isLoading.value = false
  
  if (success) {
    router.push('/')
  }
}
</script>
<style scoped lang="css">
.signup-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--c-beige) 0%, #e8d5cf 100%);
  padding: 2rem;
}

.signup-card {
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

.signup-header {
  text-align: center;
  margin-bottom: 2rem;
}

.signup-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--c-dark-teal);
  margin: 0 0 0.5rem;
  background: linear-gradient(135deg, var(--c-teal), var(--c-dark-teal));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.signup-header p {
  color: var(--text-light);
  margin: 0;
  font-size: 1rem;
}

.signup-form {
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

.helper-text {
  font-size: 0.85rem;
  color: var(--text-light);
}

.error-message {
  padding: 0.75rem 1rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c33;
  font-size: 0.9rem;
  text-align: center;
}

.terms {
  font-size: 0.9rem;
}

.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text-primary);
}

.terms-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--c-teal);
  margin-top: 2px;
  flex-shrink: 0;
}

.terms-checkbox a {
  color: var(--c-teal);
  text-decoration: none;
  font-weight: 500;
}

.terms-checkbox a:hover {
  text-decoration: underline;
}

.btn-signup {
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

.btn-signup:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 122, 118, 0.4);
}

.btn-signup:active:not(:disabled) {
  transform: translateY(0);
}

.btn-signup:disabled {
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

.login-link {
  text-align: center;
  margin-top: 2rem;
  color: var(--text-light);
  font-size: 0.95rem;
}

.login-link a {
  color: var(--c-teal);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.login-link a:hover {
  color: var(--c-dark-teal);
}

@media (max-width: 640px) {
  .signup-card {
    padding: 2rem 1.5rem;
  }
  
  .signup-header h1 {
    font-size: 2rem;
  }
}
</style>
