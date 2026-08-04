<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Navbar from '@/components/Navbar.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Variables de estado y autenticación
const email = ref('');
const password = ref('');
const fullName = ref('');
const termsAccepted = ref(false);
const authError = ref('');
const authLoading = ref(false);

const impactCount = ref(0);
const impactTarget = 14800;

// Variables de Modales
const showLoginModal = ref(false);
const showRegisterModal = ref(false);
const showPassword = ref(false);
const showRegisterPassword = ref(false);

const userInitial = computed(() => {
  if (!authStore.user?.fullName) return 'U';
  return authStore.user.fullName.charAt(0).toUpperCase();
});

const vReveal = {
  mounted(el) {
    el.classList.add('opacity-0', 'translate-y-6');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.remove('opacity-0', 'translate-y-6');
            el.classList.add('animate-fade-up');
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
  },
};

onMounted(() => {
  // Abrir modal si viene por query
  if (route.query.login === 'true') {
    showLoginModal.value = true;
  }

  const duration = 1800;
  const fps = 40;
  const steps = (duration / 1000) * fps;
  let currentStep = 0;
  const increment = impactTarget / steps;
  const timer = setInterval(() => {
    currentStep += 1;
    if (currentStep >= steps) {
      impactCount.value = impactTarget;
      clearInterval(timer);
    } else {
      impactCount.value = Math.floor(increment * currentStep);
    }
  }, 1000 / fps);
});


function goToAppAsGuest() {
  router.push('/generador');
}

function goToApp() {
  if (authStore.isLoggedIn) router.push('/generador');
  else showLoginModal.value = true;
}

// Iniciar sesión desde Modal
async function submitLogin() {
  authError.value = '';
  authLoading.value = true;
  try {
    await authStore.signInWithEmail(email.value, password.value);
    showLoginModal.value = false;
  } catch (e) {
    authError.value = e.message || 'Error al iniciar sesión';
  } finally {
    authLoading.value = false;
  }
}

// Registrarse desde Modal
async function submitModalRegister() {
  authError.value = '';
  if (!termsAccepted.value) {
    authError.value = 'Debes aceptar los Términos y Condiciones';
    return;
  }
  authLoading.value = true;
  try {
    await authStore.signUpWithEmail(email.value, password.value, {
      fullName: fullName.value,
      acceptTerms: termsAccepted.value,
    });
    showRegisterModal.value = false;
  } catch (e) {
    authError.value = e.message || 'Error al crear cuenta';
  } finally {
    authLoading.value = false;
  }
}

function resetForm() {
  authError.value = '';
  email.value = '';
  password.value = '';
  fullName.value = '';
  termsAccepted.value = false;
}
</script>

