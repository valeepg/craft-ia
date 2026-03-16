import { createClient } from '@supabase/supabase-js';
import { geminiService } from './gemini.service.js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export const cvService = {
 
  async optimizeWithGemini({ prompt, objective, targetJob, vacancyInfo, history, fullSpecs, finalStructure }) {
    return geminiService.optimizeCV({ 
      prompt, 
      objective, 
      targetJob, 
      vacancyInfo, 
      history, 
      fullSpecs, 
      finalStructure 
    });
  },

  async smartUpdateWithGemini({ currentContent, newExperience, cvType }) {
    return geminiService.smartUpdateCV({ currentContent, newExperience, cvType });
  },

  async saveToSupabase({ userId, cvData, title, cvType, objectiveType, vacancyInfo, chatHistory, cvId = null }) {
    // 1. Limpieza y preparación de datos
    const payload = {
      user_id: userId,
      content: cvData, 
      title: title || 'Sin título',
      cv_type: cvType?.toLowerCase() || 'harvard',
      objective_type: objectiveType || 'trabajo',
      target_job: title,
      vacancy_info: vacancyInfo || '',
      chat_history: chatHistory || [],
      updated_at: new Date().toISOString() // Auditoría básica
    };

    // 2. Lógica de "Upsert" (Actualizar si existe, insertar si es nuevo)
    // Si pasas un cvId, actualiza ese registro específico.
    const query = cvId 
      ? supabase.from('cvs').update(payload).eq('id', cvId).eq('user_id', userId)
      : supabase.from('cvs').insert(payload);

    const { data, error } = await query.select().single();

    if (error) {
      console.error("Error en Supabase Save:", error.message);
      throw new Error(`Error al guardar el CV: ${error.message}`);
    }

    return data;
  },

  async getUserHistory(userId) {
    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  }
};