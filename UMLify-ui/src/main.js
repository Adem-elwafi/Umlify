import { createApp } from 'vue';
import { createPinia } from 'pinia'; 
import App from './App.vue';
import router from './router';
import './style.css'; 

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);   

// Initialize auth store before router so the guard has the correct auth state
// on the very first navigation (avoids stale isAuthenticated check).
import { useAuthStore } from './stores/authStore';
useAuthStore();

app.use(router);  

app.mount('#app');