<template>
  <div class="relative min-h-screen flex flex-col justify-between bg-[#030712] text-white font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white">
  
    <!-- Fondos dinámicos elegantes -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div class="absolute inset-0 bg-[#030712]"></div>
      
      <!-- Orbe brillante violeta/índigo superior -->
      <div class="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-transparent blur-[120px] animate-pulse"></div>
      
      <!-- Orbe brillante cian inferior -->
      <div class="absolute top-[40%] -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-l from-cyan-500/20 via-blue-600/15 to-transparent blur-[140px]"></div>

      <!-- Malla sutil -->
      <div class="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
    </div>

    <!-- Header / Navbar Unificado -->
    <Navbar @openLogin="authStore.showLoginModal = true" />

    <!-- Main Hero Section -->
    <main class="flex-1 relative z-10 mx-auto w-full max-w-6xl px-6 pt-28 pb-12 flex flex-col justify-between">
      <section v-if="!authStore.isLoggedIn" class="grid items-center gap-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        
        <div>
          <!-- Badge de IA -->
          <div class="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md mb-6 shadow-sm">
            <span class="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Potenciado por Google Gemini 1.5 & Arquitectura ATS
          </div>

          <h1 class="mb-6 font-display text-4xl leading-[1.15] font-extrabold text-white md:text-5xl lg:text-6xl tracking-tight">
            Ingeniería de CVs de alto impacto optimizados por
            <span class="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Inteligencia Artificial
            </span>
          </h1>

          <p class="mb-8 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg font-light">
            Crea un documento profesional perfecto bajo estándares internacionales (<span class="font-semibold text-white">Harvard, Europass y Tech</span>). Supera los filtros de selección automáticos (<span class="text-cyan-300 font-semibold">ATS</span>) y proyecta tu verdadero potencial profesional en minutos.
          </p>

          <!-- Botón Gigante Animado Único (Crear CV) -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button 
              type="button" 
              @click="goToAppAsGuest"
              class="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-9 py-5 text-lg font-black text-white shadow-[0_0_40px_rgba(79,70,229,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(6,182,212,0.7)] active:scale-95 animate-bounce-subtle"
            >
              <!-- Destello animado -->
              <span class="absolute inset-0 bg-white/20 transition-all duration-700 -translate-x-full group-hover:translate-x-full"></span>
              
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6 transition-transform duration-300 group-hover:rotate-12">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              
              Crear CV Ahora

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 ml-1 transition-transform duration-300 group-hover:translate-x-1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>

          <!-- Badges de garantía -->
          <div class="mt-8 flex items-center gap-6 text-xs font-medium text-slate-400">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              <span>100% Gratis sin tarjeta</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              <span>Exportación PDF A4</span>
            </div>
          </div>
        </div>

        <!-- Tarjeta Lateral CTA / Acceso Rápido (Rediseñada para menos texto) -->
        <div id="cta" class="scroll-mt-32 rounded-3xl border border-white/15 bg-slate-900/40 p-8 shadow-[0_15px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl relative overflow-hidden">
          <div class="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl"></div>
          <div class="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl"></div>

          <div class="relative z-10">
            <h2 class="text-xl font-bold text-white mb-6">Comienza al instante</h2>

            <!-- Opción Invitado (Simplificada) -->
            <button type="button" @click="goToAppAsGuest" class="w-full text-left mb-3 group p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all">
              <div class="flex items-center gap-3">
                <span class="flex h-2.5 w-2.5 rounded-full bg-indigo-400 animate-pulse"></span>
                <div>
                  <p class="text-xs font-bold uppercase tracking-[0.1em] text-indigo-300">Modo Invitado</p>
                  <p class="text-[11px] text-slate-300 mt-0.5">Empieza a crear de inmediato.</p>
                </div>
              </div>
            </button>

            <!-- Opción con Cuenta (Simplificada) -->
            <button type="button" @click="authStore.showRegisterModal = true" class="w-full text-left mb-6 group p-4 rounded-2xl bg-cyan-500/8 border border-cyan-500/20 hover:bg-cyan-500/15 hover:border-cyan-500/40 transition-all flex items-center gap-3">
              <span class="text-xl opacity-80 group-hover:scale-110 transition-transform">📄</span>
              <div>
                <p class="text-xs font-bold text-cyan-300 mb-0.5">Importa tu CV actual</p>
                <p class="text-[11px] text-slate-400">Regístrate para auto-completar tu CV.</p>
              </div>
            </button>

            <!-- Botones -->
            <div class="space-y-3">
              <!-- CTA Principal: Empieza como invitado -->
              <button type="button"
                class="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-blue-500 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                @click="goToAppAsGuest"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                Crear CV Nuevo
              </button>
              
              <!-- Iniciar sesión / Crear cuenta -->
              <div class="flex items-center gap-2">
                <button type="button"
                  class="flex-1 rounded-xl border border-indigo-500/30 bg-indigo-500/5 px-4 py-2.5 text-[11px] font-bold text-indigo-200 hover:bg-indigo-500/20 hover:text-white transition-all"
                  @click="authStore.showRegisterModal = true"
                >
                  Crear Cuenta
                </button>
                <button type="button"
                  class="flex-1 rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-[11px] font-medium text-slate-400 hover:text-white hover:border-white/20 transition-all"
                  @click="authStore.showLoginModal = true"
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Vista de Usuario Autenticado -->
      <section v-else class="flex flex-col items-center justify-center text-center py-16">
        <div class="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-5 py-2 text-xs font-semibold text-indigo-300 mb-6">
          <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Sesión Activa
        </div>

        <h1 class="mb-4 font-display text-4xl leading-tight font-extrabold text-white md:text-5xl">
          ¡Hola de nuevo, 
          <span class="bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
            {{ authStore.user?.fullName?.split(' ')[0] || 'Profesional' }}!
          </span>
        </h1>
        <p class="mb-10 text-base text-slate-300 max-w-xl font-light">
          Tu panel inteligente está listo. Genera un nuevo documento o edita tus currículums guardados.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            class="group relative flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-9 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] hover:-translate-y-0.5 transition-all"
            @click="goToApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            <span>Crear Nuevo CV</span>
          </button>
          <button
            type="button"
            class="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-slate-900/60 px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur-md transition-all hover:bg-slate-800 hover:text-white hover:-translate-y-0.5"
            @click="router.push('/dashboard')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Ver Mis CVs Guardados
          </button>
        </div>
      </section>

      <!-- Sección de Características Principales -->
      <section id="benefits" class="scroll-mt-32 mt-24 grid gap-8 md:grid-cols-3 relative z-10">
        <div class="col-span-full mb-2">
          <p class="text-xs font-bold uppercase tracking-[0.25em] text-indigo-400 mb-2">Características</p>
          <h2 class="font-display text-3xl font-extrabold text-white">¿Por qué usar Craft<span class="text-indigo-400">.AI</span>?</h2>
        </div>

        <article v-reveal 
          class="group rounded-3xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-900/70 hover:-translate-y-1 shadow-lg">
          <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h3 class="mb-2.5 font-display text-xl font-bold text-white">Motor IA Especializado</h3>
          <p class="text-sm leading-relaxed text-slate-400 font-light">
            Estándares internacionales de reclutamiento (<span class="text-indigo-300 font-medium">Harvard, Tech, Europass</span>) optimizados dinámicamente por la IA.
          </p>
        </article>

        <article v-reveal 
          class="group rounded-3xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/50 hover:bg-slate-900/70 hover:-translate-y-1 shadow-lg">
          <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.355r-1.158-1.94A11.026 11.026 0 0012 19.355a11.026 11.026 0 001.158.06L12 21.355z"/></svg>
          </div>
          <h3 class="mb-2.5 font-display text-xl font-bold text-white">Optimización ATS con Fórmula XYZ</h3>
          <p class="text-sm leading-relaxed text-slate-400 font-light">
            Transforma descripciones genéricas en logros medibles utilizando la <span class="text-cyan-300 font-medium">Fórmula XYZ de Google</span>.
          </p>
        </article>

        <article v-reveal 
          class="group rounded-3xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/50 hover:bg-slate-900/70 hover:-translate-y-1 shadow-lg">
          <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h3 class="mb-2.5 font-display text-xl font-bold text-white">Edición & Exportación PDF</h3>
          <p class="text-sm leading-relaxed text-slate-400 font-light">
            Chat en vivo para ajustar secciones en tiempo real y descarga instantánea en <span class="text-purple-300 font-medium">PDF de alta precisión A4</span>.
          </p>
        </article>
      </section> 

      <!-- Sección de Impacto -->
      <section id="impact" v-reveal
        class="scroll-mt-32 mt-20 flex flex-wrap items-center justify-between gap-8 rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-950/40 p-10 shadow-2xl backdrop-blur-2xl">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.25em] text-indigo-400 mb-2">Resultados</p>
          <p class="max-w-md text-xl font-bold leading-relaxed text-white">
            Transformando búsquedas laborales con <span class="text-indigo-300">tecnología de precisión.</span>
          </p>
        </div>
        <div class="text-right">
          <p class="font-display text-5xl md:text-6xl font-black tracking-tight text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text drop-shadow-sm">
            {{ impactCount.toLocaleString('es-ES') }}+
          </p>
          <p class="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">CVs Generados con Éxito</p>
        </div>
      </section>

      <!-- Sección de Perfiles -->
      <section id="personas" class="scroll-mt-32 mt-20 px-2">
        <div class="text-center mb-14">
          <p class="text-xs font-bold uppercase tracking-[0.25em] text-indigo-400 mb-2">Versatilidad</p>
          <h2 class="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Diseñado para cada <span class="bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">perfil profesional</span>
          </h2>
          <p class="text-slate-400 max-w-xl mx-auto text-sm font-light">
            Desde el primer empleo y aplicaciones académicas hasta roles ejecutivos senior.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          
          <div class="group relative rounded-3xl border border-white/10 bg-slate-900/40 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-slate-900/70 hover:border-indigo-500/50 overflow-hidden shadow-lg">
            <div class="text-4xl mb-4">💻</div>
            <h4 class="text-white font-bold text-base mb-2">Tech & Engineering</h4>
            <p class="text-xs text-slate-400 leading-relaxed font-light">Resalta proyectos, frameworks y arquitecturas de software.</p>
          </div>

          <div class="group relative rounded-3xl border border-white/10 bg-slate-900/40 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-slate-900/70 hover:border-purple-500/50 overflow-hidden shadow-lg">
            <div class="text-4xl mb-4">🎨</div>
            <h4 class="text-white font-bold text-base mb-2">Creativos & UX</h4>
            <p class="text-xs text-slate-400 leading-relaxed font-light">Formatos pulidos que destacan enlaces de portafolio y proyectos clave.</p>
          </div>

          <div class="group relative rounded-3xl border border-white/10 bg-slate-900/40 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-slate-900/70 hover:border-cyan-500/50 overflow-hidden shadow-lg">
            <div class="text-4xl mb-4">🎓</div>
            <h4 class="text-white font-bold text-base mb-2">Académico & Becas</h4>
            <p class="text-xs text-slate-400 leading-relaxed font-light">Estructura Europass / Academic optimizada para admisiones internacionales.</p>
          </div>

          <div class="group relative rounded-3xl border border-white/10 bg-slate-900/40 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-slate-900/70 hover:border-emerald-500/50 overflow-hidden shadow-lg">
            <div class="text-4xl mb-4">🚀</div>
            <h4 class="text-white font-bold text-base mb-2">Ejecutivo & Liderazgo</h4>
            <p class="text-xs text-slate-400 leading-relaxed font-light">Formatos estilo Harvard orientados a métricas de negocio y gestión.</p>
          </div>

        </div>
      </section>
      
      <!-- Footer Elegante Pegado al Fondo -->
      <footer class="mt-16 py-6 relative z-10 border-t border-white/10 w-full bg-slate-950/40 backdrop-blur-xl">
        <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div class="flex items-center gap-3">
            <div class="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-[10px] font-black text-white">
              CV
            </div>
            <span class="font-display font-bold text-slate-200 text-xs">Craft<span class="text-indigo-400">.AI</span></span>
            <span class="text-[11px] text-slate-500">© 2026 Craft.AI Inc. Todos los derechos reservados.</span>
          </div>

          <p class="text-[11px] text-slate-400 font-medium">
            Potenciando el futuro profesional con Inteligencia Artificial.
          </p>

          <div class="flex gap-6 text-[11px] font-semibold text-slate-400">
            <a href="#" class="hover:text-indigo-400 transition-colors">Privacidad</a>
            <a href="#" class="hover:text-indigo-400 transition-colors">Términos</a>
            <a href="#" class="hover:text-indigo-400 transition-colors">Contacto</a>
          </div>

        </div>
      </footer>
    </main>
  </div>
</template>

<style scoped>
@keyframes bounceSubtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce-subtle {
  animation: bounceSubtle 3s ease-in-out infinite;
}
</style>
