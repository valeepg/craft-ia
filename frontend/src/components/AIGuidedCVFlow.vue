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
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-blue-500/18 blur-3xl animate-blob pointer-events-none" />
      <div class="absolute -bottom-44 right-14 h-[560px] w-[560px] rounded-full bg-cyan-400/14 blur-3xl animate-blob  pointer-events-none delay-2000" />
      <div class="absolute top-1/3 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-indigo-500/12 blur-3xl animate-blob pointer-events-none delay-4000" />
    </div>
    
    <div class="mx-auto flex min-h-screen max-w-6xl flex-col relative z-10">
      <!-- Header -->
      <header class="flex items-center justify-between px-6 py-5 w-full border-b border-white/5 bg-white/[0.01]">
        
        <div class="flex items-center w-1/3">
          <button
            type="button"
            @click="router.push('/')"
            class="rounded-full border border-white/70 bg-transparent px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            ← Inicio
          </button>
        </div>

        <div class="hidden items-center justify-center gap-3 text-sm text-white/70 sm:flex w-1/3">
          <span class="rounded-full bg-white/10 px-4 py-1.5">Meta: <span class="font-semibold text-white">{{ objective || '—' }}</span></span>
          <span class="rounded-full bg-white/10 px-4 py-1.5">Estilo: <span class="font-semibold text-white capitalize">{{ selectedCVType || '—' }}</span></span>
        </div>

        <div class="flex items-center justify-end w-1/3 gap-4">
          
          <div class="text-sm text-white/70">
            Paso <span class="font-semibold text-white">{{ currentStep }}</span> de 5
          </div>

          <template v-if="authStore.isLoggedIn">
            <div class="h-5 w-px bg-white/20"></div> <button 
              @click="router.push('/dashboard')" 
              class="text-sm font-medium text-blue-200/90 hover:text-white transition-colors cursor-pointer hover:underline underline-offset-4"
            >
              Historial
            </button>
            
            <div class="h-3 w-px bg-white/10"></div> <button 
              @click="authStore.signOut(); router.push('/')" 
              class="text-sm font-medium text-white/50 hover:text-red-400 transition-colors cursor-pointer hover:underline underline-offset-4"
            >
              Cerrar sesión
            </button>
            
            <div class="flex h-9 w-9 ml-1 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-bold text-white backdrop-blur-md">
              {{ authStore.user?.fullName?.charAt(0).toUpperCase() || 'U' }}
            </div>
          </template>
          
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 overflow-auto px-6 pb-28">
        <div class="mx-auto w-full max-w-5xl">
          <!-- Step indicators -->
          <div class="mb-6 flex flex-wrap items-center justify-center gap-2">
            <template v-for="step in 5" :key="step">
              <button
                type="button"
                class="flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition"
                :class="{
                  'border-cyan-400/60 bg-cyan-500/10 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] scale-100': currentStep === step,
                  'border-white/20 bg-slate-950/40 text-white/60 hover:bg-white/15 hover:text-white': currentStep !== step,
                }"
                @click="currentStep = step"
              >
                <span class="flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold">
                  {{ step }}
                </span>
                <span class="hidden sm:inline">Paso {{ step }}</span>
              </button>
            </template>
          </div>

          <!-- Card container -->
          <div class="rounded-3xl border border-white/20 bg-white/10 p-10 shadow-glow backdrop-blur-md">
            <!-- Step 1 -->
            <div v-if="currentStep === 1" class="space-y-6">
                <div class="space-y-3">
                    <h2 class="text-3xl font-bold text-white">Paso 1: ¿Cuál es tu meta?</h2>
                    <p class="text-sm text-white/60">Elige una meta, el puesto al que aspiras y describe brevemente la vacante que buscas.</p>
                </div>

                <div class="flex flex-wrap items-center justify-center gap-4">
                    <button
                    type="button"
                    v-for="meta in metas"
                    :key="meta"
                    @click="selectMeta(meta)"
                    :class="[
                        'min-w-[150px] rounded-full px-8 py-3 text-center transition-all duration-300 focus:outline-none border',
                        objective === meta
                        ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.2)] scale-105'
                        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:bg-white/10 hover:text-white'
                    ]"
                    >
                    {{ meta }}
                    </button>
                </div>

                <div class="space-y-2">
                    <label class="block text-sm font-semibold text-white/80">Puesto o Título Objetivo </label>
                    <p class="text-[11px] text-white/40 italic">
                        Escribe el título o puesto objetivo completo para que el asistente IA pueda entender tu objetivo profesional. Por ejemplo: "Desarrollador Backend Junior", "Becario de Marketing Digital" o "Candidato a Maestría en Data Science".
                    </p>
                    <input
                        type="text"
                        v-model="targetJob"
                        class="w-full rounded-2xl border border-white/15 bg-white/5 p-4 text-white placeholder:text-white/20 focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none"
                        placeholder="Ej: Desarrollador Backend Junior"
                    />
                </div>

                <div class="space-y-2">
                    <label class="block text-sm font-semibold text-white/80">Descripción de la vacante</label>
                    <p class="text-[11px] text-white/40 italic">
                    Describe el puesto para que el asistente IA pueda comenzar.
                    </p>
                    <textarea
                    v-model="vacancyInfo"
                    class="w-full min-h-[140px] resize-none rounded-3xl border border-white/15 bg-white/5 p-4 text-white placeholder:text-white/20 focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none"
                    placeholder="Ej: Descripción del puesto de Developer en XYZ..."
                    ></textarea>
                </div>

                <div class="flex flex-col gap-2">
                    <p v-if="!objective" class="text-[11px] font-bold text-cyan-400/80 tracking-tighter">
                    Se usará "Trabajo" por defecto si no seleccionas una meta.
                    </p>
                </div>
            </div>

            <!-- Step 2 -->
            <div v-if="currentStep === 2" class="space-y-6">
              <CVSelectorExpert @select="selectCVTypeAndNext" />
            </div>

            <!-- Step 3 -->
            <div v-if="currentStep === 3" class="space-y-6">
              <div class="space-y-3">
                <h2 class="text-xl font-bold">Paso 3: Confirma la estructura</h2>
                <p class="text-sm text-white/60">Arrastra para reordenar las secciones. Esto se reflejará en tu CV final.</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h4 class="font-semibold mb-2">Estructura</h4>
                  <draggable
                    v-model="finalStructure"
                    item-key="id"
                    class="space-y-2"
                    handle=".handle"
                  >
                    <template #item="{ element }">
                      <div class="flex items-center gap-3 p-3 bg-white/10 rounded-xl cursor-move">
                        <span class="handle text-white/50">⋮⋮</span>
                        <span>{{ element.label }}</span>
                      </div>
                    </template>
                  </draggable>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h4 class="font-semibold mb-2">Previsualización</h4>
                  <div class="space-y-2">
                    <div v-for="section in finalStructure" :key="section.id" class="p-3 bg-white/10 rounded-lg">
                      {{ section.label }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 4 -->
            <div v-if="currentStep === 4" class="flex h-[80vh] gap-4 animate-fadeIn">
              <div class="flex-1 flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
                
                <div class="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span class="text-xs font-bold uppercase tracking-widest text-emerald-400">Craft.IA</span>
                  </div>
                  <span class="text-[10px] text-white/60 italic">Diseño seleccionado: {{ selectedCVType }}</span>
                </div>

                <div class="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6 bg-black/5">
                  <div v-for="msg in chatHistory" :key="msg.id" 
                    :class="[
                      'max-w-[85%] p-4 rounded-2xl border transition-all duration-300',
                      msg.role === 'user' 
                        ? 'ml-auto bg-emerald-500/10 border-emerald-500/20 text-white rounded-tr-none' 
                        : 'mr-auto bg-white/5 border-white/10 text-emerald-50/90 rounded-tl-none'
                    ]">
                    
                    <div v-if="msg.role === 'assistant'" class="flex items-center gap-2 mb-2 opacity-50">
                      <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span class="text-[10px] font-black uppercase tracking-tighter">Craft.IA Response</span>
                    </div>

                    <p class="text-sm leading-relaxed tracking-wide whitespace-pre-line italic">
                      {{ msg.text }}
                    </p>
                  </div>

                  <div v-if="isAiLoading" class="mr-auto bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none animate-pulse">
                    <div class="flex gap-2">
                      <div class="w-2 h-2 bg-white/20 rounded-full animate-bounce"></div>
                      <div class="w-2 h-2 bg-white/20 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div class="w-2 h-2 bg-white/20 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>

                <div class="p-4 bg-black/20 border-t border-white/5">
                  <textarea
                    v-model="userMessage"
                    @keyup.enter.exact="sendMessage"
                    rows="6"
                    class="w-full bg-transparent p-4 text-white text-lg placeholder:text-sm placeholder:text-white/20 outline-none resize-none custom-scrollbar border border-white/10 rounded-2xl focus:border-emerald-500/40 transition-all shadow-inner"
                    placeholder="Escribe a Craft.Ia aquí..."
                  ></textarea>
                  
                  <div class="flex justify-between items-center mt-3">
                    <p class="text-[10px] text-white/60">Presiona Enter para enviar • Shift+Enter para línea nueva</p>
                    <button 
                      @click="sendMessage"
                      :disabled="isAiLoading"
                      class="group relative flex items-center gap-2 
                            bg-emerald-500/5 border border-emerald-500/30 
                            px-8 py-2.5 rounded-xl transition-all duration-500
                            hover:bg-emerald-500/10 hover:border-emerald-400 
                            hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]
                            active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"></div>

                      <span class="text-emerald-400 text-xs font-bold uppercase tracking-[0.15em] transition-colors group-hover:text-emerald-300">
                        {{ isAiLoading ? 'Procesando' : 'Enviar' }}
                      </span>

                      <svg 
                        v-if="!isAiLoading"
                        xmlns="http://www.w3.org/2000/svg" 
                        class="w-4 h-4 text-emerald-400/80 group-hover:text-emerald-300 transition-transform group-hover:translate-x-1" 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>

                      <div v-else class="w-3 h-3 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></div>
                    </button>
                  </div>
                </div>
              </div>

              <div class="w-1/3 flex flex-col bg-black/40 border border-white/5 rounded-3xl relative overflow-hidden">
  
                <div class="p-4 text-center border-b border-white/5 bg-black/20 backdrop-blur-md z-10">
                  <span class="text-[10px] font-black text-emerald-400/60 uppercase tracking-[0.2em]">Vista Previa en Vivo</span>
                </div>

                <div class="flex-1 overflow-y-auto custom-scrollbar-mini p-4 bg-transparent flex justify-center items-start">
                  <div class="origin-top transition-transform duration-300 transform scale-[0.35] shadow-2xl" 
                      style="margin-bottom: -750px; min-width: 210mm;"> 
                    <CvPreviewPanel :structure="finalStructure" />
                  </div>
                </div>

                <div class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
              </div>
            </div>

            <!-- Step 5 -->
            <div v-if="currentStep === 5" class="w-full px-6 pt-0 pb-8 animate-in fade-in duration-700 relative z-[100]">
              <header class="mb-6 flex justify-between items-end">
                <div>
                  <h2 class="text-3xl font-bold text-white tracking-tight">Paso 5: Tu CV está listo</h2>
                  <p class="text-sm text-white/50 font-light mt-1">Personaliza colores, el tamaño de texto y edita el texto final.</p>
                </div>

                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                    <span class="text-[10px] uppercase font-bold text-white/40">Color Títulos:</span>
                    <div class="flex gap-2">
                      <button v-for="color in ['#1e293b', '#2563eb', '#059669', '#7c3aed', '#be123c']" 
                        :key="color"
                        @click="cvStore.customColor = color"
                        class="w-6 h-6 rounded-full border border-white/20 transition-transform hover:scale-125"
                        :style="{ backgroundColor: color }"></button>
                      <input type="color" v-model="cvStore.customColor" class="w-6 h-6 bg-transparent border-none cursor-pointer" />
                    </div>
                  </div>
                </div>
              </header>

              <!-- Controles de tamaño de letra -->
              <div class="flex items-center justify-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10 mb-6">
                <span class="text-sm font-medium text-white/70">Tamaño de letra:</span>
                <button @click="decreaseSize" class="w-8 h-8 rounded-full border border-white/20 text-white hover:bg-white/10">-</button>
                <span class="text-sm font-mono text-white/70 mx-2">{{ fontSizeBase }}pt</span>
                <button @click="increaseSize" class="w-8 h-8 rounded-full border border-white/20 text-white hover:bg-white/10">+</button>
              </div>

              <div class="flex flex-col gap-4 md:flex-row mb-8">
                <button @click="downloadPDF" 
                  class="flex-1 group relative flex items-center justify-center gap-3 bg-emerald-500 text-white py-4 rounded-2xl font-black transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95">
                  <span>Descargar PDF</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </button>

                <button @click="saveCV(true)" :disabled="isSaving"
                  class="flex-1 flex items-center justify-center gap-2 bg-emerald-500/5 border border-emerald-500/20 py-4 rounded-2xl text-emerald-400/80 text-sm font-medium hover:bg-emerald-500/10 hover:text-emerald-400 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Crear nueva versión
                </button>
              </div>

              <div >
                <CvPreviewPanel :structure="finalStructure" :fontSizeBase="fontSizeBase" :marginValue="marginValue" @updateSize="val => fontSizeBase = val" />
              </div>
            </div>
            
          </div>
        </div>
      </main>

      <footer class="fixed bottom-0 left-0 z-30 w-full bg-[#000a1f]/80 backdrop-blur-lg border-t border-white/10 px-6 py-5">
        <div class="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <button
            type="button"
            class="flex-1 min-w-[160px] rounded-full border border-white/30 bg-white/5 backdrop-blur-sm px-8 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed"
            @click="prevStep"
            :disabled="currentStep === 1"
          >
            Atrás
          </button>
          <button
            type="button"
            class="flex-1 min-w-[240px] rounded-full border border-cyan-400/50 bg-cyan-500/10 px-8 py-3 text-sm font-semibold text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] active:scale-95"
            @click="nextStep"
          >
            {{ currentStep === 5 ? 'Finalizar' : 'Siguiente' }}
          </button>
        </div>
      </footer>
  
    </div>
    <Transition name="toast">
      <div v-if="showErrorToast" class="fixed top-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4">
        <div class="flex items-center gap-3 bg-red-500/10 backdrop-blur-xl border border-red-500/50 p-4 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-500/20 text-red-400">
            ⚠️
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-white">{{ toastMessage }}</p>
          </div>
          <button @click="showErrorToast = false" class="text-white/40 hover:text-white transition-colors">
            ✕
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCvStore } from '@/stores/cv';
import { storeToRefs } from 'pinia'; // IMPORTANTE: Agregado para desestructurar con reactividad
import CvPreviewPanel from './CvPreviewPanel.vue';
import CVSelectorExpert from './CVSelectorExpert.vue';
import draggable from 'vuedraggable';
import html2pdf from 'html2pdf.js';
import { CV_STANDARDS } from '@/constants/cvStandards'; 

