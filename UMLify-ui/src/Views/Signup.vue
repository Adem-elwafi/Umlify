<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-zinc-50 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:16px_16px] p-4">
    <div class="w-full max-w-sm bg-white border border-zinc-200 shadow-xl shadow-zinc-200/30 rounded-2xl p-6 md:p-8 flex flex-col">
      <div class="mb-8">
        <div class="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center font-bold text-white text-xs mb-4 select-none">U</div>
        <h2 class="text-xl font-semibold tracking-tight text-zinc-900">Get Started</h2>
        <p class="text-xs text-zinc-400 font-medium tracking-normal mt-1">Create an account to save your UML maps</p>
      </div>

      <div v-if="localError || authStore.apiErrorMessage" class="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-[11px] font-medium text-red-600 text-center">
        {{ localError || authStore.apiErrorMessage }}
      </div>

      <form @submit.prevent="handleSignup" class="space-y-4">
        <div>
          <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 block font-mono">Full Name</label>
          <input 
            v-model="name" 
            type="text" 
            required
            class="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all shadow-xs"
            placeholder="Adem"
          />
        </div>

        <div>
          <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 block font-mono">Email Address</label>
          <input 
            v-model="email" 
            type="email" 
            required
            class="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all shadow-xs"
            placeholder="student@umlify.com"
          />
        </div>

        <div>
          <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 block font-mono">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required
            class="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all shadow-xs"
            placeholder="Min. 8 characters"
          />
        </div>

        <div>
          <label class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 block font-mono">Confirm Password</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            required
            class="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all shadow-xs"
            placeholder="Repeat password"
          />
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full py-2 mt-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center"
        >
          {{ isLoading ? 'Creating Account...' : 'Register Workspace' }}
        </button>
      </form>

      <div class="mt-8 text-center">
        <p class="text-xs text-zinc-400 font-medium">
          Already have an account? 
          <router-link to="/login" class="text-blue-600 hover:underline cursor-pointer ml-1">Sign In instead</router-link>
        </p>
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
  
  if (password.value.length < 8) {
    localError.value = 'Password must be at least 8 characters.'
    return
  }

  if (password.value !== confirmPassword.value) {
    localError.value = 'Passwords do not match.'
    return
  }

  isLoading.value = true
  const success = await authStore.signup(name.value, email.value, password.value)
  isLoading.value = false
  
  if (success) {
    router.push('/workspace')
  }
}
</script>
