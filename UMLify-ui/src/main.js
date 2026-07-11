import { createApp } from 'vue';
import { createPinia } from 'pinia'; 
import App from './App.vue';
import router from './router';
import './style.css'; 

// Programmatically lock dark mode as the default framework profile
// document.documentElement.classList.add('dark');

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);   
app.use(router);  

app.mount('#app');