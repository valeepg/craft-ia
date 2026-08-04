# 🚀 Craft.IA: Generador Inteligente de CVs

<div align="center">
  <img src="https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>

<br />

**Craft.IA** es una aplicación revolucionaria que transforma la creación de currículums en una experiencia estratégica y personalizada. Utilizando inteligencia artificial avanzada (Google Gemini), guía al usuario paso a paso para construir perfiles profesionales optimizados bajo estándares internacionales (Harvard, ATS y Europass), con auto-completado mágico a partir de tu CV actual y exportación precisa a PDF de alta calidad.

---

## ✨ Características Principales

- 🎯 **Optimización ATS**: CVs diseñados específicamente para superar filtros automáticos de reclutamiento (Applicant Tracking Systems).
- 🪄 **Importación Mágica de CV**: Sube tu currículum actual en formato PDF o Word y la IA extraerá y categorizará toda tu información para auto-rellenar el formulario en segundos.
- 🤖 **IA Interactiva (Career Coach)**: Un asistente virtual en tiempo real que mejora tu redacción, optimiza la semántica y adapta tu experiencia al puesto que buscas.
- 📱 **Interfaz Premium & Dinámica**: UI/UX fluida con Glassmorphism, animaciones sofisticadas, y transiciones sin recargas.
- 👥 **Modo Invitado & Cuentas de Usuario**: Empieza inmediatamente sin barreras o regístrate (vía Supabase Auth) para guardar y sincronizar tu información en la nube.
- 📄 **Exportación Profesional**: Creación de archivos PDF A4 de calidad imprenta con márgenes perfectos y estructura tipográfica impecable.

---

## 🏗️ Arquitectura del Sistema (Serverless)

El proyecto está diseñado para funcionar de manera óptima y escalable en entornos Serverless como Vercel, dividiendo la aplicación en un Frontend reactivo y una API Backend ligera.

### Diagrama de Arquitectura

```mermaid
graph TB
    A[Usuario] --> B[Frontend Vue.js / Vercel]
    B --> C[Pinia Store (Estado local)]
    B --> D[Supabase Auth & DB]
    
    B -- Envío de PDF / Peticiones --> H[Backend Node.js / Vercel API]
    H --> I[pdf-parse / mammoth (Extracción de texto)]
    H --> J[Google Gemini 1.5 API]
    J -- JSON estructurado --> H
    H -- Respuesta optimizada --> B
    
    B --> K[html2pdf.js]
    K --> L[PDF Export (A4)]

    style A color:#000,fill:#e1f5fe
    style B color:#000,fill:#c8e6c9
    style C color:#000,fill:#fff3e0
    style D color:#000,fill:#fce4ec
    style H color:#000,fill:#fff8e1
    style I color:#000,fill:#e0f2f1
    style J color:#000,fill:#f3e5f5
    style K color:#000,fill:#e8f5e8
    style L color:#000,fill:#f9fbe7
```

### Componentes Arquitectónicos

- **Frontend (Vue 3 + Vite)**: SPA (Single Page Application) construida con Composition API. Alojada de forma estática en Vercel.
- **Backend (Node.js + Express)**: Actúa como pasarela API (Serverless Functions en Vercel) para proteger las llaves de IA y procesar cargas pesadas de archivos (PDF/Word) utilizando `pdf-parse` (compatible nativamente con entornos sin DOM).
- **Base de Datos (Supabase)**: PostgreSQL con sistema completo de autenticación (Auth) y Políticas de Seguridad a Nivel de Fila (RLS) para proteger los currículums.
- **Inteligencia Artificial (Gemini 1.5 Pro)**: Generación estructurada de datos (JSON) para mapeo exacto de la información del usuario a las secciones del CV.

---

## 🛠️ Instalación y Configuración Local

### Prerrequisitos
- **Node.js** >= 18.0.0 (Recomendado 20.x)
- Cuenta de **Google AI Studio** (API Key)
- Cuenta de **Supabase** (Proyecto activo)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/craft-ia.git
cd craft-ia
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en la carpeta `backend/`:
```env
PORT=3000
GEMINI_API_KEY=tu_clave_de_gemini_aqui
FRONTEND_URL=http://localhost:5173
```

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
```

Crea un archivo `.env` en la carpeta `frontend/`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### 4. Ejecutar la Aplicación en Desarrollo

Inicia ambos servidores en pestañas separadas de tu terminal:

**Backend:**
```bash
cd backend
npm run dev
# Correrá en http://localhost:3000
```

**Frontend:**
```bash
cd frontend
npm run dev
# Correrá en http://localhost:5173
```

---

## 🚀 Despliegue en Producción (Vercel)

El proyecto está preparado para un despliegue directo usando Vercel CLI:

1. Despliega el **Backend** primero:
   ```bash
   cd backend
   npx vercel deploy --prod
   ```
   *Asegúrate de agregar `GEMINI_API_KEY` en las variables de entorno de este proyecto en Vercel.*

2. Toma la URL resultante del backend (ej. `https://craft-ia-backend.vercel.app`) y agrégala al `.env` de tu frontend o configúrala en el Dashboard de Vercel para el proyecto Frontend como `VITE_API_URL`.

3. Despliega el **Frontend**:
   ```bash
   cd frontend
   npx vercel deploy --prod
   ```

---

## 🤖 Inteligencia Artificial: El Motor de Craft.IA

La integración con Google Gemini no es un simple chat; es un sistema orquestado que funciona como el núcleo de lógica de negocios:

1.  **Parseo Inteligente (Importar CV)**: En lugar de expresiones regulares propensas a fallos, el backend extrae el texto en crudo (usando `pdf-parse` o `mammoth`) y Gemini lo clasifica mágicamente en el modelo JSON de la aplicación (Experiencia, Educación, Skills).
2.  **Optimización Semántica (Método Google XYZ)**: Transforma automáticamente funciones planas ("Hice ventas") en logros cuantificables ("Incrementé las ventas en un 15% mediante...").
3.  **Chat Iterativo**: Un copiloto constante en la interfaz de creación permite alterar descripciones sobre la marcha usando lenguaje natural (*"Haz que este párrafo suene más orientado a liderazgo"*).

---

## 💾 Persistencia Inteligente (Supabase)

Craft.IA trasciende la típica "plantilla de CV web" gracias a su ecosistema de cuentas:

* **Modos Híbridos**: El usuario puede usar la plataforma como invitado (almacenamiento temporal en LocalStorage) o iniciar sesión en cualquier momento (Modales globales) sin perder el progreso.
* **Sincronización en la Nube**: Tras iniciar sesión, todo se unifica con Supabase. Puedes empezar tu CV en el móvil y finalizar su exportación en la computadora.

---

## 🌟 Roadmap a Futuro

- [ ] **Constructor Visual (Drag & Drop)**: Permitir reordenar visualmente las secciones del CV (Experiencia antes que Educación, etc.) utilizando `vuedraggable`.
- [ ] **Sistema de Temas Premium**: Adición de colores corporativos adaptados al perfil visual (Banking Blue, Creative Coral, etc).
- [ ] **Multi-idioma (i18n) Automático**: Traducir un CV completo (Ej: de Español a Inglés Técnico) manteniendo su formato y semántica profesional mediante IA.
- [ ] **Tracking de Versiones (Rollback)**: Sistema git-like para ver los cambios realizados por la IA y revertirlos si no son del agrado del usuario.

---

<div align="center">
  Desarrollado con ❤️ utilizando Vue 3, Gemini AI y Node.js.
</div>