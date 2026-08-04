<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const fullName = ref('');
const termsAccepted = ref(false);
const authError = ref('');
const authLoading = ref(false);

const showPassword = ref(false);
const showRegisterPassword = ref(false);

function resetForm() {
  email.value = '';
  password.value = '';
  fullName.value = '';
  termsAccepted.value = false;
  authError.value = '';
}

async function submitLogin() {
  authError.value = '';
  authLoading.value = true;
  try {
    await authStore.signInWithEmail(email.value, password.value);
    authStore.showLoginModal = false;
  } catch (e) {
    authError.value = e.message || 'Error al iniciar sesión';
  } finally {
    authLoading.value = false;
  }
}

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
      acceptTerms: termsAccepted.value
    });
    authStore.showRegisterModal = false;
  } catch (e) {
    authError.value = e.message || 'Error al registrarse';
  } finally {
    authLoading.value = false;
  }
}
</script>

<template>
  <Teleport to="body">
    <!-- Modal Iniciar Sesión -->
    <div v-if="authStore.showLoginModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617]/80 backdrop-blur-md px-4 transition-all duration-300">
      <div class="w-full max-w-[400px] rounded-3xl border border-white/15 bg-slate-900/90 p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] backdrop-blur-2xl relative animate-fade-up">
        
        <button @click="authStore.showLoginModal = false; resetForm()" class="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div class="text-center mb-8 mt-2">
          <h2 class="font-display text-2xl font-bold text-white tracking-tight">Bienvenido de nuevo</h2>
          <p class="mt-2 text-[13px] text-slate-400">Ingresa a tu cuenta para gestionar tus CVs</p>
        </div>
        
        <div class="space-y-5">
          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Correo Electrónico</label>
            <input v-model="email" type="email" placeholder="ejemplo@correo.com" class="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Contraseña</label>
            <div class="relative">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" class="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3.5 pr-12 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" @keyup.enter="submitLogin" />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
            </div>
          </div>
          
          <p v-if="authError" class="text-xs text-red-400 text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{{ authError }}</p>

          <button type="button" class="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3.5 text-sm font-bold shadow-lg hover:from-indigo-500 hover:to-blue-500 hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all" :disabled="authLoading" @click="submitLogin">
            {{ authLoading ? 'Verificando...' : 'Iniciar Sesión' }}
          </button>
        </div>

        <div class="mt-7 text-center border-t border-white/10 pt-5">
          <p class="text-[12px] text-slate-400">
            ¿No tienes cuenta? 
            <button @click="authStore.showLoginModal = false; resetForm(); authStore.showRegisterModal = true" class="text-indigo-400 hover:text-indigo-300 font-bold ml-1 transition-colors underline underline-offset-4">Regístrate gratis</button>
          </p>
        </div>
      </div>
    </div>

    <!-- Modal Registro -->
    <div v-if="authStore.showRegisterModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617]/80 backdrop-blur-md px-4 transition-all duration-300">
      <div class="w-full max-w-[400px] rounded-3xl border border-white/15 bg-slate-900/90 p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] backdrop-blur-2xl relative animate-fade-up">
        
        <button @click="authStore.showRegisterModal = false; resetForm()" class="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div class="text-center mb-8 mt-2">
          <h2 class="font-display text-2xl font-bold text-white tracking-tight">Crear Cuenta Gratis</h2>
          <p class="mt-2 text-[13px] text-slate-400">Guarda tus versiones de CV e historial en la nube</p>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nombre Completo</label>
            <input v-model="fullName" type="text" placeholder="Tu nombre" class="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Correo Electrónico</label>
            <input v-model="email" type="email" placeholder="ejemplo@correo.com" class="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Contraseña</label>
            <div class="relative">
              <input v-model="password" :type="showRegisterPassword ? 'text' : 'password'" placeholder="••••••••" class="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 pr-12 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" @keyup.enter="submitModalRegister" />
              <button type="button" @click="showRegisterPassword = !showRegisterPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                <svg v-if="showRegisterPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
            </div>
          </div>

          <div class="flex items-center space-x-2 pt-1">
            <input v-model="termsAccepted" type="checkbox" class="w-4 h-4 text-indigo-600 bg-slate-900 border-slate-700 rounded focus:ring-indigo-500" />
            <label class="text-xs text-slate-300">
              Acepto los <a href="#" class="text-indigo-400 hover:text-indigo-300 underline">Términos y Condiciones</a>
            </label>
          </div>
          
          <p v-if="authError" class="text-xs text-red-400 text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{{ authError }}</p>

          <button type="button" class="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3.5 text-sm font-bold shadow-lg hover:from-indigo-500 hover:to-blue-500 hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all mt-2" :disabled="authLoading" @click="submitModalRegister">
            {{ authLoading ? 'Creando cuenta...' : 'Crear Mi Cuenta' }}
          </button>
        </div>

        <div class="mt-7 text-center border-t border-white/10 pt-5">
          <p class="text-[12px] text-slate-400">
            ¿Ya tienes cuenta? 
            <button @click="authStore.showRegisterModal = false; resetForm(); authStore.showLoginModal = true" class="text-indigo-400 hover:text-indigo-300 font-bold ml-1 transition-colors underline underline-offset-4">Inicia sesión</button>
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>
