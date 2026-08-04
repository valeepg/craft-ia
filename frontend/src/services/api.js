const BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Cliente HTTP unificado para comunicar el Frontend con la API de Craft.IA
 */
async function request(endpoint, options = {}) {
  // Si BASE_URL no se define en Vercel pero la app y backend están en el mismo dominio o rewrite, 
  // la ruta relativa /api/cv/ funciona automáticamente.
  const url = BASE_URL ? `${BASE_URL.replace(/\/$/, '')}${endpoint}` : endpoint;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      let errorMessage = `Error en servidor (${response.status})`;
      try {
        const errorData = await response.json();
        if (errorData.error || errorData.message) {
          errorMessage = errorData.error || errorData.message;
        }
      } catch (e) {
        // Fallback si no hay JSON
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ [API Service Error] en ${endpoint}:`, error.message);
    throw error;
  }
}

export const apiService = {
  /**
   * Envía el prompt y contexto para optimización con Google Gemini
   */
  optimizeCV(payload) {
    return request('/api/cv/optimize', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Guarda o actualiza un CV en Supabase a través del backend
   */
  saveCV(payload) {
    return request('/api/cv/save', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Obtiene el historial de CVs de un usuario
   */
  getUserHistory(userId) {
    return request(`/api/cv/history/${userId}`, {
      method: 'GET',
    });
  },
};
