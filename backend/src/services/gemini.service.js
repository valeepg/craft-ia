import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPromptsByStandard = {
  harvard: "Genera el contenido en español usando un tono ejecutivo. Cero adjetivos informales. CADA viñeta de experiencia DEBE seguir la Fórmula XYZ de Google: 'Logré [X], medido por [Y], mediante [Z]'. No incluyas secciones de proyectos personales ni foto.",
  tech: "Especialízate en roles de Software/Data. Resalta palabras clave técnicas, nombres de librerías y arquitectura. Transforma las tareas simples en logros técnicos cuantificables. Organiza el Stack Tecnológico obligatoriamente por categorías (Lenguajes, Frameworks, Cloud/Herramientas).",
  europass: "Sigue el estándar oficial de la Unión Europea. Estructura las competencias en organizativas, digitales y de comunicación. Usa el Marco Común Europeo (A1-C2) para idiomas.",
  creativo: "Usa un enfoque de storytelling profesional, destacando proyectos clave, roles creativos, portafolio e impacto visual."
};

const buildSystemInstruction = ({ objective, targetJob, vacancyInfo, fullSpecs, finalStructure, cvType }) => {
  const { title, specs, features } = fullSpecs;
  const standardKey = (cvType || 'harvard').toLowerCase();
  const specificStandardPrompt = systemPromptsByStandard[standardKey] || systemPromptsByStandard.harvard;
  
  // Generamos un esquema dinámico basado en los IDs reales del estándar elegido
  const dynamicSchema = {};
  finalStructure.forEach(s => {
    if (s.id === 'personal') {
      dynamicSchema.personalInfo = { 
        fullName: "", 
        email: "", 
        phone: "", 
        city: "", 
        links: { github: "", linkedin: "", portfolio: "", website: "", behance: "" },
        title: targetJob || ""
      };
    } else if (s.id === 'summary') {
      dynamicSchema.summary = ""; 
    } else if (s.id === 'education') {
      dynamicSchema.education = [{ 
        institution: "", 
        degree: "", 
        field: "", 
        location: "", 
        startDate: "", 
        endDate: "", 
        achievements: [] 
      }];
    } else if (s.id === 'experience' || s.id === 'projects' || s.id === 'trayectoria') {
      dynamicSchema[s.id] = [{ 
        title: "", 
        company: "", 
        location: "", 
        startDate: "", 
        endDate: "", 
        current: false, 
        description: [],
        technologies: [] 
      }];
    } else if (s.id === 'stack' || s.id === 'skills' || s.id === 'digital') {
      dynamicSchema[s.id] = [
        { category: "Lenguajes de Programación", items: [] },
        { category: "Frameworks y Librerías", items: [] },
        { category: "Herramientas, Cloud & DevOps", items: [] },
        { category: "Bases de Datos & Almacenamiento", items: [] }
      ]; 
    } else if (s.id === 'languages') {
      dynamicSchema.languages = [{ language: "", level: "", certificate: "" }]; 
    } else {
      dynamicSchema[s.id] = []; 
    }
  });

  return `Eres "Craft.ai", la IA mentora experta en ingeniería de CVs de alto impacto bajo el estándar "${title}".

REGLA DE CONCISIÓN EN EL CHAT (ESTRICTA):
Tus respuestas dentro de la burbuja de chat (messageToUser) DEBEN SER BREVES, DIRECTAS Y AMABLES (MÁXIMO 3 ORACIONES). 
NO IMPRIMAS NUNCA EL DOCUMENTO COMPLETO EN EL CHAT. En su lugar, confirma en 1 o 2 oraciones breves los cambios realizados e inyecta la redacción completa optimizada directamente en el objeto JSON "updatedCVData".

INSTRUCCIÓN ESPECÍFICA DEL ESTÁNDAR (${title}):
"${specificStandardPrompt}"

OBJETIVO DEL PUESTO: "${targetJob || 'Profesional'}"
DESCRIPCIÓN DE LA VACANTE: "${vacancyInfo || 'No especificada'}"
TIPO DE OBJETIVO: "${objective || 'Trabajo'}"

REGLAS DE ORO DE REDACCIÓN (ESTRICTAS Y OBLIGATORIAS):
1. FÓRMULA XYZ DE GOOGLE EN CADA VIÑETA DE EXPERIENCIA Y PROYECTOS:
   "Logré [X], medido por [Y], haciendo [Z]"
   Ejemplo Correcto: "Optimicé el tiempo de respuesta en un 35% mediante la implementación de Redis en arquitectura Node.js."

2. PROHIBIDO ADJETIVOS VACÍOS Y CLICHÉS ATS:
   Queda TOTALMENTE PROHIBIDO usar palabras como: "proactivo", "organizado", "apasionado", "orientado a resultados", "responsable", "trabajador", "motivado".
   Reemplázalas SIEMPRE por logros numéricos, porcentajes, métricas de negocio o decisiones técnicas cuantificables.

RESPUESTA EN JSON PURO (SIN MARKDOWN EXTRA):
{
  "messageToUser": "Mensaje breve de máximo 3 oraciones confirmando el avance",
  "updatedCVData": ${JSON.stringify(dynamicSchema)},
  "currentSection": "seccion_actual",
  "missingFields": ["campos_pendientes"],
  "isAllComplete": false
}`;
};