// 1. Inicializamos los stores
const router = useRouter();
const authStore = useAuthStore();
const cvStore = useCvStore();

// 2. Extraemos el estado del store (SIN duplicar declaraciones)
// Usamos storeToRefs para que currentStep sea reactivo
const { currentStep, chatHistory } = storeToRefs(cvStore); 

// 3. Estado local del componente (QUITAMOS currentStep de aquí)
const showErrorToast = ref(false);
const toastMessage = ref('');
const chatContainer = ref(null);
const objective = ref('');
const targetJob = ref('');
const vacancyInfo = ref('');
const selectedCVType = ref('');
const finalStructure = ref([]);
const userMessage = ref('');
const isAiLoading = ref(false);

// Variable de entorno
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Margen dinámico basado en el CV seleccionado
const marginValue = computed(() => {
  const standard = CV_STANDARDS[selectedCVType.value];
  if (!standard) return 20;
  const margins = standard.specs.margins;
  if (margins.includes('cm')) {
    return parseFloat(margins) * 10; // cm to mm
  } else {
    return parseFloat(margins) || 20;
  }
});
const isSaving = ref(false);


const metas = ['Beca', 'Trabajo', 'Maestría'];

const fontSizeBase = ref(11); // Tamaño inicial

const increaseSize = () => { 
  if(fontSizeBase.value < 18) fontSizeBase.value++ 
};

