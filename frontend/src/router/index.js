import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('@/views/LandingPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/app',
    redirect: '/generador',
  },
  {
    path: '/generador',
    name: 'Generador',
    component: () => import('@/components/AIGuidedCVFlow.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/components/Dashboard.vue'),
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});