export const geminiService = {
  async optimizeCV({ prompt, objective, targetJob, vacancyInfo, cvType, history = [], fullSpecs, finalStructure }) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash", 
        generationConfig: { 
          responseMimeType: "application/json",
          temperature: 0.2 
        },
        systemInstruction: buildSystemInstruction({ objective, targetJob, vacancyInfo, fullSpecs, finalStructure, cvType }),
      });

      const chat = model.startChat({
        history: history.map(msg => ({
          role: msg.sender === 'ai' || msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.text }],
        })),
      });

      const result = await chat.sendMessage(prompt);
      const rawText = result.response.text();
      const cleanText = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      
      try {
        return JSON.parse(cleanText);
      } catch (parseError) {
        console.error("Error parseando JSON de Gemini:", rawText);
        throw new Error("La IA no devolvió un formato JSON válido.");
      }
      
    } catch (error) {
      console.error("Error en geminiService:", error);
      throw error;
    }
  },

  async parseCVText({ rawText, cvType = 'harvard', targetJob = '' }) {
    try {
      const schemaExample = {
        personalInfo: {
          fullName: "",
          email: "",
          phone: "",
          city: "",
          title: "",
          links: { linkedin: "", github: "", portfolio: "", website: "" },
          photo: "",
          skype: ""
        },
        summary: "",
        experience: [{
          title: "",
          company: "",
          location: "",
          startDate: "",
          startMonth: "",
          startYear: "",
          isCurrent: false,
          endMonth: "",
          endYear: "",
          description: []
        }],
        education: [{
          degree: "",
          institution: "",
          location: "",
          startDate: "",
          startMonth: "",
          startYear: "",
          isCurrent: false,
          endMonth: "",
          endYear: "",
          description: []
        }],
        projects: [{
          title: "",
          company: "",
          description: [],
          technologies: []
        }],
        stack: [
          { category: "Lenguajes de Programaci\u00f3n", items: [] },
          { category: "Frameworks y Librer\u00edas", items: [] },
          { category: "Herramientas, Cloud & DevOps", items: [] },
          { category: "Bases de Datos & Almacenamiento", items: [] }
        ],
        languages: [{ language: "", level: "", certificate: "" }]
      };

      const systemInstruction = `Eres un extractor experto de datos de hojas de vida (CVs). 
Tu tarea es analizar el texto del CV del usuario y mapear TODA la información que encuentres al siguiente esquema JSON.
Devuelve ÚNICAMENTE el JSON, sin explicaciones, sin markdown, sin bloques de código. Solo el JSON puro.

Estándar de CV destino: ${cvType.toUpperCase()}
Puesto objetivo: ${targetJob || 'No especificado'}

Reglas de mapeo:
- Si encuentras fechas en el CV (ej: "Enero 2020 - Marzo 2023"), extrae el mes en startMonth/endMonth y el año en startYear/endYear.
- Si el candidato sigue en el trabajo actual, pon isCurrent: true y deja endMonth/endYear vacíos.
- Las viñetas de descripción de experiencia van en el array description[], una viñeta por elemento.
- Agrupa las habilidades técnicas por categoría en stack[].
- Para el campo startDate, combina startMonth + startYear (ej: "Enero 2020 - Presente" si isCurrent).
- Si no encuentras información para un campo, déjalo como string vacío "" o array vacío [].

Esquema JSON objetivo:
${JSON.stringify(schemaExample, null, 2)}`;

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1
        },
        systemInstruction
      });

      const result = await model.generateContent(rawText);
      const rawResponse = result.response.text();
      const cleanResponse = rawResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();

      try {
        return JSON.parse(cleanResponse);
      } catch (parseError) {
        console.error("Error parseando JSON de parseCVText:", rawResponse);
        throw new Error("La IA no devolvió un JSON válido al parsear el CV.");
      }
    } catch (error) {
      console.error("Error en parseCVText:", error);
      throw error;
    }
  }
};