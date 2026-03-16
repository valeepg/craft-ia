import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue'; 
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const DEFAULT_SECTIONS = [
  { id: 'summary', label: 'Resumen' },
  { id: 'experience', label: 'Experiencia' },
  { id: 'education', label: 'Educación' },
  { id: 'skills', label: 'Habilidades' },
  { id: 'languages', label: 'Idiomas' },
];

const emptyDraft = () => ({
  summary: '',
  experience: [{ role: '', company: '', dates: '', bullets: '' }],
  education: [{ degree: '', institution: '', year: '' }],
  skills: '',
  languages: [{ name: '', level: '' }],
});

export const useCvStore = defineStore('cv', () => {

  const chatHistory = ref([]); // <-- Mueve el historial aquí
  const currentStep = ref(1);
  // --- ESTADO ---
  const targetJob = ref('');
  const vacancyInfo = ref('');
  const cvType = ref('harvard');
  const structureOrder = ref([]);
  const draftContent = ref(emptyDraft());
  const content = ref({});
  const defaultSections = ref(DEFAULT_SECTIONS);

  // --- COMPUTED ---
  const sections = computed(() =>
    structureOrder.value.length ? structureOrder.value : defaultSections.value
  );

  // --- ACCIONES ---
  function setStructureOrder(order) {
    structureOrder.value = Array.isArray(order) ? [...order] : [...defaultSections.value];
  }

  // --- PERSISTENCIA LOCAL ---
  function init() {
    const raw = localStorage.getItem('cv_draft');
    if (raw) {
      try {
        const data = JSON.parse(raw);
        targetJob.value = data.targetJob || '';
        vacancyInfo.value = data.vacancyInfo || '';
        cvType.value = data.cvType || 'harvard';
        draftContent.value = data.draftContent || emptyDraft();
        chatHistory.value = data.chatHistory || []; // Recuperar el chat
        currentStep.value = data.currentStep || 1;
        if (data.structureOrder) setStructureOrder(data.structureOrder);
        content.value = data.content || {};
      } catch (e) {
        console.error("Error cargando cache local", e);
        content.value = {};
      }
    }else {
      content.value = {}; // Si no hay nada en LS, inicializa vacío
    }
  }

  // Auto-guardado en LocalStorage
  watch([chatHistory, currentStep, targetJob, vacancyInfo, cvType, draftContent, structureOrder], () => {
    localStorage.setItem('cv_draft', JSON.stringify({
      targetJob: targetJob.value,
      vacancyInfo: vacancyInfo.value,
      cvType: cvType.value,
      draftContent: draftContent.value,
      structureOrder: structureOrder.value,
      content: content.value,
      chatHistory: chatHistory.value,
      currentStep: currentStep.value
    }));
  }, { deep: true });

  // --- ACCIONES ---
  function setRole(job, vacancy) {
    targetJob.value = job;
    vacancyInfo.value = vacancy || '';
  }

  function setCvType(type) {
    console.log("Cambiando estilo a:", type);
    cvType.value = type;
  }

  function loadFromSaved(cv) {
    // Cargar datos desde un CV guardado
    targetJob.value = cv.target_job || '';
    vacancyInfo.value = cv.vacancy_info || '';
    cvType.value = cv.cv_type || 'harvard';
    setStructureOrder(cv.structure_order || []);
    content.value = cv.content || {};
    chatHistory.value = cv.chat_history || [];
    currentStep.value = 1; // Empezar desde el paso 1 para permitir navegación hacia atrás
  }

  // --- LLAMADA AL BACKEND (Aquí es donde ocurre la magia) ---
  async function saveToSupabase(userId) {
    if (!userId) return;

    const payload = {
      userId,
      cvData: content.value, // Los datos optimizados por la IA
      // Añadimos un timestamp al título para diferenciarlos si es nueva versión
      title: isNewVersion 
        ? `${targetJob.value} - Optimizado ${new Date().toLocaleDateString()}` 
        : targetJob.value,
      cvType: cvType.value,
      objectiveType: 'trabajo', 
      vacancyInfo: vacancyInfo.value,
      // Importante: Si mandas un 'id' nulo, Supabase creará uno nuevo (INSERT)
      // Si mandas el 'id' del CV actual, lo actualizará (UPDATE)
      id: isNewVersion ? null : currentCvId.value 
    };
    
    const res = await fetch(`${apiUrl}/api/cv/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  
    const result = await res.json();
    if(result.id) currentCvId.value = result.id; // Guardamos el ID del CV actual
    return result;
  }

  return {
    targetJob,
    chatHistory,
    currentStep,
    vacancyInfo,
    cvType,
    structureOrder,
    draftContent,
    content,
    sections,
    init,
    setRole,
    setCvType,
    setStructureOrder,
    saveToSupabase,
  };
});