const decreaseSize = () => { 
  if(fontSizeBase.value > 8) fontSizeBase.value-- 
};
// --- MÉTODOS DE NAVEGACIÓN Y SELECCIÓN ---
function selectMeta(meta) {
  objective.value = meta;
}
const scrollToBottom = async () => {
  // Esperamos a que Vue termine de renderizar el nuevo mensaje
  await nextTick(); 
  if (chatContainer.value) {
    chatContainer.value.scrollTo({
      top: chatContainer.value.scrollHeight,
      behavior: 'smooth' // Desplazamiento suave
    });
  }
};
watch(currentStep, (newStep) => {
  if (newStep === 4) {
    // 1. Validamos que exista el estándar seleccionado
    const standard = CV_STANDARDS[selectedCVType.value];

    if (!standard) {
      // 2. Saludo de emergencia si no hay diseño seleccionado (evita el crash)
      chatHistory.value = [{
        id: Date.now(),
        role: 'assistant',
        text: "¡Hola! Estoy listo para optimizar tu CV pero recuerda escoger que tipo de Cv quieres para tener más contexto sobre ti."
      }];
      return;
    }

    // 3. Saludo normal si todo está bien
    chatHistory.value = [{
      id: Date.now(),
      role: 'assistant',
      text: `👋 ¡Todo listo! He configurado tu estrategia basada en el estándar ${standard.title}.
                \nOptimizaré tu perfil siguiendo este orden: ${finalStructure.value.map(s => s.label).join(' → ')}.
                \n¿Empezamos a construirlo? Solo dime "Hola" o "Empezar" para analizar tus datos actuales.`
    }];
  }
});

