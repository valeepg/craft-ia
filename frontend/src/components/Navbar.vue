<template>
  <header class="fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      
      <!-- Brand Logo -->
      <div class="flex items-center gap-3 cursor-pointer group" @click="router.push('/')">
        <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 font-black text-white text-xs shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-transform group-hover:scale-105">
          CV
        </div>
        <div class="flex flex-col">
          <span class="font-display text-lg font-extrabold tracking-tight text-white">Craft<span class="text-indigo-400">.AI</span></span>
        </div>
      </div>

      <!-- Links de Navegación Limpios (Sin contornos ni cajas de botón) -->
      <nav class="flex items-center gap-5 text-sm font-medium text-slate-300">
        <!-- 1. Inicio -->
        <button 
          @click="router.push('/')" 
          :class="[
            'transition-colors cursor-pointer py-1 relative hover:text-white',
            route.path === '/' ? 'text-white font-bold after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-indigo-400 after:rounded-full' : 'text-slate-300'
          ]"
        >
          Inicio
        </button>

        <span class="text-slate-700 font-light select-none">•</span>

        <!-- 2. Crear CV -->
        <button 
          @click="router.push('/generador')" 
          :class="[
            'transition-colors cursor-pointer py-1 relative hover:text-white',
            route.path === '/generador' ? 'text-white font-bold after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-indigo-400 after:rounded-full' : 'text-indigo-300'
          ]"
        >
          Crear CV
        </button>

        <!-- 3. Historial (Solo si hay sesión iniciada) -->
        <template v-if="authStore.isLoggedIn">
          <span class="text-slate-700 font-light select-none">•</span>
          <button 
            @click="router.push('/dashboard')" 
            :class="[
              'transition-colors cursor-pointer py-1 relative hover:text-white',
              route.path === '/dashboard' ? 'text-white font-bold after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-indigo-400 after:rounded-full' : 'text-slate-300'
            ]"
          >
            Historial
          </button>
        </template>
      </nav>

      <!-- Estado de Autenticación -->
      <div class="flex items-center gap-4">
        <template v-if="!authStore.isLoggedIn">
          <button 
            @click="emit('openLogin')" 
            class="text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </template>

        <template v-else>
          <div class="flex items-center gap-3">
            <div class="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 border border-indigo-500/40 text-xs font-bold text-indigo-300">
              {{ userInitial }}
            </div>
            <button 
              @click="authStore.signOut(); router.push('/')" 
              class="text-xs font-medium text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        </template>
      </div>

    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const emit = defineEmits(['openLogin']);

const userInitial = computed(() => {
  if (!authStore.user?.fullName) return 'U';
  return authStore.user.fullName.charAt(0).toUpperCase();
});
</script>
