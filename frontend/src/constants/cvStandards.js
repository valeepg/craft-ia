// src/constants/cvStandards.js

export const CV_STANDARDS = {
  harvard: {
    title: "Harvard (Business School Style)",
    subtitle: "Ideal para Finanzas, Consultoría y puestos Ejecutivos",
    useCase: "Búsqueda de empleo en empresas Fortune 500, Banca o MBAs.",
    structure: [
      { id: 'personal', label: 'Datos de Contacto' },
      { id: 'education', label: 'Educación' },
      { id: 'experience', label: 'Experiencia Profesional' },
      { id: 'skills', label: 'Habilidades y Honores' }
    ],
    specs: {
      margins: "2.54 cm",
      font: "Times New Roman",
      fontSize: "11 pt",
      maxPages: "1 página",
      photo: "No permitida",
      requiredLinks: ["LinkedIn"],
      order: "Nombre > Contacto > Educación > Experiencia > Habilidades"
    },
    features: [
      "Optimizado para sistemas ATS",
      "Uso de la Fórmula XYZ para logros",
      "Diseño sobrio sin elementos gráficos",
      "Enfoque en resultados cuantificables"
    ]
  },
  tech: {
    title: "Tech / Software Engineer",
    subtitle: "Diseñado para Desarrolladores y Científicos de Datos",
    useCase: "Startups, Big Tech y roles técnicos.",
    structure: [
      { id: 'personal', label: 'Datos Personales' },
      { id: 'stack', label: 'Stack Tecnológico' },
      { id: 'experience', label: 'Experiencia Técnica' },
      { id: 'projects', label: 'Proyectos y Repositorios' },
      { id: 'education', label: 'Educación' }
    ],
    specs: {
      margins: "2.0 cm",
      font: "Inter",
      fontSize: "10 pt",
      maxPages: "2 páginas",
      photo: "No recomendada",
      requiredLinks: ["GitHub", "LinkedIn", "Portafolio"],
      order: "Nombre > Stack > Experiencia > Proyectos > Educación"
    },
    features: [
      "Segmentación por lenguajes y herramientas",
      "Enlaces directos a código fuente",
      "Resaltado de palabras clave técnicas",
      "Estructura de escaneo rápido"
    ]
  },
  creativo: {
    title: "Creativo / Portafolio",
    subtitle: "Para Diseñadores, Marketing y Publicidad",
    useCase: "Agencias creativas y estudios de diseño.",
    structure: [
      { id: 'personal', label: 'Marca Personal' },
      { id: 'summary', label: 'Perfil Creativo' },
      { id: 'experience', label: 'Trayectoria' },
      { id: 'projects', label: 'Galería de Proyectos' }
    ],
    specs: {
      margins: "Variables",
      font: "Montserrat",
      fontSize: "10 pt",
      maxPages: "2 páginas",
      photo: "Opcional",
      requiredLinks: ["Behance", "Instagram Pro", "Web Personal"],
      order: "Marca Personal > Perfil > Experiencia > Proyectos"
    },
    features: [
      "Diseño visual con identidad propia",
      "Infografías de niveles de software",
      "Espacios para storytelling visual",
      "Estética moderna y limpia"
    ]
  },
  europass: {
    title: "Europass (Estándar Europeo)",
    subtitle: "Para Instituciones Públicas, Becas y Erasmus",
    useCase: "Maestrías en Europa y organismos de la UE.",
    structure: [
      { id: 'personal', label: 'Información Personal' },
      { id: 'experience', label: 'Experiencia Laboral' },
      { id: 'education', label: 'Educación y Formación' },
      { id: 'languages', label: 'Lenguas Extranjeras' },
      { id: 'digital', label: 'Competencias Digitales' }
    ],
    specs: {
      margins: "2.5 cm",
      font: "Arial",
      fontSize: "11 pt",
      maxPages: "2 páginas",
      photo: "Obligatoria",
      requiredLinks: ["LinkedIn", "Skype ID"],
      order: "Datos Personales > Experiencia > Educación > Competencias"
    },
    features: [
      "Formato oficial reconocido en la UE",
      "Marco Común para lenguas extranjeras",
      "Sección de competencias organizativas",
      "Tono académico y formal"
    ]
  }
};