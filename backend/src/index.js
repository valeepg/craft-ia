import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { cvRoutes } from './routes/cv.routes.js'; 

dotenv.config();

const app = express();

app.use(cors({
  origin: 'https://craft-ia.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' })); 
app.use(express.urlencoded({ extended: true, limit: '1mb' }));


app.use('/api/cv', cvRoutes);


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