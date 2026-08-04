import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue'; 
import { apiService } from '@/services/api';
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

  const chatHistory = ref([]);
  const currentStep = ref(1);
  const currentCvId = ref(null);
  
  // --- ESTADO ---
  const objective = ref('Trabajo');
  const targetJob = ref('');
  const vacancyInfo = ref('');
  const cvType = ref('harvard');
  const structureOrder = ref([]);
  const draftContent = ref(emptyDraft());
  const content = ref({});
  const defaultSections = ref(DEFAULT_SECTIONS);
  const customColor = ref('#1e293b');

  // --- COMPUTED ---
  const sections = computed(() =>
    structureOrder.value.length ? structureOrder.value : defaultSections.value
  );

  // --- ACCIONES ---
  function setStructureOrder(order) {
    structureOrder.value = Array.isArray(order) && order.length ? [...order] : [...defaultSections.value];
  }

  // --- PERSISTENCIA LOCAL ---
  function init() {
    const raw = localStorage.getItem('cv_draft');
    if (raw) {
      try {
        const data = JSON.parse(raw);
        objective.value = data.objective || 'Trabajo';
        targetJob.value = data.targetJob || '';
        vacancyInfo.value = data.vacancyInfo || '';
        cvType.value = data.cvType || 'harvard';
        draftContent.value = data.draftContent || emptyDraft();
        chatHistory.value = data.chatHistory || [];
        currentStep.value = data.currentStep || 1;
        currentCvId.value = data.currentCvId || null;
        if (data.structureOrder) setStructureOrder(data.structureOrder);
        content.value = data.content || {};
      } catch (e) {
        console.error("Error cargando caché local del CV:", e);
      }
    }
  }

  // Auto-guardado transparente en LocalStorage
  watch([chatHistory, currentStep, targetJob, vacancyInfo, cvType, draftContent, structureOrder, content, objective, currentCvId], () => {
    localStorage.setItem('cv_draft', JSON.stringify({
      objective: objective.value,
      targetJob: targetJob.value,
      vacancyInfo: vacancyInfo.value,
      cvType: cvType.value,
      draftContent: draftContent.value,
      structureOrder: structureOrder.value,
      content: content.value,
      chatHistory: chatHistory.value,
      currentStep: currentStep.value,
      currentCvId: currentCvId.value
    }));
  }, { deep: true });

  // --- ACCIONES ---
  function setRole(job, vacancy) {
    targetJob.value = job;
    vacancyInfo.value = vacancy || '';
  }

  function setCvType(type) {
    cvType.value = type;
  }

  function loadFromSaved(cv) {
    // Cargar datos completos desde un CV guardado en Supabase
    currentCvId.value = cv.id || null;
    targetJob.value = cv.target_job || cv.title || '';
    vacancyInfo.value = cv.vacancy_info || '';
    cvType.value = cv.cv_type || 'harvard';
    objective.value = cv.objective_type || 'Trabajo';
    if (cv.structure_order) setStructureOrder(cv.structure_order);
    content.value = cv.content || {};
    chatHistory.value = cv.chat_history || [];
    currentStep.value = 1; // Permite revisar o continuar desde el paso 1
  }

  async function saveToSupabase(userId, asNew = false) {
    if (!userId) return null;

    const payload = {
      userId,
      cvId: asNew ? null : currentCvId.value,
      cvData: content.value,
      title: targetJob.value || 'Mi CV Profesional',
      cvType: cvType.value,
      objectiveType: objective.value?.toLowerCase() || 'trabajo',
      vacancyInfo: vacancyInfo.value,
      chatHistory: chatHistory.value
    };
    
    const result = await apiService.saveCV(payload);
    const savedData = result.data || result;
    if (savedData?.id) currentCvId.value = savedData.id;
    return savedData;
  }

  return {
    objective,
    targetJob,
    chatHistory,
    currentStep,
    currentCvId,
    vacancyInfo,
    cvType,
    structureOrder,
    draftContent,
    content,
    customColor,
    sections,
    init,
    setRole,
    setCvType,
    setStructureOrder,
    loadFromSaved,
    saveToSupabase,
  };
});