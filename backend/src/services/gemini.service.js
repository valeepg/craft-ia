import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const buildSystemInstruction = ({ objective, targetJob, vacancyInfo, fullSpecs, finalStructure }) => {
  const { title, specs, features } = fullSpecs;
  
  // Generamos un esquema dinámico basado en los IDs reales del estándar elegido
  const dynamicSchema = {};
  finalStructure.forEach(s => {
  if (s.id === 'personal') {
    // Incluye enlaces dinámicos (GitHub, LinkedIn, Portfolio)
    dynamicSchema.personalInfo = { 
      fullName: "", 
      email: "", 
      phone: "", 
      city: "", 
      links: { github: "", linkedin: "", portfolio: "", website: "" },
      title: "" // Ej: "Systems Engineer"
    };
  } else if (s.id === 'summary') {
    // El "Perfil Profesional" generado por IA
    dynamicSchema.summary = ""; 
  } else if (s.id === 'education') {
    dynamicSchema.education = [{ 
      institution: "", 
      degree: "", 
      field: "", 
      location: "", 
      startDate: "", 
      endDate: "", 
      achievements: [] // Honores, promedios, premios
    }];
  } else if (s.id === 'experience' || s.id === 'projects' || s.id === 'trayectoria') {
    dynamicSchema[s.id] = [{ 
      title: "", // Cargo o nombre del proyecto
      company: "", // Empresa o link de repositorio
      location: "", 
      startDate: "", 
      endDate: "", 
      current: false, 
      description: [], // Los "Bullet Points" que optimizará la IA
      technologies: [] // Stack usado específicamente aquí
    }];
  } else if (s.id === 'stack' || s.id === 'skills' || s.id === 'digital') {
    // Categorización por niveles (Junior, Senior o escala 1-5)
    dynamicSchema[s.id] = [{ category: "", items: [] }]; 
  } else if (s.id === 'languages') {
    // Esencial para Europass
    dynamicSchema.languages = [{ language: "", level: "", certificate: "" }]; 
  } else {
    // Fallback para secciones personalizadas
    dynamicSchema[s.id] = []; 
  }
});

  return `Eres "Craft Assistant", experto Senior en CVs tipo "${title}".
  
  REGLAS TÉCNICAS DEL ESTÁNDAR:
  - Margen: ${specs.margins} | Fuente: ${specs.font} | Tamaño: ${specs.fontSize}.
  - Reglas de Estilo: ${features.join(', ')}.
  - Orden Obligatorio: ${specs.order}.

  COMPORTAMIENTO DE EXPERTO (ESTRICTO):
  1. DETECTIVE DE DATOS: No puedes avanzar si falta información. Si el usuario menciona un trabajo, DEBES preguntar: Nombre de la empresa, Mes/Año inicio, Mes/Año fin (o si sigue ahí) y Logros. 
  2. NADA EN BLANCO: Si una sección del estándar (${title}) está vacía, pregunta por ella. Ejemplo: "Para el perfil Tech, el Stack Tecnológico es vital, ¿qué lenguajes dominas?".
  3. LINKS: Este estándar exige: ${specs.requiredLinks.join(', ')}. Si no los tienes, pídelos o sugiere crearlos.
  4. REDACCIÓN: Transforma respuestas simples en frases de alto impacto. 
     ${title.includes('Harvard') ? 'Usa la FÓRMULA XYZ: Logré [X] medido por [Y] haciendo [Z].' : ''}

  RESPUESTA (JSON PURO):
  {
    "messageToUser": "Tu feedback o la pregunta específica de lo que falta",
    "updatedCVData": ${JSON.stringify(dynamicSchema)},
    "currentSection": "id_de_seccion",
    "missingFields": ["lista_de_lo_que_falta_pedir"],
    "isAllComplete": false
  }`;
};

export const geminiService = {
  async optimizeCV({ prompt, objective, targetJob, vacancyInfo, history = [], fullSpecs, finalStructure }) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-3-flash-preview", 
        generationConfig: { 
          responseMimeType: "application/json",
          temperature: 0.2 
        },
        systemInstruction: buildSystemInstruction({ objective, targetJob, vacancyInfo, fullSpecs, finalStructure }),
      });

      const chat = model.startChat({
        history: history.map(msg => ({
          role: msg.sender === 'ai' ? 'model' : 'user',
          parts: [{ text: msg.text }],
        })),
      });

      const result = await chat.sendMessage(prompt);
      const text = result.response.text().replace(/```json|```/g, "").trim();
      
      return JSON.parse(text);
      
    } catch (error) {
      console.error("Error en geminiService:", error);
      throw error;
    }
  }
};