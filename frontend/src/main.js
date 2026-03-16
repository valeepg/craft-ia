import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import { useAuthStore } from './stores/auth';
import './assets/main.css';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.mount('#app');

const authStore = useAuthStore();
try {
  authStore.init();
} catch (error) {
  console.error('Error initializing auth store:', error);
}

// Global error overlay for runtime exceptions (helps debug blank screen)
const showErrorOverlay = (message) => {
  const existing = document.getElementById('error-overlay');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.id = 'error-overlay';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,0.85)';
  overlay.style.color = 'white';
  overlay.style.zIndex = '9999';
  overlay.style.padding = '24px';
  overlay.style.fontFamily = 'system-ui, sans-serif';
  overlay.style.overflow = 'auto';
  overlay.innerHTML = `
    <h1 style="margin-top:0;font-size:1.5rem;">Error de ejecución</h1>
    <pre style="white-space: pre-wrap; word-break: break-word;">${message}</pre>
  `;
  document.body.appendChild(overlay);
};

window.addEventListener('error', (event) => {
  showErrorOverlay(event.error ? event.error.stack || event.error : event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  showErrorOverlay(event.reason ? event.reason.stack || event.reason : String(event.reason));
});
