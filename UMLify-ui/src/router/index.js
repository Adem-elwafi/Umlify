import { createRouter, createWebHistory } from 'vue-router'
import Home from '../Views/Home.vue'
import Login from '../Views/Login.vue'
import Signup from '../Views/Signup.vue'

const routes = [
  { path: '/', name: 'Landing', component: () => import('@/Views/Landing.vue') },
  { path: '/workspace', name: 'Workspace', component: Home, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/playground', name: 'Playground', component: () => import('@/Views/Playground.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Dynamic Global Interceptor Guard
router.beforeEach((to, from, next) => {
  try {
    const token = localStorage.getItem('auth_token')

    if (to.meta.requiresAuth && !token) {
      next('/login')
    } else if ((to.path === '/login' || to.path === '/signup') && token) {
      next('/workspace')
    } else {
      next()
    }
  } catch (e) {
    console.error('Router guard error:', e)
    next()
  }
})

export default router