<script setup>
import { computed, ref } from 'vue';
import { useCvStore } from '@/stores/cv';

const store = useCvStore();
const props = defineProps({
  structure: { type: Array, required: true },
  fontSizeBase: { type: Number, default: 11 },
  marginValue: { type: Number, default: 20 } // Margen en mm
});

// 1. MEJORA: Tamaño de letra reactivo
const fontSize = computed(() => props.fontSizeBase);

const dynamicStyles = computed(() => {
  return {
    '--cv-primary-color': store.customColor || '#1a1a1a',
    '--dynamic-size': fontSize.value + 'pt',
    '--name-size': (fontSize.value + 12) + 'pt',
    '--section-size': (fontSize.value + 2) + 'pt',
    '--margin': props.marginValue + 'mm'
  };
});

// Funciones de control - ahora se manejan en el padre
// const increaseSize = () => { if(fontSizeBase.value < 18) fontSizeBase.value++ };
// const decreaseSize = () => { if(fontSizeBase.value > 8) fontSizeBase.value-- };

const updateName = (e) => {
  if (!store.content.personalInfo) store.content.personalInfo = {};
  store.content.personalInfo.fullName = e.target.innerText;
};

const handleBlur = (sectionId, e) => {
  store.content[sectionId] = e.target.innerHTML;
};
</script>

<template>
  <div class="cv-main-container">
    <div 
      id="cv-printable-area" 
      class="cv-paper"
      :style="dynamicStyles"
      spellcheck="false"
    >
      <header class="cv-header">
        <h1 
          :contenteditable="store.currentStep === 5"
          class="cv-name"
          @blur="updateName"
        >
          {{ store.content?.personalInfo?.fullName || 'TU NOMBRE AQUÍ' }}
        </h1>
        <div class="cv-contact" :contenteditable="store.currentStep === 5">
          <div v-if="store.content?.personalInfo?.email || store.content?.personalInfo?.phone">
            {{ store.content?.personalInfo?.email }} | {{ store.content?.personalInfo?.phone }}
          </div>
          <div v-if="store.content?.personalInfo?.links" class="cv-links">
            <span v-if="store.content.personalInfo.links.github">{{ store.content.personalInfo.links.github }}</span>
            <span v-if="store.content.personalInfo.links.linkedin">{{ store.content.personalInfo.links.linkedin }}</span>
            <span v-if="store.content.personalInfo.links.portfolio">{{ store.content.personalInfo.links.portfolio }}</span>
            <span v-if="store.content.personalInfo.links.website">{{ store.content.personalInfo.links.website }}</span>
          </div>
        </div>
      </header>

      <main class="cv-content">
        <div v-for="sec in structure" :key="sec.id" class="cv-section">
          <h2 
            class="cv-section-title"
            :contenteditable="store.currentStep === 5"
          >
            {{ sec.label }}
          </h2>
          <div 
            :contenteditable="store.currentStep === 5"
            class="cv-section-text" 
            v-html="store.content[sec.id]"
            @blur="handleBlur(sec.id, $event)"
          ></div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor principal: Aquí es donde se ve el fondo azul de tu app */
.cv-main-container {
  width: 100%;
  display: flex;         /* Flex es mucho más estable para impresión */
  justify-content: center; 
  background: transparent;
  padding: 0;
}

/* LA HOJA ÚNICA: Sin dobles fondos ni sombras internas */
.cv-paper {
  background: white;
  width: 210mm;
  min-height: 297mm;
  padding: var(--margin); /* Margen dinámico */
  margin: 0 auto;       /* Esto garantiza el centrado */
  box-sizing: border-box;
}

/* Tipografía Reactiva */
.cv-name {
  font-size: var(--name-size);
  font-weight: 800;
  text-align: center; /* Cambiado de center a left */
  margin-bottom: 0.2em;
  color: var(--cv-primary-color);
  outline: none;
}

.cv-contact {
  font-size: calc(var(--dynamic-size) - 2pt);
  text-align: center;
  margin-bottom: 2rem;
  color: #555;
  outline: none;
}

.cv-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.cv-section-title {
  font-size: var(--section-size);
  font-weight: 700;
  text-transform: uppercase;
  /* border-bottom: 2px solid var(--cv-primary-color); */ /* Removido para permitir edición completa */
  text-align: left; /* Títulos a la izquierda */
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--cv-primary-color);
  outline: none;
}

.cv-section-text {
  font-size: calc(var(--dynamic-size) - 4pt); /* Aún más pequeño */
  text-align: left; /* Texto a la izquierda */
  line-height: 1.5;
  font-weight: bold; /* Negrita */
  color: #333; /* Color visible */
  outline: none;
}

/* Feedback visual de edición sutil */
[contenteditable="true"]:focus {
  background: rgba(16, 185, 129, 0.03);
  box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.1);
}

</style>