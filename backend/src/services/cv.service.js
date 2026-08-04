import { createClient } from '@supabase/supabase-js';
import { geminiService } from './gemini.service.js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export const cvService = {
 
  async optimizeWithGemini({ prompt, objective, targetJob, vacancyInfo, history, fullSpecs, finalStructure, cvType }) {
    return geminiService.optimizeCV({ 
      prompt, 
      objective, 
      targetJob, 
      vacancyInfo, 
      history, 
      fullSpecs, 
      finalStructure,
      cvType
    });
  },

  async saveToSupabase({ userId, cvData, title, cvType, objectiveType, vacancyInfo, chatHistory, cvId = null }) {
    const payload = {
      user_id: userId,
      content: cvData, 
      title: title || 'Sin título',
      cv_type: cvType?.toLowerCase() || 'harvard',
      objective_type: objectiveType || 'trabajo',
      target_job: title,
      vacancy_info: vacancyInfo || '',
      chat_history: chatHistory || [],
      updated_at: new Date().toISOString()
    };

    let query;
    if (cvId) {
      query = supabase.from('cvs').update(payload).eq('id', cvId).eq('user_id', userId).select().single();
    } else {
      query = supabase.from('cvs').insert(payload).select().single();
    }

    let { data, error } = await query;

    // Fallback a tabla 'resumes' si 'cvs' no existe
    if (error && error.message.includes('relation "public.cvs" does not exist')) {
      const resQuery = cvId 
        ? supabase.from('resumes').update(payload).eq('id', cvId).eq('user_id', userId).select().single()
        : supabase.from('resumes').insert(payload).select().single();
      const resResult = await resQuery;
      data = resResult.data;
      error = resResult.error;
    }

    if (error) {
      console.error("Error en Supabase Save:", error.message);
      throw new Error(`Error al guardar el CV en Supabase: ${error.message}`);
    }

    return data;
  },

  async getUserHistory(userId) {
    let { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error && error.message.includes('relation "public.cvs" does not exist')) {
      const resResult = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      data = resResult.data;
      error = resResult.error;
    }
      
    if (error) throw error;
    return data || [];
  }
};