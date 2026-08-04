import { Router } from 'express';
import { cvController } from '../controllers/cv.controller.js';

export const cvRoutes = Router();

cvRoutes.post('/optimize', cvController.optimize);
cvRoutes.post('/parse', cvController.parseCV);
cvRoutes.post('/save', cvController.save);
cvRoutes.get('/history/:userId', cvController.getHistory);
