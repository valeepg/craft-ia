<script setup>
import { ref, computed, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Variables de estado y autenticación
const email = ref('');
const password = ref('');
const fullName = ref('');
const termsAccepted = ref(false);
const authError = ref('');
const authLoading = ref(false);

const impactCount = ref(0);
const impactTarget = 12500;

// Variables de Modales
const showLoginModal = ref(false);
const showRegisterModal = ref(false); // NUEVO
const showUserMenu = ref(false);
const showPassword = ref(false);
const showRegisterPassword = ref(false); // NUEVO

const showGuest = computed(() => !authStore.isLoggedIn);
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

async function signInWith(provider) {
  authError.value = '';
  try {
    await authStore.signInWithOAuth(provider);
    router.push('/generador');
  } catch (e) {
    authError.value = e.message || 'Error con ' + provider;
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
  <div class="ai-guided-cv-flow relative min-h-screen bg-[#000205] text-white font-sans overflow-hidden pb-24">
  
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

    <header class="fixed top-4 inset-x-0 z-50 px-6 transition-all duration-300">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-8 py-4 
                  rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-2xl">
        
        <div class="flex items-center gap-4">
          <span class="font-tech text-3xl font-black text-white">Cv</span>
          <div class="h-6 w-[1px] bg-blue-500/40"></div>
          <div class="flex flex-col">
            <span class="font-display text-xl font-bold text-white">Craft<span class="text-blue-400">.ai</span></span>
            <span class="text-[8px] uppercase tracking-[0.3em] text-white/40">Neo Consulting</span>
          </div>
        </div>
        <nav class="hidden gap-8 items-center text-[11px] font-bold uppercase tracking-widest md:flex">
          <a href="#benefits" class="text-white/60 hover:text-white transition-colors">Beneficios</a>
          <a href="#impact" class="text-white/60 hover:text-white transition-colors">Resultados</a>
          <a href="#personas" class="text-white/60 hover:text-white transition-colors">Perfiles</a>
          <div class="ml-4 flex items-center gap-4 border-l border-white/10 pl-6 relative">
            
            <template v-if="!authStore.isLoggedIn">
              <button 
                @click="showLoginModal = true" 
                class="text-white/80 hover:text-white transition-colors"
              >
                Iniciar Sesión
              </button>
            </template>

            <template v-else>
              <div class="flex items-center gap-4">
                <button 
                  @click="authStore.signOut()" 
                  class="text-[12px] font-medium text-white/50 hover:text-white transition-colors cursor-pointer underline-offset-4 hover:underline"
                >
                  Cerrar sesión
                </button>

                <div class="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-transparent text-sm font-medium text-white transition-all hover:border-white hover:bg-white/5">
                  {{ userInitial || 'U' }}
                </div>
              </div>
            </template>

          </div>
          
        </nav>
        
        <Teleport to="body">
          
          <div v-if="showLoginModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-[#00040f]/80 backdrop-blur-md px-4 transition-all duration-300">
            <div class="w-full max-w-[380px] rounded-3xl border border-white/15 bg-[#0f1526]/90 p-8 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.9)] backdrop-blur-xl relative animate-fade-up">
              
              <button @click="showLoginModal = false; resetForm()" class="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div class="text-center mb-8 mt-2">
                <h2 class="font-display text-2xl font-medium text-white tracking-wide">Acceso</h2>
                <p class="mt-2 text-[13px] text-white/50 font-light">Ingresa a tu cuenta para continuar</p>
              </div>
              
              <div class="space-y-5">
                <div>
                  <label class="block text-[10px] font-medium text-white/50 uppercase tracking-widest mb-1.5 ml-1">Correo Electrónico</label>
                  <input v-model="email" type="email" placeholder="ejemplo@correo.com" class="w-full rounded-xl border border-white/10 bg-[#161d30] px-4 py-3.5 text-sm text-white placeholder-white/30 focus:border-white/40 focus:bg-[#1a233a] focus:ring-0 outline-none transition-all font-light" />
                </div>

                <div>
                  <label class="block text-[10px] font-medium text-white/50 uppercase tracking-widest mb-1.5 ml-1">Contraseña</label>
                  <div class="relative">
                    <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" class="w-full rounded-xl border border-white/10 bg-[#161d30] px-4 py-3.5 pr-12 text-sm text-white placeholder-white/30 focus:border-white/40 focus:bg-[#1a233a] focus:ring-0 outline-none transition-all font-light" @keyup.enter="submitLogin" />
                    <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                      <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                  </div>
                </div>
                
                <p v-if="authError" class="text-xs text-red-400 text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{{ authError }}</p>

                <button type="button" class="w-full rounded-xl bg-white/5 border border-white/20 text-white px-6 py-3.5 text-sm font-medium shadow-lg hover:bg-white/10 hover:border-white/40 hover:scale-[1.02] backdrop-blur-md transition-all active:scale-95 disabled:opacity-50 mt-2" :disabled="authLoading" @click="submitLogin">
                  {{ authLoading ? 'Verificando...' : 'Iniciar Sesión' }}
                </button>
              </div>

              <div class="mt-7 text-center border-t border-white/10 pt-5">
                <p class="text-[12px] text-white/50">
                  ¿No tienes cuenta? 
                  <button @click="showLoginModal = false; resetForm(); showRegisterModal = true" class="text-white hover:text-gray-300 font-medium ml-1 transition-colors underline underline-offset-4 decoration-white/30">Regístrate gratis</button>
                </p>
              </div>
            </div>
          </div>

          <div v-if="showRegisterModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-[#00040f]/80 backdrop-blur-md px-4 transition-all duration-300">
            <div class="w-full max-w-[380px] rounded-3xl border border-white/15 bg-[#0f1526]/90 p-8 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.9)] backdrop-blur-xl relative animate-fade-up">
              
              <button @click="showRegisterModal = false; resetForm()" class="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div class="text-center mb-8 mt-2">
                <h2 class="font-display text-2xl font-medium text-white tracking-wide">Crear Cuenta</h2>
                <p class="mt-2 text-[13px] text-white/50 font-light">Guarda tus CVs y edítalos cuando quieras</p>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-[10px] font-medium text-white/50 uppercase tracking-widest mb-1.5 ml-1">Nombre Completo</label>
                  <input v-model="fullName" type="text" placeholder="Tu nombre" class="w-full rounded-xl border border-white/10 bg-[#161d30] px-4 py-3 text-sm text-white placeholder-white/30 focus:border-white/40 focus:bg-[#1a233a] focus:ring-0 outline-none transition-all font-light" />
                </div>

                <div>
                  <label class="block text-[10px] font-medium text-white/50 uppercase tracking-widest mb-1.5 ml-1">Correo Electrónico</label>
                  <input v-model="email" type="email" placeholder="ejemplo@correo.com" class="w-full rounded-xl border border-white/10 bg-[#161d30] px-4 py-3 text-sm text-white placeholder-white/30 focus:border-white/40 focus:bg-[#1a233a] focus:ring-0 outline-none transition-all font-light" />
                </div>

                <div>
                  <label class="block text-[10px] font-medium text-white/50 uppercase tracking-widest mb-1.5 ml-1">Contraseña</label>
                  <div class="relative">
                    <input v-model="password" :type="showRegisterPassword ? 'text' : 'password'" placeholder="••••••••" class="w-full rounded-xl border border-white/10 bg-[#161d30] px-4 py-3 pr-12 text-sm text-white placeholder-white/30 focus:border-white/40 focus:bg-[#1a233a] focus:ring-0 outline-none transition-all font-light" @keyup.enter="submitModalRegister" />
                    <button type="button" @click="showRegisterPassword = !showRegisterPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                      <svg v-if="showRegisterPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                  </div>
                </div>

                <div class="flex items-center space-x-2">
                  <input v-model="termsAccepted" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                  <label class="text-sm text-white/70">
                    Acepto los <a href="#" class="text-blue-400 hover:text-blue-300 underline">Términos y Condiciones</a>
                  </label>
                </div>
                
                <p v-if="authError" class="text-xs text-red-400 text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{{ authError }}</p>

                <button type="button" class="w-full rounded-xl bg-white/5 border border-white/20 text-white px-6 py-3.5 text-sm font-medium shadow-lg hover:bg-white/10 hover:border-white/40 hover:scale-[1.02] backdrop-blur-md transition-all active:scale-95 disabled:opacity-50 mt-4" :disabled="authLoading" @click="submitModalRegister">
                  {{ authLoading ? 'Creando...' : 'Crear Mi Cuenta' }}
                </button>
              </div>

              <div class="mt-7 text-center border-t border-white/10 pt-5">
                <p class="text-[12px] text-white/50">
                  ¿Ya tienes cuenta? 
                  <button @click="showRegisterModal = false; resetForm(); showLoginModal = true" class="text-white hover:text-gray-300 font-medium ml-1 transition-colors underline underline-offset-4 decoration-white/30">Inicia sesión</button>
                </p>
              </div>
            </div>
          </div>
        </Teleport>
      </div>
    </header>
    <main class="relative z-10 mx-auto max-w-6xl px-6 pb-16 pt-28">
      <section v-if="!authStore.isLoggedIn" class="grid items-center gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        
        <div>
          <h1 class="mb-4 max-w-xl font-display text-4xl leading-tight text-white-900 md:text-5xl">
            Ingeniería de Cvs de alto impacto para
            <span class="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              líderes que evolucionan
            </span>
          </h1>
          <p class="mb-6 max-w-lg text-sm text-white md:text-base">
            Fusionamos IA generativa con arquitectura estratégica ATS. Crea un documento de alto rendimiento que no solo describe tu pasado, sino que proyecta tu valor ante los reclutadores más exigentes.
          </p>
          
          <div class="flex flex-wrap gap-3">
            <button type="button" class="rounded-full bg-gradient-to-r from-neo-cobalt to-slate-900 px-7 py-3 text-sm font-semibold text-white shadow-glow hover:shadow-glow-lg transition-all" @click="goToAppAsGuest">
              Crear CV (invitado)
            </button>
            <button type="button" class="relative overflow-hidden rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/90 backdrop-blur-md transition-all duration-300 hover:border-blue-500/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] active:scale-95" @click="showRegisterModal = true">
              Guardar Cvs
            </button>
          </div>
        </div>

        <div id="cta" class="scroll-mt-32 rounded-3xl border border-white/20 bg-white/[0.03] p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden">
          <div class="relative z-10">
            <h2 class="text-white font-semibold mb-4">Acceso</h2>
            <div class="mb-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-400/20 backdrop-blur-md">
              <div class="flex items-center gap-2 mb-2">
                <span class="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
                <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">Smart Update Active</span>
              </div>
              <p class="text-xs leading-relaxed text-white/90">
                <span class="text-white font-bold text-sm">¿Sabías que como Invitado pierdes tu CV al salir?</span><br/>
                <span class="text-blue-200">Regístrate para guardar versiones ilimitadas y editar cuando quieras.</span>
              </p>
            </div>

            <div class="space-y-4">
              <button type="button" class="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4 text-sm font-black text-white shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:scale-[1.02] transition-all" @click="showRegisterModal = true">
                Crear mi cuenta GRATIS
              </button>
              <div class="flex items-center gap-3">
                <button type="button" class="w-1/2 rounded-2xl border border-white/40 bg-white/5 px-6 py-3 text-xs font-semibold text-white/80 backdrop-blur-sm hover:bg-white/10 hover:text-white transition-all" @click="showLoginModal = true">
                  Iniciar Sesión
                </button>
                <button type="button" class="w-1/2 rounded-2xl border border-white/20 px-6 py-3 text-[11px] font-medium text-white/80 hover:text-white/60 transition-all italic underline-offset-4 hover:underline" @click="goToAppAsGuest">
                  Seguir invitado
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-else class="flex flex-col items-center justify-center text-center py-20">
        
        
        <h1 class="mb-4 font-display text-4xl leading-tight text-white md:text-5xl">
          ¡Bienvenid@ de nuevo, 
          <span class="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            {{ authStore.user?.fullName?.split(' ')[0] || 'Líder' }}!
          </span>
        </h1>
        <p class="mb-10 text-lg text-white/80 max-w-xl">
          Tu espacio de trabajo está listo. ¿Qué te gustaría hacer hoy?
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            class="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 px-8 py-4 text-base font-semibold text-white shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] hover:-translate-y-1 transition-all"
            @click="goToApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Crear Nuevo CV
          </button>
          <button
            type="button"
            class="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-medium text-white/90 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/40 hover:-translate-y-1"
            @click="router.push('/dashboard')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Ver Historial de CVs
          </button>
        </div>
      </section>
      <!-- Beneficios -->
      <section id="benefits" class="scroll-mt-32 mt-20 grid gap-8 md:grid-cols-3 relative z-10">
        <h2 class="col-span-full font-display text-3xl font-bold text-white">¿Por qué elegir Craft<span class="text-blue-400">.ai</span>?</h2>
        <article v-reveal 
          class="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:border-blue-500/50 hover:bg-white/[0.06]">
          <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h3 class="mb-2 font-display text-xl font-bold text-white">Motor IA especializado</h3>
          <p class="text-sm leading-relaxed text-slate-400">
            Cuatro estándares globales (<span class="text-blue-300">Harvard, Tech, Europass</span>) optimizados por Gemini para superar cualquier filtro.
          </p>
        </article>

        <article v-reveal 
          class="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:border-cyan-400/50 hover:bg-white/[0.06]">
          <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.355r-1.158-1.94A11.026 11.026 0 0012 19.355a11.026 11.026 0 001.158.06L12 21.355z"/></svg>
          </div>
          <h3 class="mb-2 font-display text-xl font-bold text-white">Optimizado para ATS</h3>
          <p class="text-sm leading-relaxed text-slate-400">
            Uso de la <span class="text-cyan-300">Fórmula XYZ</span> de Google para asegurar que tu impacto sea legible por humanos y algoritmos.
          </p>
        </article>

        <article v-reveal 
          class="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:border-purple-500/50 hover:bg-white/[0.06]">
          <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h3 class="mb-2 font-display text-xl font-bold text-white">Experiencia Optimizada</h3>
          <p class="text-sm leading-relaxed text-slate-400">
            Edición inteligente en tiempo real. Un panel futurista diseñado para que crear tu CV sea <span class="text-purple-300">un placer, no una carga.</span>
          </p>
        </article>
      </section> 
      <!-- Impacto -->
      <section  id="impact" v-reveal
        class="scroll-mt-32 mt-16 flex flex-wrap items-center justify-between gap-8 rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-3xl">
        <div >
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-blue-400 mb-3">Impacto Real</p>
          <p class="max-w-md text-lg font-medium leading-relaxed text-white">
            Profesionales que han transformado su búsqueda laboral con <span class="italic text-blue-300">tecnología de precisión.</span>
          </p>
        </div>
        <div class="text-right">
          <p class="font-tech text-6xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            {{ impactCount.toLocaleString('es-ES') }}
          </p>
          <p class="mt-2 text-[10px] font-bold uppercase tracking-[0.4em] text-white">Personas Impactadas</p>
        </div>
      </section>
      <!-- Personas -->
      <section id="personas" class="scroll-mt-32 mt-16 px-6">
        <div class="text-center mb-16">
          <h2 class="font-display text-4xl font-bold text-white mb-4">
            Para cada <span class="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent italic">ambición</span>
          </h2>
          <p class="text-white/60 max-w-2xl mx-auto text-sm leading-relaxed">
            No importa tu camino, todos necesitamos una carta de presentación impecable. 
            Desde el primer paso hasta el puesto directivo.
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          
          <div class="group relative rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.05] hover:border-blue-500/50 overflow-hidden">
            <div class="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">💻</div>
            <h4 class="text-white font-bold mb-2">Tech & Engineering</h4>
            <p class="text-xs text-white/40 leading-relaxed">Optimizado para resaltar stacks técnicos y lógica de impacto.</p>
          </div>

          <div class="group relative rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.05] hover:border-purple-500/50 overflow-hidden">
            <div class="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">🎨</div>
            <h4 class="text-white font-bold mb-2">Diseñadores</h4>
            <p class="text-xs text-white/40 leading-relaxed">Formatos limpios que dejan que tu portafolio sea el protagonista.</p>
          </div>

          <div class="group relative rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.05] hover:border-cyan-500/50 overflow-hidden">
            <div class="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">🎓</div>
            <h4 class="text-white font-bold mb-2">Postulantes a Becas</h4>
            <p class="text-xs text-white/40 leading-relaxed">Estructura académica perfecta para universidades de élite.</p>
          </div>

          <div class="group relative rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.05] hover:border-red-400/50 overflow-hidden">
            <div class="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">🏠</div>
            <h4 class="text-white font-bold mb-2">Retorno Laboral</h4>
            <p class="text-xs text-white/40 leading-relaxed">Convierte tus años de gestión y liderazgo familiar en valor profesional.</p>
          </div>

        </div>

        <div class="mt-16 text-center">
          <p class="text-xl font-medium text-white/80 italic">
            "Porque al final del día, <span class="text-white font-bold border-b-2 border-blue-500/50">todos merecemos</span> una oportunidad única."
          </p>
        </div>
      </section>
      
      
    <footer class="mt-32 pb-8 relative z-10 border-t border-white/10 pt-8">
        <div class="container mx-auto px-6">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div class="flex items-center gap-4">
              <span class="font-tech text-xl font-black text-white/80">CV</span>
              <div class="h-4 w-[1px] bg-white/20 hidden md:block"></div>
              <p class="text-[10px] uppercase tracking-widest text-white/60">
                © 2026 Craft.ai <span class="mx-2 hidden md:inline">|</span> 
                <span class="text-white/40">Neo Consulting</span>
              </p>
            </div>

            <p class="text-[11px] text-white/60 font-medium">
              El CV perfecto para una oportunidad única, creado con 
              <span class="text-red-500/60 animate-pulse mx-1">❤</span> 
              para ti.
            </p>

            <div class="flex gap-6 text-[10px] font-bold uppercase tracking-[0.15em] text-white/60">
              <a href="#" class="hover:text-blue-400 transition-colors">Privacidad</a>
              <a href="#" class="hover:text-blue-400 transition-colors">Términos</a>
              <a href="#" class="hover:text-blue-400 transition-colors">Soporte</a>
            </div>

          </div>
        </div>
      </footer>
    </main>
    
  
  </div>
  
</template>
