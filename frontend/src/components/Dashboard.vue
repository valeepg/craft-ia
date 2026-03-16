<template>
  <div class="ai-guided-cv-flow relative min-h-screen bg-[#000205] text-white font-sans overflow-hidden">
  
    <div class="pointer-events-none fixed inset-0 z-0">
        <div class="absolute inset-0 bg-black"></div>
        <div class="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] 
                bg-[radial-gradient(circle_at_30%_40%,_rgba(37,99,235,0.6)_0%,_rgba(29,78,216,0.2)_20%,_transparent_50%)] 
                blur-[90px] animate-pulse-slow"></div>

        <div class="absolute top-[30%] -right-[10%] w-[90%] h-[90%] 
                bg-[radial-gradient(circle_at_70%_50%,_rgba(6,182,212,0.15)_0%,_transparent_60%)] 
                blur-[100px] animate-pulse"></div>
    
        <div class="absolute inset-0 bg-mesh-dark opacity-40 animate-gradient-slow mix-blend-add"></div>

        <div class="absolute inset-0 opacity-[0.06] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-125 contrast-150"></div>
        </div>
    <!-- Animated background glow (modern, moving blue light) -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-blue-500/18 blur-3xl animate-blob" />
      <div class="absolute -bottom-44 right-14 h-[560px] w-[560px] rounded-full bg-cyan-400/14 blur-3xl animate-blob delay-2000" />
      <div class="absolute top-1/3 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-indigo-500/12 blur-3xl animate-blob delay-4000" />
    </div>

    <div class="relative z-10 mx-auto max-w-6xl px-6 pt-10 pb-20">
      
      <header class="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
        <div>
          <h1 class="text-3xl font-display font-bold text-white mb-2">Mi Historial</h1>
          <p class="text-sm text-white/60">Gestiona tus documentos y crea nuevas versiones.</p>
        </div>
        <button 
          @click="router.push('/generador')"
          class="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10 hover:border-white/40"
        >
          ← Continuar Creando CV
        </button>
      </header>

      <div v-if="!cvList || cvList.length === 0" class="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md py-24 text-center shadow-2xl">
        <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10 border border-blue-400/20 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-blue-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h2 class="mb-3 text-2xl font-bold text-white">Aún no tienes currículums</h2>
        <p class="mb-8 max-w-md text-sm text-white/60">
          Tu historial está vacío. Empieza creando tu primer CV de alto impacto potenciado por IA y destácate ante los reclutadores.
        </p>
        <button 
          @click="goToApp"
          class="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
        >
          Crear mi primer CV
        </button>
      </div>

      <div v-else>
        <div class="flex justify-end mb-6">
          <button @click="goToApp" class="flex items-center gap-2 rounded-full bg-blue-600/20 border border-blue-500/30 px-5 py-2.5 text-sm font-medium text-blue-300 transition-all hover:bg-blue-600/40 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Crear CV desde cero
          </button>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="cv in cvList" :key="cv.id" class="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/[0.05] hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10">
            <div>
              <div class="flex items-start justify-between mb-4">
                <div class="rounded-lg bg-white/10 px-3 py-1 text-xs text-white/70">{{ formatDate(cv.createdAt) }}</div>
              </div>
              <h3 class="mb-2 text-xl font-semibold text-white truncate">{{ cv.title || 'CV Profesional' }}</h3>
              <div class="flex flex-wrap gap-2 mb-6">
                <span class="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-medium text-blue-300 uppercase tracking-wide">{{ cv.objective || 'Trabajo' }}</span>
                <span class="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-medium text-cyan-300 uppercase tracking-wide capitalize">{{ cv.style || 'Moderno' }}</span>
              </div>
            </div>
            <div class="flex flex-col gap-2 mt-auto pt-4 border-t border-white/5">
              <button @click="loadCV(cv)" class="w-full rounded-xl border border-white/10 py-2.5 text-sm font-medium text-white/70 transition-all hover:border-blue-400/50 hover:text-blue-300 hover:bg-blue-500/5">
                Editar CV
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Cambia esta variable entre un arreglo vacío [] y uno con datos para ver ambos diseños.
const cvList = ref([]) 
// Ejemplo con datos: const cvList = ref([{ id: 1, title: 'Mi primer CV', objective: 'Trabajo', style: 'Moderno', createdAt: new Date() }])

const goToApp = () => {
  // Asegúrate de que esta ruta apunte a tu generador de CVs
  router.push('/generador') 
}

const loadCV = (cv) => {
  cvStore.loadFromSaved(cv)
  router.push('/generador')
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}
</script>