const selectCVTypeAndNext = (type) => {
  const standard = CV_STANDARDS[type.toLowerCase()];
  if (standard) {
    cvStore.setCvType(type);
    selectedCVType.value = type;
    // Esto es lo que activa las cajitas para arrastrar
    finalStructure.value = [...standard.structure]; 
  }
  currentStep.value = 3;
};
function triggerAlert(msg) {
  toastMessage.value = msg;
  showErrorToast.value = true;
  
  // Se oculta sola después de 4 segundos
  setTimeout(() => {
    showErrorToast.value = false;
  }, 4000);
}
async function nextStep() {
  if (currentStep.value === 1) {
    if (!targetJob.value.trim()) {
      triggerAlert("Por favor, escribe el puesto al que aspiras para continuar.");
      return;
    }
    if (!objective.value) selectMeta('Trabajo');
  }

  if (currentStep.value === 3 && finalStructure.value.length === 0) {
    triggerAlert("No hay una estructura definida. Selecciona un estilo en el Paso 2.");
    currentStep.value = 2;
    return;
  }

  if (currentStep.value < 5) {
    currentStep.value++;
  } else if (currentStep.value === 5) {
    // Si está en el paso 5, el botón de "Siguiente" ahora guarda
    saveCV();
  }
}

function prevStep() {
  if (currentStep.value > 1) currentStep.value--;
}

