<template>
  <div class="ai-guided-cv-flow relative min-h-screen bg-[#030712] text-white font-sans overflow-hidden selection:bg-indigo-500 selection:text-white">
  
    <!-- Fondos dinámicos elegantes -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div class="absolute inset-0 bg-[#030712]"></div>
      
      <!-- Orbe brillante violeta/índigo superior -->
      <div class="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-600/25 via-purple-600/15 to-transparent blur-[120px] animate-pulse"></div>
      
      <!-- Orbe brillante cian inferior -->
      <div class="absolute top-[40%] -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-l from-cyan-500/15 via-blue-600/10 to-transparent blur-[140px]"></div>

      <!-- Malla sutil -->
      <div class="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
    </div>

    <!-- Navbar Unificado -->
    <Navbar @openLogin="authStore.showLoginModal = true" />



    <div class="relative z-10 mx-auto max-w-6xl px-6 pt-28 pb-20">
      
      <!-- Header del Dashboard -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-white/10 pb-6">
        <div>
          <span class="text-indigo-400 text-xs font-bold uppercase tracking-widest block mb-1">Ecosistema Profesional</span>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Mi Historial de CVs</h1>
          <p class="text-sm text-slate-400 font-light mt-1">Gestiona tus documentos guardados en la nube y crea nuevas versiones cuando lo necesites.</p>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="goToApp"
            class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            + Crear Nuevo CV
          </button>
        </div>
      </div>

      <!-- Estado de Carga -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <div class="w-10 h-10 border-3 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin mb-4"></div>
        <p class="text-sm text-slate-400">Cargando tus currículums desde Supabase...</p>
      </div>

      <!-- Estado Vacío (Sin CVs) -->
      <div v-else-if="!cvList || cvList.length === 0" class="flex flex-col items-center justify-center rounded-3xl border border-white/15 bg-slate-900/60 backdrop-blur-2xl py-20 px-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-indigo-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h2 class="mb-2 text-2xl font-bold text-white">Aún no tienes currículums guardados</h2>
        <p class="mb-8 max-w-md text-sm text-slate-400 font-light leading-relaxed">
          Tu historial está listo. Empieza creando tu primer CV de alto impacto potenciado por la IA de Google Gemini.
        </p>
        <button 
          @click="goToApp"
          class="rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          Crear mi primer CV
        </button>
      </div>

      <!-- Lista de CVs Guardados -->
      <div v-else>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="cv in cvList" 
            :key="cv.id" 
            class="group relative flex flex-col justify-between rounded-3xl border border-white/15 bg-slate-900/60 p-6 backdrop-blur-2xl transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-900/80 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-[11px] font-semibold text-indigo-300">
                  {{ formatDate(cv.created_at || cv.updated_at) }}
                </span>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-2.5 py-1 rounded-md">
                  {{ cv.cv_type || 'Harvard' }}
                </span>
              </div>

              <h3 class="mb-2 text-lg font-bold text-white truncate leading-snug">{{ cv.target_job || cv.title || 'CV Profesional' }}</h3>
              
              <p v-if="cv.vacancy_info" class="text-xs text-slate-400 line-clamp-2 mb-4 font-light leading-relaxed">
                {{ cv.vacancy_info }}
              </p>

              <div class="flex flex-wrap gap-2 mb-6">
                <span class="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold text-indigo-300 uppercase tracking-wide">
                  {{ cv.objective_type || 'Trabajo' }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2 pt-4 border-t border-white/10 mt-auto">
              <button 
                @click="loadCV(cv)" 
                class="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:from-indigo-500 hover:to-blue-500 cursor-pointer"
              >
                Editar / Reutilizar CV
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCvStore } from '@/stores/cv';
import { apiService } from '@/services/api';
import Navbar from '@/components/Navbar.vue';

const router = useRouter();
const authStore = useAuthStore();
const cvStore = useCvStore();

const cvList = ref([]);
const isLoading = ref(false);

onMounted(async () => {
  if (authStore.user?.id) {
    try {
      isLoading.value = true;
      const history = await apiService.getUserHistory(authStore.user.id);
      cvList.value = Array.isArray(history) ? history : [];
    } catch (error) {
      console.error("Error al cargar historial del usuario:", error);
    } finally {
      isLoading.value = false;
    }
  }
});

const goToApp = () => {
  router.push('/generador');
};

const loadCV = (cv) => {
  cvStore.loadFromSaved(cv);
  router.push('/generador');
};

const formatDate = (rawDate) => {
  if (!rawDate) return 'Reciente';
  const date = new Date(rawDate);
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
};
</script>