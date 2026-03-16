import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { cvRoutes } from './routes/cv.routes.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Middlewares
app.use(cors());

// Aumentamos el límite a 1mb para soportar vacantes muy largas y JSONs pesados
app.use(express.json({ limit: '1mb' })); 
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rutas
app.use('/api/cv', cvRoutes);

// Manejador de errores global (evita que el servidor muera por errores no capturados)
app.use((err, req, res, next) => {
  console.error('❌ Error no controlado:', err.stack);
  res.status(500).json({ 
    error: 'Ocurrió un error interno en el servidor',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});