// --- LÓGICA DE IA ---
async function sendMessage() {
  if (!userMessage.value.trim() || isAiLoading.value) return;

  // 1. Limpiamos el texto y preparamos el historial
  const currentInput = userMessage.value;
  const newMessage = { id: Date.now(), role: 'user', text: currentInput };
  cvStore.chatHistory.push(newMessage);
  userMessage.value = ''; 

  const cleanHistory = cvStore.chatHistory.map(m => ({
    role: m.role,
    text: m.text
  }));

  // 2. CORRECCIÓN AQUÍ: Obtenemos el tipo y las specs correctamente
  // selectedCVType es el REF, lo pasamos a minúsculas para coincidir con las llaves
  const typeKey = selectedCVType.value?.toLowerCase() || 'harvard';

  const isFirstInteraction = cvStore.chatHistory.length <= 1;

  // Buscamos el estándar completo
  const standardObj = CV_STANDARDS[typeKey] || CV_STANDARDS.harvard;

  const payload = { 
    prompt: isFirstInteraction 
            ? `[INICIO DE CONVERSACIÓN] El usuario dice: "${currentInput}". 
               Salúdalo con mucho carisma como por ejemplo: (Un gusto tenerte aquí, etc...), preséntate como Craft.ai 
               y menciónale que estás listo para optimizar su CV con el estándar ${typeKey}.` 
            : currentInput,
    objective: objective.value || 'Trabajo',
    targetJob: targetJob.value || 'Profesional',
    vacancyInfo: vacancyInfo.value || '',
    cvType: typeKey,
    fullSpecs: standardObj, // Enviamos el objeto estándar completo
    finalStructure: JSON.parse(JSON.stringify(finalStructure.value)), 
    history: cleanHistory
  };

  try {
    isAiLoading.value = true;
    const response = await fetch(`${apiUrl}/api/cv/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    // Si el servidor responde con error, lanzamos una excepción para ir al catch
    if (!response.ok) {
       throw new Error(`Error en servidor: ${response.status}`);
    }

    const result = await response.json();

    cvStore.chatHistory.push({ 
      id: Date.now() + 1, 
      role: 'assistant', 
      text: result.messageToUser 
    });
    
    if (result.updatedCVData) {
        cvStore.content = mergeObjects(cvStore.content, result.updatedCVData);
    }

  } catch (error) {
    console.error('Error detallado:', error);
    if (error.message.includes('500')) {
     triggerAlert(" El servidor de IA está saturado. Espera 30 segundos e intenta de nuevo.");
    }
    cvStore.chatHistory.push({ 
      id: Date.now(), 
      role: 'assistant', 
      text: "Hubo un problema al conectar con el servidor. ¿Podemos reintentar?" 
    });
  } finally {
    isAiLoading.value = false;
    nextTick(() => scrollToBottom());
  }
}

// Función auxiliar para no sobrescribir con vacíos
function mergeObjects(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      target[key] = { ...target[key], ...source[key] };
    } else if (Array.isArray(source[key]) && source[key].length > 0) {
      target[key] = source[key];
    } else if (source[key] !== "" && source[key] !== null) {
      target[key] = source[key];
    }
  }
  return target;
}

// --- ACCIONES FINALES ---
const downloadPDF = async () => {
  const element = document.getElementById('cv-printable-area');
  if (!element) return;

  // 1. Obtenemos el estándar activo
  const standard = CV_STANDARDS[selectedCVType.value.toLowerCase()] || CV_STANDARDS.harvard;
  
  // 2. Convertimos el margen del estándar a un formato que CSS entienda
  // Si el estándar dice "2.54 cm", lo usamos tal cual para el padding interno
  const cssMargin = standard.specs.margins || '20mm';

  // 3. Opciones de exportación
  const opt = {
    margin: 0, // <--- IMPORTANTE: 0 para que no se desfase
    filename: `CV_${cvStore.content?.personalInfo?.fullName || 'Profesional'}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { 
      scale: 4, 
      useCORS: true, 
      letterRendering: true,
      scrollY: 0,
      logging: false
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  // 4. Aplicamos temporalmente el margen del estándar a la hoja
  const originalPadding = element.style.padding;
  element.style.padding = cssMargin; // Inyectamos el margen real (ej: 2.54cm)

  // 5. Generamos el PDF
  try {
    await html2pdf().set(opt).from(element).save();
  } finally {
    // 6. Restauramos el padding original para que la web no se mueva
    element.style.padding = originalPadding;
  }
};

async function saveCV(asNew = false) {
  if (isSaving.value) return;
  
  isSaving.value = true;
  try {
    const payload = {
      userId: authStore.user?.id,
      // Si asNew es true, no enviamos ID para que el backend cree un registro nuevo
      cvId: asNew ? null : cvStore.currentCvId, 
      cvData: cvStore.content, 
      // Si es nuevo, le ponemos un nombre distinto para no confundirnos
      title: asNew 
        ? `${targetJob.value} (Copia ${new Date().toLocaleDateString()})` 
        : (targetJob.value || "Mi CV"),
      cvType: cvStore.cvType,
      objectiveType: objective.value?.toLowerCase() || 'trabajo',
      vacancyInfo: vacancyInfo.value,
      // Guardamos también el historial para que la IA lo recupere luego
      chatHistory: cvStore.chatHistory 
    };

    const response = await fetch(`${apiUrl}/api/cv/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok) {
      // IMPORTANTE: Guardamos el ID que nos devuelva el servidor para futuras ediciones
      if (result.id) cvStore.currentCvId = result.id;

      toastMessage.value = asNew ? "¡Nueva versión creada!" : "¡Cambios guardados!";
      showErrorToast.value = false;
      
      // Si no es una copia, quizás no quieras echar al usuario al dashboard aún
      if (asNew) {
        setTimeout(() => router.push('/dashboard'), 1500);
      }
    } else {
      throw new Error(result.error || "Error en el servidor");
    }
  } catch (err) {
    console.error("Error al guardar:", err);
    toastMessage.value = err.message || "Error al conectar con el servidor";
    showErrorToast.value = true;
  } finally {
    isSaving.value = false;
  }
}

</script>


<style scoped>
.step-container {
  transition: all 0.3s ease;
}

@keyframes blob {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(20px, -20px) scale(1.05);
  }
  66% {
    transform: translate(-25px, 20px) scale(0.95);
  }
}

.animate-blob {
  animation: blob 12s ease-in-out infinite;
}

.delay-2000 {
  animation-delay: 2s;
}

.delay-4000 {
  animation-delay: 4s;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
/* Animación de la Alerta (Toast) */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-enter-from {
  opacity: 0;
  transform: translate(-50%, -100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -50px) scale(0.9);
}
/* Scrollbar elegante para el Chat */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.4); /* Color Esmeralda */
}

/* Scrollbar ultra-fina para la Vista Previa lateral */
.custom-scrollbar-mini::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar-mini::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
}

/* Efecto de entrada suave */
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
/* Scrollbar elegante para el Chat */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.2); /* Color Esmeralda muy suave */
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.5);
}
/* Dentro de tu CSS de la vista previa */
.cv-content-text {
  text-align: left; /* Alineado a la izquierda para lectura profesional */
  text-wrap: pretty; /* Evita palabras huérfanas al final */
  line-height: 1.5; /* Espaciado cómodo */
  width: 100%;
}

/* Para las listas de trabajo (Experiencia) */
.cv-list {
  list-style-type: disc; /* Viñeta de punto */
  margin-left: 1.25rem; /* Sangría para que el punto no se salga */
  text-align: justify; /* Esto hace que el texto llene los costados por igual */
}

/* Aseguramos que el contenido dentro de la hoja se escriba a la izquierda */
:deep(.cv-section-text), 
:deep(.cv-section-title) {
  text-align: left !important;
}

:deep(.cv-paper) {
  margin: 0 auto; /* Centra la hoja dentro del cristal */
}
.custom-ctrl-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 300;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.custom-ctrl-btn:hover {
  background: rgba(71, 141, 118, 0.5); /* El verde esmeralda de tu app */
  transform: scale(1.1) translateX(5px);
  border-color: rgba(255, 255, 255, 0.5);
}

.a4-sheet {
  pointer-events: all !important;
  user-select: text !important;
  -webkit-user-select: text !important;
  position: relative;
  z-index: 9999 !important; /* Máxima prioridad */
}
.main-editable-container {
  cursor: text !important;
  pointer-events: auto !important;
}
.step-5-container { 
  pointer-events: none; 
}

.step-5-container > * { 
  pointer-events: auto; 
}
</style>