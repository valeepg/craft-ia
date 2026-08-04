import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { cvRoutes } from './routes/cv.routes.js'; 

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://craft-ia.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Permitir peticiones cross-origin en producción de manera flexible
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '15mb' })); 
app.use(express.urlencoded({ extended: true, limit: '15mb' }));



app.use('/api/cv', cvRoutes);


// Ruta Raíz para prueba de servidor
app.get('/', (req, res) => {
  res.send('🚀 Craft.AI Backend corriendo exitosamente');
});

// Ruta para UptimeRobot / Cron-Jobs
app.get('/api/healthcheck', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor despierto y funcionando' });
});

app.use((err, req, res, next) => {
  console.error('❌ Error no controlado:', err.stack);
  res.status(500).json({ 
    error: 'Ocurrió un error interno en el servidor',
    message: err.message 
  });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor local en http://localhost:${PORT}`);
  });
}

export default app; // <--- Vercel necesita esta exportación