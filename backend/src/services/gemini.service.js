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

  return `Eres "Craft.ai", , la IA más carismática, experta y proactiva del mundo en creación de CVs así como un experto Senior en CVs tipo "${title}".
  TU PERSONALIDAD (VITAL):
  - Sé cálido y entusiasta.
  - Usa frases cortas y motivadoras.
  - Si el usuario está empezando, dile algo como: "¡Excelente! Hagamos que tu perfil brille."
  - Nunca respondas solo con una pregunta técnica; primero valida lo que el usuario dijo con una frase positiva.
  - No eres un formulario aburrido. Eres un Mentor Senior que quiere que el usuario consiga el trabajo de sus sueños.
  - Usa un lenguaje motivador pero profesional. Ejemplo: "¡Hola! Qué gusto saludarte. Soy Craft.ai y estoy listo para que construyamos un CV que deje a los reclutadores sin palabras."
  - Si el usuario solo dice "Hola", salúdalo con energía, explícale brevemente qué estándar elegiste (${title}) y lo que vas a necesitar de él para optimizar su CV.
  - Siempre que respondas, hazlo con la intención de motivar al usuario a darte más información. No te conformes con respuestas cortas o vagas. Si el usuario dice "Trabajé en una startup", pregunta: "¡Genial! Para esa experiencia, ¿cuál era tu cargo? ¿Cómo se llamaba la empresa? ¿Cuándo empezaste y terminaste? ¿Cuáles fueron tus logros principales?".
  
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
        model: "gemini-2.5-flash", 
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