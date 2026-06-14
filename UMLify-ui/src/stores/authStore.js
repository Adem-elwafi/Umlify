import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token'))
  const apiErrorMessage = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  const login = async (email, password) => {
    apiErrorMessage.value = null
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      })

      if (response.data && response.data.token) {
        token.value = response.data.token
        user.value = response.data.user || { email }
        localStorage.setItem('auth_token', response.data.token)
        return true
      }
      throw new Error('Invalid response structure from authentication server.')
    } catch (error) {
      apiErrorMessage.value = error.response?.data?.message || error.message || 'Authentication dispatch failed.'
      return false
    }
  }

  const signup = async (name, email, password) => {
    apiErrorMessage.value = null
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password
      })

      if (response.status === 201 || response.status === 200) {
        // Automatically attempt login flow upon successful account registration
        return await login(email, password)
      }
      return false
    } catch (error) {
      apiErrorMessage.value = error.response?.data?.message || error.message || 'Registration dispatch failed.'
      return false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    router.push('/login')
  }

  return {
    user,
    token,
    apiErrorMessage,
    isAuthenticated,
    login,
    signup,
    logout
  }
})