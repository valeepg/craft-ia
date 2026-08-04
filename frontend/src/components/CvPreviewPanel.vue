<template>
  <div class="cv-main-container w-full flex justify-center bg-transparent py-4">
    <div 
      id="cv-printable-area" 
      class="cv-paper bg-white text-slate-900 shadow-2xl relative transition-all duration-300 text-left"
      :class="['standard-' + currentTypeKey]"
      :style="dynamicStyles"
      spellcheck="false"
    >
      <!-- Encabezado del CV -->
      <header class="cv-header mb-6 pb-4 border-b-2 border-slate-900/10 flex justify-between items-start text-left">
        
        <div class="flex-1 text-left">
          <h1 
            :contenteditable="isEditable"
            class="cv-name text-3xl font-extrabold uppercase tracking-tight text-[var(--cv-primary-color)] text-left outline-none hover:bg-indigo-500/5 focus:bg-indigo-500/10 rounded px-1 transition-colors"
            @blur="updateField('personalInfo', 'fullName', $event)"
          >
            {{ personal.fullName || 'TU NOMBRE COMPLETO' }}
          </h1>

          <p 
            :contenteditable="isEditable"
            class="cv-title text-sm font-bold text-slate-700 mt-1 uppercase tracking-wide text-left outline-none hover:bg-indigo-500/5 focus:bg-indigo-500/10 rounded px-1 transition-colors"
            @blur="updateField('personalInfo', 'title', $event)"
          >
            {{ personal.title || store.targetJob || 'Puesto Objetivo' }}
          </p>

          <!-- Contacto & Enlaces Filtrados por Estándar -->
          <div class="cv-contact flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-medium mt-2 text-left">
            <span 
              :contenteditable="isEditable"
              @blur="updateField('personalInfo', 'email', $event)"
              class="outline-none hover:bg-indigo-500/5 px-1 rounded text-left"
            >{{ personal.email || 'correo@ejemplo.com' }}</span>
            <span class="text-slate-400">•</span>
            <span 
              :contenteditable="isEditable"
              @blur="updateField('personalInfo', 'phone', $event)"
              class="outline-none hover:bg-indigo-500/5 px-1 rounded text-left"
            >{{ personal.phone || '+51 987 654 321' }}</span>
            <span v-if="personal.city" class="text-slate-400">•</span>
            <span 
              v-if="personal.city"
              :contenteditable="isEditable"
              @blur="updateField('personalInfo', 'city', $event)"
              class="outline-none hover:bg-indigo-500/5 px-1 rounded text-left"
            >{{ personal.city }}</span>
            <span v-if="currentTypeKey === 'europass' && personal.skype" class="text-slate-400">• Skype: {{ personal.skype }}</span>
            
            <!-- Enlaces Directos según Estándar -->
            <div v-if="personal.links" class="w-full flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold text-indigo-700 mt-1 text-left">
              <template v-if="currentTypeKey === 'harvard'">
                <span v-if="personal.links.linkedin">LinkedIn: {{ personal.links.linkedin }}</span>
              </template>

              <template v-else-if="currentTypeKey === 'tech'">
                <span v-if="personal.links.github">GitHub: {{ personal.links.github }}</span>
                <span v-if="personal.links.linkedin">LinkedIn: {{ personal.links.linkedin }}</span>
                <span v-if="personal.links.portfolio">Portafolio: {{ personal.links.portfolio }}</span>
              </template>

              <template v-else-if="currentTypeKey === 'creativo'">
                <span v-if="personal.links.behance">Behance: {{ personal.links.behance }}</span>
                <span v-if="personal.links.dribbble">Dribbble: {{ personal.links.dribbble }}</span>
                <span v-if="personal.links.figma">Figma: {{ personal.links.figma }}</span>
                <span v-if="personal.links.website">Web: {{ personal.links.website }}</span>
              </template>

              <template v-else-if="currentTypeKey === 'europass'">
                <span v-if="personal.links.linkedin">LinkedIn: {{ personal.links.linkedin }}</span>
                <span v-if="personal.links.website">Web/ORCID: {{ personal.links.website }}</span>
              </template>
            </div>
          </div>
        </div>

        <!-- Foto Oficial (Solo Europass o Creativo) -->
        <div v-if="(currentTypeKey === 'europass' || currentTypeKey === 'creativo') && (personal.photo || isEditable)" class="ml-4 flex-shrink-0">
          <div class="w-24 h-28 border border-slate-300 bg-slate-100 rounded flex items-center justify-center text-[10px] text-slate-400 overflow-hidden shadow-sm">
            <img v-if="personal.photo" :src="personal.photo" alt="Foto de perfil" class="w-full h-full object-cover" />
            <span v-else class="text-center p-1">Foto Oficial {{ currentTypeKey === 'europass' ? 'Europass' : 'Perfil' }}</span>
          </div>
        </div>

      </header>

      <!-- Cuerpo del CV Organizado con Alineación Limpia e Interlineado 1.4 -->
      <main class="cv-body space-y-5 text-left">
        <div 
          v-for="sec in structure" 
          :key="sec.id" 
          class="cv-section transition-all duration-500 rounded-xl relative p-1.5 text-left"
          :class="[
            highlightSection === sec.id 
              ? 'ring-2 ring-indigo-500/80 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.25)]' 
              : ''
          ]"
        >
          <!-- Badge de Destello "Recién actualizado por IA" -->
          <span 
            v-if="highlightSection === sec.id" 
            class="absolute -top-3 right-2 text-[9px] font-bold text-indigo-700 bg-indigo-100 border border-indigo-300 px-2.5 py-0.5 rounded-full shadow-sm animate-bounce z-20"
          >
            ✨ Recién actualizado por IA
          </span>

          <!-- Título de Sección -->
          <h2 
            :contenteditable="isEditable"
            class="cv-section-title text-[11pt] font-bold uppercase tracking-widest text-[var(--cv-primary-color)] pb-1 border-b border-slate-300 mb-3 outline-none hover:bg-indigo-500/5 focus:bg-indigo-500/10 rounded px-1 transition-colors text-left"
            @blur="updateSectionTitle(sec.id, $event)"
          >
            {{ sec.label }}
          </h2>

          <!-- Seccion: Resumen Ejecutivo -->
          <div v-if="sec.id === 'summary' && contentData.summary" class="text-xs leading-[1.4] text-slate-800 font-light text-left">
            <p 
              :contenteditable="isEditable"
              @blur="updateField(null, 'summary', $event)"
              class="outline-none hover:bg-indigo-500/5 focus:bg-indigo-500/10 rounded p-1 transition-colors text-left"
            >
              {{ contentData.summary }}
            </p>
          </div>

          <!-- Seccion: Experiencia / Trayectoria -->
          <div v-else-if="(sec.id === 'experience' || sec.id === 'trayectoria') && Array.isArray(contentData.experience)" class="space-y-4 text-left">
            <div 
              v-for="(exp, i) in contentData.experience" 
              :key="i"
              class="cv-exp-item text-left mb-3"
            >
              <div class="flex justify-between items-baseline mb-1 text-left">
                <h3 
                  :contenteditable="isEditable"
                  @blur="updateArrayItem('experience', i, 'title', $event)"
                  class="font-bold text-xs text-slate-900 outline-none hover:bg-indigo-500/5 rounded px-1 text-left"
                >
                  {{ exp.title || exp.role }}
                </h3>
                <span 
                  :contenteditable="isEditable"
                  @blur="updateArrayItem('experience', i, 'dates', $event)"
                  class="text-[11px] font-semibold text-slate-600 outline-none hover:bg-indigo-500/5 rounded px-1"
                >
                  {{ exp.startDate ? `${exp.startDate} - ${exp.endDate || 'Presente'}` : (exp.dates || '') }}
                </span>
              </div>

              <div class="flex justify-between items-baseline text-[11px] text-slate-700 font-medium italic mb-1.5 text-left">
                <span 
                  :contenteditable="isEditable"
                  @blur="updateArrayItem('experience', i, 'company', $event)"
                  class="outline-none hover:bg-indigo-500/5 rounded px-1 text-left"
                >
                  {{ exp.company }}
                </span>
                <span 
                  v-if="exp.location"
                  :contenteditable="isEditable"
                  @blur="updateArrayItem('experience', i, 'location', $event)"
                  class="outline-none hover:bg-indigo-500/5 rounded px-1 text-slate-500"
                >
                  {{ exp.location }}
                </span>
              </div>

              <!-- Viñetas de Logros con Fórmula XYZ de Google e Interlineado 1.4 -->
              <ul v-if="Array.isArray(exp.description) || typeof exp.description === 'string'" class="list-disc list-inside space-y-1.5 text-xs text-slate-800 leading-[1.4] pl-1 text-left">
                <template v-if="Array.isArray(exp.description)">
                  <li 
                    v-for="(bullet, bIdx) in exp.description" 
                    :key="bIdx"
                    :contenteditable="isEditable"
                    @blur="updateBulletItem('experience', i, bIdx, $event)"
                    class="outline-none hover:bg-indigo-500/5 focus:bg-indigo-500/10 rounded px-1 transition-colors text-left mb-1.5"
                  >
                    {{ bullet }}
                  </li>
                </template>
                <template v-else>
                  <li 
                    :contenteditable="isEditable"
                    @blur="updateArrayItem('experience', i, 'description', $event)"
                    class="outline-none hover:bg-indigo-500/5 focus:bg-indigo-500/10 rounded px-1 transition-colors text-left mb-1.5"
                  >
                    {{ exp.description }}
                  </li>
                </template>
              </ul>

              <!-- Technologies Tag Bar -->
              <div v-if="exp.technologies && exp.technologies.length" class="mt-1.5 text-[10px] text-slate-600 font-semibold flex items-center gap-1 text-left">
                <span class="text-slate-400 font-normal">Tech:</span>
                <span>{{ Array.isArray(exp.technologies) ? exp.technologies.join(' • ') : exp.technologies }}</span>
              </div>
            </div>
          </div>

          <!-- Seccion: Proyectos Destacados -->
          <div v-else-if="sec.id === 'projects' && Array.isArray(contentData.projects)" class="space-y-3.5 text-left">
            <div 
              v-for="(proj, pIdx) in contentData.projects" 
              :key="pIdx"
              class="cv-proj-item text-left mb-3"
            >
              <div class="flex justify-between items-baseline mb-1 text-left">
                <span class="text-xs font-bold text-slate-900 text-left">
                  <span 
                    :contenteditable="isEditable"
                    @blur="updateArrayItem('projects', pIdx, 'title', $event)"
                    class="outline-none hover:bg-indigo-500/5 rounded px-1"
                  >{{ proj.title }}</span>
                  <span v-if="proj.company || proj.link" class="text-indigo-600 text-[11px] font-normal ml-1">
                    | {{ proj.company || proj.link }}
                  </span>
                </span>
              </div>

              <ul v-if="Array.isArray(proj.description)" class="list-disc list-inside space-y-1 text-xs text-slate-800 leading-[1.4] pl-1 text-left">
                <li 
                  v-for="(b, bI) in proj.description" 
                  :key="bI"
                  :contenteditable="isEditable"
                  @blur="updateBulletItem('projects', pIdx, bI, $event)"
                  class="outline-none hover:bg-indigo-500/5 focus:bg-indigo-500/10 rounded px-1 transition-colors text-left mb-1"
                >
                  {{ b }}
                </li>
              </ul>

              <div v-if="proj.technologies" class="text-[10px] text-slate-500 mt-1 font-mono text-left">
                [{{ Array.isArray(proj.technologies) ? proj.technologies.join(' • ') : proj.technologies }}]
              </div>
            </div>
          </div>

          <!-- Seccion: Stack Tecnológico Categorizado -->
          <div v-else-if="(sec.id === 'stack' || sec.id === 'skills' || sec.id === 'digital') && Array.isArray(contentData[sec.id])" class="space-y-2 text-xs text-left">
            <div v-for="(cat, cIdx) in contentData[sec.id]" :key="cIdx" class="flex flex-col sm:flex-row sm:items-baseline gap-1 text-left">
              <span class="font-bold text-slate-900 min-w-[150px] uppercase text-[10px] tracking-wider text-slate-600 text-left">
                {{ cat.category || 'Categoría' }}:
              </span>
              <span 
                :contenteditable="isEditable"
                @blur="updateCategoryItems(sec.id, cIdx, $event)"
                class="text-slate-800 font-medium outline-none hover:bg-indigo-500/5 focus:bg-indigo-500/10 rounded px-1 flex-1 text-left"
              >
                {{ Array.isArray(cat.items) ? cat.items.join(' • ') : (cat.items || '') }}
              </span>
            </div>
          </div>

          <!-- Seccion: Educación & Certificaciones -->
          <div v-else-if="sec.id === 'education' && Array.isArray(contentData.education)" class="space-y-3 text-left">
            <div v-for="(edu, eIdx) in contentData.education" :key="eIdx" class="text-left mb-2">
              <div class="flex justify-between items-baseline text-left">
                <h3 
                  :contenteditable="isEditable"
                  @blur="updateArrayItem('education', eIdx, 'degree', $event)"
                  class="font-bold text-xs text-slate-900 outline-none hover:bg-indigo-500/5 rounded px-1 text-left"
                >
                  {{ edu.degree }}
                </h3>
                <span 
                  :contenteditable="isEditable"
                  @blur="updateArrayItem('education', eIdx, 'startDate', $event)"
                  class="text-[11px] font-semibold text-slate-600 outline-none hover:bg-indigo-500/5 rounded px-1"
                >
                  {{ edu.startDate ? `${edu.startDate} - ${edu.endDate || ''}` : (edu.year || '') }}
                </span>
              </div>
              <p 
                :contenteditable="isEditable"
                @blur="updateArrayItem('education', eIdx, 'institution', $event)"
                class="text-xs text-slate-700 italic outline-none hover:bg-indigo-500/5 rounded px-1 text-left"
              >
                {{ edu.institution }} {{ edu.location ? `| ${edu.location}` : '' }}
              </p>
              <ul v-if="Array.isArray(edu.description) && edu.description.length > 0" class="list-disc ml-4 mt-1 space-y-1 text-xs text-slate-700 text-left">
                <li v-for="(desc, dIdx) in edu.description" :key="dIdx" class="text-left leading-relaxed">
                  {{ desc }}
                </li>
              </ul>
              <p v-else-if="typeof edu.description === 'string' && edu.description" class="text-xs text-slate-700 mt-1 leading-relaxed text-left">
                {{ edu.description }}
              </p>
            </div>
          </div>

          <!-- Seccion: Idiomas (Europass CEFR Tabla A1-C2) -->
          <div v-else-if="sec.id === 'languages' && Array.isArray(contentData.languages)" class="space-y-2 text-xs text-left">
            <table class="w-full border-collapse text-left text-xs">
              <thead>
                <tr class="bg-slate-100 border-b border-slate-300 text-[10px] text-slate-600 uppercase">
                  <th class="p-1.5 font-bold text-left">Idioma</th>
                  <th class="p-1.5 font-bold text-left">Nivel CEFR (A1 - C2)</th>
                  <th class="p-1.5 font-bold text-left">Certificación</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(lang, lIdx) in contentData.languages" :key="lIdx" class="border-b border-slate-200">
                  <td class="p-1.5 font-bold text-slate-900 text-left">{{ lang.language }}</td>
                  <td class="p-1.5 font-semibold text-indigo-700 text-left">{{ lang.level }}</td>
                  <td class="p-1.5 text-slate-600 italic text-left">{{ lang.certificate || 'N/A' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Fallback para texto plano o contenido HTML -->
          <div 
            v-else
            :contenteditable="isEditable"
            class="cv-section-text text-xs text-slate-800 leading-[1.4] outline-none hover:bg-indigo-500/5 focus:bg-indigo-500/10 rounded p-1 transition-colors text-left"
            v-html="typeof contentData[sec.id] === 'string' ? contentData[sec.id] : JSON.stringify(contentData[sec.id] || '')"
            @blur="handleGenericBlur(sec.id, $event)"
          ></div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCvStore } from '@/stores/cv';

const store = useCvStore();
const props = defineProps({
  structure: { type: Array, required: true },
  fontSizeBase: { type: Number, default: 11 },
  marginValue: { type: Number, default: 20 },
  highlightSection: { type: String, default: null }
});

const isEditable = computed(() => store.currentStep === 5);
const currentTypeKey = computed(() => (store.cvType || 'harvard').toLowerCase());
const contentData = computed(() => store.content || {});
const personal = computed(() => contentData.value.personalInfo || {});

// Motor de Estilos Causal por Plantilla
const dynamicStyles = computed(() => {
  const key = currentTypeKey.value;
  let font = "'Inter', sans-serif";
  let margin = "2.0cm";
  let fontSize = props.fontSizeBase + 'pt';
  let primaryColor = store.customColor || '#1e293b';

  if (key === 'harvard') {
    font = "'Times New Roman', Times, serif";
    margin = "2.54cm";
    fontSize = "11pt";
    primaryColor = "#000000";
  } else if (key === 'tech') {
    font = "'Inter', sans-serif";
    margin = "2.0cm";
    fontSize = "10pt";
  } else if (key === 'creativo') {
    font = "'Montserrat', sans-serif";
    margin = "1.8cm";
    fontSize = "10pt";
  } else if (key === 'europass') {
    font = "'Arial', sans-serif";
    margin = "2.5cm";
    fontSize = "11pt";
  }

  return {
    fontFamily: font,
    fontSize: fontSize,
    margin: margin,
    padding: margin,
    '--cv-primary-color': primaryColor,
  };
});

function updateField(parentKey, fieldKey, event) {
  const val = event.target.innerText.trim();
  if (parentKey) {
    if (!store.content[parentKey]) store.content[parentKey] = {};
    store.content[parentKey][fieldKey] = val;
  } else {
    store.content[fieldKey] = val;
  }
}

function updateSectionTitle(sectionId, event) {
  const newTitle = event.target.innerText.trim();
  const found = props.structure.find(s => s.id === sectionId);
  if (found) found.label = newTitle;
}

function updateArrayItem(sectionId, index, key, event) {
  const val = event.target.innerText.trim();
  if (Array.isArray(store.content[sectionId]) && store.content[sectionId][index]) {
    store.content[sectionId][index][key] = val;
  }
}

function updateBulletItem(sectionId, index, bulletIndex, event) {
  const val = event.target.innerText.trim();
  if (Array.isArray(store.content[sectionId]) && store.content[sectionId][index]) {
    const desc = store.content[sectionId][index].description;
    if (Array.isArray(desc)) desc[bulletIndex] = val;
  }
}

function updateCategoryItems(sectionId, catIndex, event) {
  const val = event.target.innerText.trim();
  if (Array.isArray(store.content[sectionId]) && store.content[sectionId][catIndex]) {
    store.content[sectionId][catIndex].items = val.split('•').map(s => s.trim());
  }
}

function handleGenericBlur(sectionId, event) {
  store.content[sectionId] = event.target.innerHTML;
}
</script>

<style scoped>
.cv-paper {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-sizing: border-box;
  text-align: left !important;
  line-height: 1.4 !important;
}

.cv-section-title {
  text-align: left !important;
  text-transform: uppercase !important;
  font-weight: 700 !important;
  border-bottom: 1px solid #cbd5e1 !important;
  padding-bottom: 3px;
  margin-bottom: 8px;
}

.cv-paper p, .cv-paper li, .cv-paper span, .cv-paper div {
  text-align: left !important;
}

.cv-paper ul {
  padding-left: 1rem;
  margin-top: 4px;
  margin-bottom: 8px;
}

.cv-paper li {
  margin-bottom: 6px;
  line-height: 1.4 !important;
}

.standard-harvard {
  font-family: 'Times New Roman', Times, serif !important;
  color: #000000 !important;
}

.standard-tech {
  font-family: 'Inter', sans-serif !important;
}

.standard-creativo {
  font-family: 'Montserrat', sans-serif !important;
}

.standard-europass {
  font-family: 'Arial', sans-serif !important;
}

[contenteditable="true"]:hover {
  outline: 1px dashed rgba(99, 102, 241, 0.4);
}

[contenteditable="true"]:focus {
  outline: 2px solid rgba(99, 102, 241, 0.8);
  background-color: rgba(99, 102, 241, 0.03);
}
</style>