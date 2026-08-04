import { cvService } from '../services/cv.service.js';
import { geminiService } from '../services/gemini.service.js';

// Extraer texto según tipo de archivo (buffer de Node.js)
async function extractTextFromBuffer(buffer, mimetype, originalname) {
  const name = (originalname || '').toLowerCase();

  if (mimetype === 'application/pdf' || name.endsWith('.pdf')) {
    // pdfjs-dist legacy: funciona en Node.js sin CDN ni workers externos
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = '';
    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
    const pdf = await loadingTask.promise;
    let fullText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map(item => item.str).join(' ') + '\n';
    }
    const text = fullText.trim();
    if (text.replace(/\s+/g, '').length < 50) {
      return { text: '', warning: 'No se detectó texto en el PDF. Por favor, sube un documento con texto seleccionable o un archivo .docx' };
    }
    return { text: text.slice(0, 15000) };

  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    name.endsWith('.docx')
  ) {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return { text: (result.value || '').trim().slice(0, 15000) };

  } else if (mimetype === 'text/plain' || name.endsWith('.txt')) {
    return { text: buffer.toString('utf-8').trim().slice(0, 15000) };

  } else {
    return { text: '', warning: 'Formato no soportado. Por favor sube un archivo .pdf, .docx o .txt' };
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

      // Convertir base64 a Buffer de Node.js
      const buffer = Buffer.from(fileBase64, 'base64');
      const result = await extractTextFromBuffer(buffer, mimeType || '', fileName);

      if (result.warning) {
        return res.status(400).json({ error: result.warning });
      }

      if (!result.text || result.text.trim().length === 0) {
        return res.status(400).json({ error: 'No se pudo extraer texto del archivo.' });
      }

      const cvData = await geminiService.parseCVText({ 
        rawText: result.text, 
        cvType: cvType || 'harvard', 
        targetJob: targetJob || '' 
      });
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

