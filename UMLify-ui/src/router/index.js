import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import Home from '../Views/Home.vue'
import Login from '../Views/Login.vue'
import Signup from '../Views/Signup.vue'

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Dynamic Global Interceptor Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Intercept unauthorized workspace channel accesses
    next('/login')
  } else if ((to.path === '/login' || to.path === '/signup') && authStore.isAuthenticated) {
    // Fast-forward authenticated workers past visual login sequences
    next('/')
  } else {
    next()
  }
})

export default router