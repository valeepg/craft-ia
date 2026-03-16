import { cvService } from '../services/cv.service.js';

export const cvController = {
  
  async optimize(req, res) {
    try {
      const { 
        prompt, 
        objective,      // <--- FALTA ESTE
        targetJob, 
        vacancyInfo, 
        history, 
        fullSpecs, 
        finalStructure  // <--- FALTA ESTE
      } = req.body;
      
      const result = await cvService.optimizeWithGemini({ 
        prompt, 
        objective,      // <--- PASARLO
        targetJob, 
        vacancyInfo, 
        history,
        fullSpecs,
        finalStructure  // <--- PASARLO
      });
      res.json(result);
    } catch (err) {
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