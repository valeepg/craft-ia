<template>
  <div class="w-full px-6 pt-0 pb-8">
    
    <header class="mb-2 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="text-left">
        <h2 class="text-3xl font-bold text-white tracking-tight">
          Paso 2: <span class="text-white">Configura tu perfil</span>
        </h2>
        <p class="text-sm text-white/50 font-light mt-0">Selecciona el estándar que mejor se adapte a tu objetivo profesional</p>
      </div>

      <div class="flex flex-col items-end">
        <p :class="['text-[9px] uppercase tracking-[0.3em] mb-1 transition-colors duration-500', 
                    selectedType ? 'text-cyan-400 animate-pulse font-bold' : 'text-white/20']">
          {{ selectedType ? 'Listo para continuar' : 'Paso obligatorio' }}
        </p>
        
        <button
          @click="selectedType && $emit('select', selectedType)"
          :disabled="!selectedType"
          :class="[
            'relative overflow-hidden px-10 py-4 rounded-2xl border transition-all duration-700 group',
            selectedType 
              ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_rgba(34,211,238,0.2)] scale-100 opacity-100 cursor-pointer' 
              : 'border-white/10 bg-white/5 opacity-40 cursor-not-allowed scale-95'
          ]"
        >
          <div v-if="selectedType" class="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          
          <div class="flex items-center gap-3 relative z-10">
            <span :class="['text-xs font-black uppercase tracking-[0.2em] transition-colors', 
                          selectedType ? 'text-cyan-300' : 'text-white/40']">
              Confirmar Configuración
            </span>
            <span :class="['transition-transform duration-300', 
                          selectedType ? 'text-cyan-400 group-hover:translate-x-1' : 'text-white/20']">→</span>
          </div>
        </button>
      </div>
    </header>
    <br>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <button
            v-for="(data, key) in CV_STANDARDS"
            :key="key"
            @click="setSelectedType(key)"
            :class="[
            'px-6 py-6 rounded-2xl border transition-all duration-500 text-left flex flex-col h-full backdrop-blur-md',
            selectedType === key
                ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.1)] scale-[1.02]' 
                : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
            ]"
        >
            <div :class="['w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-2xl transition-all duration-500', 
                        selectedType === key ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'bg-white/5 text-white/20']">
              <span v-if="key === 'harvard'">🎓</span>
              <span v-else-if="key === 'tech'">💻</span>
              <span v-else-if="key === 'creativo'">🎨</span>
              <span v-else-if="key === 'europass'">🌍</span>
            </div>

            <h3 :class="['font-bold text-lg leading-tight mb-2 transition-colors', selectedType === key ? 'text-white' : 'text-white/40']">
              {{ data.title }}
            </h3>
            <p class="text-xs text-white/30 font-light leading-relaxed flex-grow">{{ data.subtitle }}</p>

            <div v-if="selectedType === key" class="mt-4 text-cyan-400 font-bold text-xl animate-in zoom-in duration-300">✓</div>
        </button>
    </div>

    <div v-if="selectedType" 
         class="animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#0a1221]/40 rounded-[2.5rem] backdrop-blur-2xl border border-cyan-400/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        
        <div class="bg-white/[0.02] p-10 text-white border-b border-white/[0.05]">
            <div class="flex flex-col md:flex-row justify-between items-end gap-6">
              <div class="max-w-2xl text-left">
                  <span class="text-cyan-400 text-[9px] font-black uppercase tracking-[0.3em] mb-4 block">Análisis de Estructura</span>
                  <h2 class="text-5xl font-light tracking-tight mt-2 mb-4 text-white">
                    {{ CV_STANDARDS[selectedType].title.split('/')[0] }}
                    <span class="text-cyan-400/40 font-thin">/</span> 
                    <span class="text-white/60">{{ CV_STANDARDS[selectedType].title.split('/')[1] || '' }}</span>
                  </h2>
                  <p class="text-white/40 text-sm font-light max-w-md leading-relaxed">{{ CV_STANDARDS[selectedType].subtitle }}</p>
              </div>
              <div class="bg-white/[0.03] border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">
                  <span class="text-[10px] text-white/30 uppercase tracking-widest block mb-1 text-left">Ideal para</span>
                  <span class="text-cyan-300/80 text-xs font-medium">{{ CV_STANDARDS[selectedType].useCase }}</span>
              </div>
            </div>
        </div>

        <div class="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div class="space-y-8">
              <h4 class="text-white/90 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                  <span class="w-8 h-[1px] bg-cyan-400/50"></span> Reglas de diseño
              </h4>
              <ul class="space-y-6">
                  <li v-for="(value, spec) in CV_STANDARDS[selectedType].specs" :key="spec" class="flex flex-col gap-1">
                    <span class="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                        {{ spec === 'maxPages' ? 'Páginas Máx.' : spec === 'fontSize' ? 'Tamaño Fuente' : spec === 'photo' ? '¿Foto?' : spec === 'requiredLinks' ? 'Links' : 'Estructura' }}
                    </span>
                    <span class="text-white/80 font-medium text-sm tracking-wide">
                        {{ Array.isArray(value) ? value.join(' • ') : value }}
                    </span>
                  </li>
              </ul>
            </div>

            <div class="space-y-8">
              <h4 class="text-white/90 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                  <span class="w-8 h-[1px] bg-cyan-400/50"></span> Atributos clave
              </h4>
              <div class="grid gap-4">
                  <div v-for="(feature, index) in CV_STANDARDS[selectedType].features" :key="index" 
                      class="flex gap-4 bg-white/[0.03] p-5 rounded-2xl border border-white/[0.05] transition-all hover:border-cyan-400/30">
                    <span class="text-cyan-400 font-bold text-sm">0{{index + 1}}</span>
                    <p class="text-xs text-white/50 leading-relaxed">{{ feature }}</p>
                  </div>
              </div>
            </div>

            <div class="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/[0.05]">
                <h4 class="text-cyan-400/80 font-bold mb-8 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> Orden lógico
                </h4>
                <div class="space-y-4 relative">
                    <div class="absolute left-3 top-2 bottom-2 w-[1px] bg-gradient-to-b from-cyan-400/30 via-cyan-400/10 to-transparent"></div>
                    <div v-for="(item, i) in CV_STANDARDS[selectedType].specs.order.split(' > ')" 
                        :key="i" 
                        class="group flex items-center gap-5 py-1 relative">
                        <span class="w-6 h-6 rounded-lg bg-slate-950 border border-white/10 text-white/40 text-[9px] flex items-center justify-center font-bold z-10 transition-all group-hover:border-cyan-400/50 group-hover:text-cyan-400">
                        {{ i + 1 }}
                        </span>
                        <span class="text-[11px] font-medium text-white/40 group-hover:text-white transition-colors uppercase tracking-wider">
                        {{ item }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { CV_STANDARDS } from '@/constants/cvStandards';

const selectedType = ref(null);

function setSelectedType(type) {
  selectedType.value = type;
}

defineEmits(['select']);
</script>

<style scoped>
.animate-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>