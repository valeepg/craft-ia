import { cvService } from '../services/cv.service.js';
import { geminiService } from '../services/gemini.service.js';

// Procesar archivo según tipo (.pdf, .docx, .txt)
async function processDocumentForGemini({ buffer, fileBase64, mimeType, fileName }) {
  const name = (fileName || '').toLowerCase();
  const type = (mimeType || '').toLowerCase();

  if (type === 'application/pdf' || name.endsWith('.pdf')) {
    // Para PDFs, Gemini 1.5 procesa directamente el archivo Base64 con su visión/OCR nativo (cero dependencias de DOM/Node)
    return { isPdf: true, fileBase64, mimeType: 'application/pdf' };

  } else if (
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    name.endsWith('.docx')
  ) {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    const text = (result.value || '').trim();
    if (!text || text.length < 20) {
      return { warning: 'No se detectó contenido de texto en el archivo Word (.docx).' };
    }
    return { isPdf: false, rawText: text.slice(0, 20000) };

  } else if (type === 'text/plain' || name.endsWith('.txt')) {
    const text = buffer.toString('utf-8').trim();
    if (!text || text.length < 20) {
      return { warning: 'El archivo de texto (.txt) está vacío.' };
    }
    return { isPdf: false, rawText: text.slice(0, 20000) };

  } else {
    return { warning: 'Formato no soportado. Por favor sube un archivo en formato .pdf, .docx o .txt' };
  }
}

export const cvController = {
  
  async optimize(req, res) {
    try {
      const { prompt, objective, targetJob, vacancyInfo, history, fullSpecs, finalStructure } = req.body;
      const result = await cvService.optimizeWithGemini({ 
        prompt, objective, targetJob, vacancyInfo, history, fullSpecs, finalStructure
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async parseCV(req, res) {
    try {
      // Recibe el archivo como base64 en JSON (compatible con Vercel serverless)
      const { fileBase64, fileName, mimeType, cvType, targetJob } = req.body;

      if (!fileBase64 || !fileName) {
        return res.status(400).json({ error: 'Se requiere fileBase64 y fileName.' });
      }

      // Convertir base64 a Buffer para formatos que lo requieran (ej: docx)
      const buffer = Buffer.from(fileBase64, 'base64');
      const processed = await processDocumentForGemini({ buffer, fileBase64, mimeType, fileName });

      if (processed.warning) {
        return res.status(400).json({ error: processed.warning });
      }

      let cvData;
      if (processed.isPdf) {
        // Enviar PDF directamente a Gemini como InlineData
        cvData = await geminiService.parseCVDocument({
          fileBase64: processed.fileBase64,
          mimeType: processed.mimeType,
          cvType: cvType || 'harvard',
          targetJob: targetJob || ''
        });
      } else {
        // Enviar texto extraído a Gemini
        cvData = await geminiService.parseCVDocument({
          rawText: processed.rawText,
          cvType: cvType || 'harvard',
          targetJob: targetJob || ''
        });
      }

      res.json({ success: true, cvData });
    } catch (err) {
      console.error('Error en parseCV controller:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async save(req, res) {
    try {
      const { cvData, userId, title, cvType, objectiveType, vacancyInfo, chatHistory } = req.body;
      const result = await cvService.saveToSupabase({
        userId, cvData, title, cvType, objectiveType, vacancyInfo, chatHistory
      });
      res.json({ message: "Guardado exitosamente", data: result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getHistory(req, res) {
    try {
      const { userId } = req.params;
      const history = await cvService.getUserHistory(userId);
      res.json(history);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

