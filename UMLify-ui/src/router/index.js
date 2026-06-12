import { createRouter, createWebHistory } from 'vue-router';
import Home from '../Views/Home.vue';
import Login from '../Views/Login.vue';
import Signup from '../Views/Signup.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  // Fallback redirection to home
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Global authentication guard logic
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token');
  
  if (to.meta.requiresAuth && !token) {
    // Missing token? Kick them straight back to login
    next('/login');
  } else if ((to.path === '/login' || to.path === '/signup') && token) {
    // Already authenticated? Bypass login forms entirely
    next('/');
  } else {
    next();
  }
});

export default router;