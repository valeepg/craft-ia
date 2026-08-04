// src/constants/cvStandards.js

export const CV_STANDARDS = {
  harvard: {
    title: "Harvard (Business / Corporate Style)",
    subtitle: "Ideal para Finanzas, Consultoría, Dirección y puestos Ejecutivos",
    useCase: "Empresas Fortune 500, Banca de Inversión, MBAs y selección ATS automatizada.",
    structure: [
      { id: 'personal', label: 'Datos de Contacto' },
      { id: 'summary', label: 'Resumen Ejecutivo' },
      { id: 'experience', label: 'Experiencia Profesional' },
      { id: 'education', label: 'Educación y Certificaciones' },
      { id: 'skills', label: 'Habilidades y Liderazgo' }
    ],
    specs: {
      margins: "2.54 cm",
      font: "Times New Roman",
      fontSize: "11 pt",
      maxPages: "1 página",
      photo: "Sin Foto (ATS Ultra-Clean Monocromático)",
      icons: "Sin iconos ni barras de nivel",
      requiredLinks: ["LinkedIn"],
      order: "Contacto > Resumen > Experiencia > Educación > Habilidades"
    },
    features: [
      "100% Monocromático tradicional de máxima legibilidad ATS",
      "Fórmula XYZ de Google obligatoria en cada logro cuantificable",
      "Formato ejecutivo sobrio sin distracciones visuales",
      "Optimizado para filtros automáticos de corporativos globales"
    ]
  },
  tech: {
    title: "Tech / Software Engineer",
    subtitle: "Diseñado para Desarrolladores, Data Engineers y DevOps",
    useCase: "Startups Tech, Big Tech (FAANG/MAMAA) y roles de Ingeniería.",
    structure: [
      { id: 'personal', label: 'Datos Personales' },
      { id: 'stack', label: 'Stack Tecnológico' },
      { id: 'experience', label: 'Experiencia Técnica' },
      { id: 'projects', label: 'Proyectos Destacados (GitHub/Demo)' },
      { id: 'education', label: 'Educación y Certificaciones Tech' }
    ],
    specs: {
      margins: "1.5 cm a 2.0 cm (Máximo aprovechamiento)",
      font: "Inter / Roboto Mono",
      fontSize: "10 pt",
      maxPages: "1 página (<8 años de experiencia)",
      photo: "No permitida (Formato ATS)",
      stackFormat: "Agrupado: Lenguajes | Frameworks/Librerías | Cloud/DB/DevOps",
      requiredProjects: "Nombre del Proyecto | Tecnologías | Enlace (GitHub/Demo)",
      requiredLinks: ["GitHub", "LinkedIn", "Portafolio Web"],
      order: "Contacto > Stack Tecnológico > Experiencia > Proyectos > Educación"
    },
    features: [
      "Stack clasificado obligatoriamente por categorías técnicas",
      "Proyectos estructurados con métricas y enlaces directos a código/demo",
      "Máximo aprovechamiento de espacio en exactamente 1 página",
      "Escaneo ultrarrápido para Tech Recruiters y parsers ATS"
    ]
  },
  creativo: {
    title: "Creativo / Portafolio",
    subtitle: "Para Diseñadores UI/UX, Product Designers y Marketing Digital",
    useCase: "Agencias creativas, estudios de diseño y startups de producto.",
    structure: [
      { id: 'personal', label: 'Marca Personal & Enlaces' },
      { id: 'summary', label: 'Perfil Creativo / Bio' },
      { id: 'projects', label: 'Portafolio & Casos de Estudio' },
      { id: 'experience', label: 'Trayectoria Profesional' },
      { id: 'skills', label: 'Herramientas de Diseño & UX' }
    ],
    specs: {
      margins: "1.8 cm",
      font: "Montserrat / Outfit",
      fontSize: "10 pt",
      maxPages: "1 a 2 páginas",
      photo: "Opcional / Avatar profesional",
      requiredLinks: ["Behance", "Dribbble", "Figma", "Portafolio Web"],
      order: "Marca Personal > Perfil > Portafolio > Experiencia > Herramientas"
    },
    features: [
      "Enlaces destacados a Behance, Dribbble, Figma o Portafolio Web",
      "Estructura visual enfocada en casos de estudio y entregables",
      "Acento visual moderno manteniendo legibilidad impecable",
      "Presentación atractiva de competencias UX/UI y herramientas"
    ]
  },
  europass: {
    title: "Europass (Estándar Europeo)",
    subtitle: "Estructura Oficial para Becas, Erasmus y Sector Público Internacional",
    useCase: "Maestrías en Europa, programa Erasmus+, Organizaciones Internacionales y Sector Público.",
    structure: [
      { id: 'personal', label: 'Información Personal' },
      { id: 'education', label: 'Educación y Formación Académica' },
      { id: 'experience', label: 'Experiencia Laboral y Voluntariado' },
      { id: 'languages', label: 'Competencias Lingüísticas (CEFR)' },
      { id: 'digital', label: 'Competencias Digitales e Investigación' }
    ],
    specs: {
      margins: "2.5 cm",
      font: "Arial / Helvetica",
      fontSize: "10.5 pt",
      maxPages: "1 a 2 páginas",
      photo: "Opcional según país de la UE",
      requiredLinks: ["LinkedIn", "ORCID / Google Scholar"],
      order: "Contacto > Educación > Experiencia > Idiomas (CEFR) > Competencias"
    },
    features: [
      "Adaptado para convocatorias de becas internacionales y Erasmus",
      "Evaluación estandarizada de idiomas según el Marco Común Europeo (CEFR)",
      "Formato formal reconocido en toda la Unión Europea",
      "Énfasis en trayectoria académica, reconocimientos y publicaciones"
    ]
  }
};