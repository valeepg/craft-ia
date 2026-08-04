<template>
  <div class="w-full px-2 sm:px-4 pt-0 pb-2 text-left space-y-4">
    
    <!-- Encabezado del Paso 2 -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-2">
      <div>
        <span class="text-indigo-400 text-xs font-bold uppercase tracking-widest block mb-0.5">Estándares Internacionales</span>
        <h2 class="text-2xl font-extrabold text-white tracking-tight">
          Paso 2: Selecciona el Estándar de tu CV
        </h2>
        <p class="text-xs text-slate-400 font-light mt-0.5">Escoge la plantilla internacional que mejor se adapte a tu meta profesional.</p>
      </div>

      <div class="flex items-center gap-3">
        <span v-if="selectedType" class="text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          Estándar Activo: <span class="capitalize font-bold text-white">{{ selectedType }}</span>
        </span>
      </div>
    </header>

    <!-- Selector Horizontal Compacto de Baja Altura (4 Pestañas) -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <button
        v-for="(data, key) in CV_STANDARDS"
        :key="key"
        type="button"
        @click="setSelectedType(key)"
        :class="[
          'py-3 px-4 rounded-2xl border transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer backdrop-blur-xl',
          selectedType === key
            ? 'border-indigo-500 bg-gradient-to-r from-indigo-900/80 to-slate-900 shadow-[0_4px_15px_rgba(99,102,241,0.3)] scale-[1.02] text-white' 
            : 'border-white/10 bg-slate-900/50 hover:border-indigo-500/40 hover:bg-slate-900/80 text-slate-300'
        ]"
      >
        <span class="text-base flex-shrink-0">
          <span v-if="key === 'harvard'">🎓</span>
          <span v-else-if="key === 'tech'">💻</span>
          <span v-else-if="key === 'creativo'">🎨</span>
          <span v-else-if="key === 'europass'">🌍</span>
        </span>
        <span class="font-bold text-xs truncate">{{ data.title }}</span>
        <span v-if="selectedType === key" class="text-indigo-400 font-bold text-xs ml-auto">✓</span>
      </button>
    </div>

    <!-- Panel de Especificaciones Técnicas Ubicado DEBAJO del Selector -->
    <div v-if="selectedType" 
      class="bg-slate-950/70 rounded-3xl backdrop-blur-2xl border border-white/15 shadow-2xl overflow-hidden flex flex-col h-[380px] transition-all duration-300"
    >
      <!-- Header del Detalle -->
      <div class="bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-slate-950 px-6 py-3.5 text-white border-b border-white/10 flex justify-between items-center gap-4 flex-shrink-0">
        <div>
          <span class="text-indigo-400 text-[9px] font-bold uppercase tracking-[0.2em] block">Especificaciones Técnicas del Estándar</span>
          <h3 class="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>{{ CV_STANDARDS[selectedType].title }}</span>
            <span class="text-xs font-normal text-slate-400">({{ CV_STANDARDS[selectedType].subtitle }})</span>
          </h3>
        </div>
        <div class="bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 rounded-xl hidden sm:block">
          <span class="text-[8.5px] text-slate-400 uppercase tracking-widest block">Aprobación ATS</span>
          <span class="text-indigo-300 text-xs font-bold">100% Verificado</span>
        </div>
      </div>

      <!-- Cuerpo del Detalle con Scroll Sutil Elegante DEBAJO del Selector -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-y-auto custom-scrollbar-mini text-left">
        
        <!-- Reglas de Formato -->
        <div class="space-y-3">
          <h4 class="text-indigo-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-1.5">
            📐 Reglas de Formato
          </h4>
          <ul class="space-y-2.5">
            <li v-for="(value, spec) in CV_STANDARDS[selectedType].specs" :key="spec" class="flex flex-col gap-0.5">
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                {{ spec === 'maxPages' ? 'Páginas Máximas' : spec === 'fontSize' ? 'Tipografía & Tamaño' : spec === 'photo' ? 'Foto de Perfil' : spec === 'requiredLinks' ? 'Enlaces Requeridos' : 'Márgenes' }}
              </span>
              <span class="text-slate-200 font-medium text-xs leading-relaxed">
                {{ Array.isArray(value) ? value.join(' • ') : value }}
              </span>
            </li>
          </ul>
        </div>

        <!-- Atributos Clave -->
        <div class="space-y-3">
          <h4 class="text-indigo-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-1.5">
            ✨ Atributos Clave
          </h4>
          <div class="space-y-2">
            <div v-for="(feature, index) in CV_STANDARDS[selectedType].features" :key="index" 
              class="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10 text-xs text-slate-300 font-light leading-relaxed">
              <span class="text-indigo-400 font-bold text-[10px]">0{{index + 1}}</span>
              <span>{{ feature }}</span>
            </div>
          </div>
        </div>

        <!-- Orden Estructural de Secciones Homogenizado -->
        <div class="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
          <h4 class="text-indigo-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-1.5">
            🗂️ Orden de Secciones
          </h4>
          <div class="space-y-2 relative flex-1">
            <div v-for="(sec, i) in CV_STANDARDS[selectedType].structure" 
              :key="sec.id" 
              class="flex items-center gap-2 py-0.5 text-xs">
              <span class="w-5 h-5 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                {{ i + 1 }}
              </span>
              <span class="font-medium text-slate-200 text-xs truncate">
                {{ sec.label }}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { CV_STANDARDS } from '@/constants/cvStandards';

const props = defineProps({
  modelValue: String
});

const emit = defineEmits(['update:modelValue', 'select']);

const selectedType = ref(props.modelValue || 'harvard');

watch(() => props.modelValue, (newVal) => {
  if (newVal) selectedType.value = newVal;
});

function setSelectedType(type) {
  selectedType.value = type;
  emit('update:modelValue', type);
  emit('select', type);
}
</script>

<style scoped>
.custom-scrollbar-mini::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.custom-scrollbar-mini::-webkit-scrollbar-track {
  background: transparent !important;
}
.custom-scrollbar-mini::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3) !important;
  border-radius: 9999px;
}
.custom-scrollbar-mini::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.6) !important;
}
</style>