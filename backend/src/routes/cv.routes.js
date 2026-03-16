import { Router } from 'express';
import { cvController } from '../controllers/cv.controller.js';

export const cvRoutes = Router();

cvRoutes.post('/optimize', cvController.optimize);
cvRoutes.post('/save', cvController.save); // <--- AGREGA ESTA LÍNEA
cvRoutes.get('/history/:userId', cvController.getHistory);