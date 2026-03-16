import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabase';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const termsAccepted = ref(false);

  const isLoggedIn = computed(() => !!user.value);

  async function init() {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    user.value = session?.user ?? null;
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null;
    });
  }

  async function signUpWithEmail(email, password, options = {}) {
    if (!supabase) throw new Error('Supabase no configurado');
    if (!options.acceptTerms) throw new Error('Debes aceptar los Términos y Condiciones');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: options.fullName } },
    });
    if (error) throw error;
    return data;
  }

  async function signInWithEmail(email, password) {
    if (!supabase) throw new Error('Supabase no configurado');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signInWithOAuth(provider) {
    if (!supabase) throw new Error('Supabase no configurado');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider === 'google' ? 'google' : provider === 'github' ? 'github' : 'google',
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    user.value = null;
  }

  return {
    user,
    termsAccepted,
    isLoggedIn,
    init,
    signUpWithEmail,
    signInWithEmail,
    signInWithOAuth,
    signOut,
  };
});
