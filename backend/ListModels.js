import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function verifyModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // Intentamos listar los modelos disponibles
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    
    console.log("--- Modelos Disponibles para tu Key ---");
    data.models.forEach(m => console.log(`> ${m.name}`));
    
    if (data.models.find(m => m.name.includes('gemini-3-flash-preview'))) {
      console.log("\n✅ ¡gemini-3-flash-preview está disponible!");
    } else {
      console.log("\n❌ No veo gemini-3-flash-preview. Revisa si tu API Key es de Google AI Studio.");
    }
  } catch (e) {
    console.error("Error conectando:", e);
  }
}

verifyModels();