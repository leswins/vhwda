export type Language = "en" | "es"

type Dictionary = Record<string, { en: string; es: string }>

const dict: Dictionary = {
  "brand.name": { en: "VHWDA", es: "VHWDA" },
  "brand.tagline": { en: "Health Careers Catalog", es: "Catálogo de carreras de salud" },
  "app.title": { en: "VHWDA Careers", es: "Carreras VHWDA" },
  "nav.browse": { en: "Browse Careers", es: "Explorar carreras" },
  "nav.quiz": { en: "Career Quiz", es: "Cuestionario" },
  "nav.compare": { en: "Compare", es: "Comparar" },
  "nav.resources": { en: "Resources", es: "Recursos" },
  "nav.language": { en: "Language", es: "Idioma" },
  "header.askAi": { en: "Ask AI", es: "Preguntar a IA" },
  "header.searchA11y": { en: "Search", es: "Buscar" },
  "header.menuA11y": { en: "Menu", es: "Menú" },
  "language.enShort": { en: "EN", es: "EN" },
  "language.esShort": { en: "ES", es: "ES" },
  "language.english": { en: "English", es: "Inglés" },
  "language.spanish": { en: "Español", es: "Español" },
  "home.title": { en: "Explore health careers in Virginia", es: "Explora carreras de salud en Virginia" },
  "home.body": {
    en: "This is the initial scaffold. Content will be powered by Sanity.",
    es: "Este es el andamiaje inicial. El contenido será gestionado en Sanity."
  },
  "browse.title": { en: "Browse Careers", es: "Explorar carreras" },
  "browse.body": { en: "Placeholder page. Will query careers from Sanity.", es: "Página temporal. Consultará carreras desde Sanity." },
  "career.title": { en: "Career Detail", es: "Detalle de carrera" },
  "career.body": { en: "Placeholder page. Will show a career by slug.", es: "Página temporal. Mostrará una carrera por slug." },
  "career.slugLabel": { en: "Slug", es: "Slug" },
  "career.back": { en: "Back", es: "Atrás" },
  "career.compare": { en: "Compare with other careers", es: "Comparar con otras carreras" },
  "career.sections.overview": { en: "Overview", es: "Resumen" },
  "career.sections.responsibilities": { en: "Responsibilities", es: "Responsabilidades" },
  "career.sections.academicRequirements": { en: "Academic Requirements", es: "Requisitos académicos" },
  "career.sections.workEnvironments": { en: "Work Environments", es: "Entornos de trabajo" },
  "career.sections.areasOfSpecialization": { en: "Areas of Specialization", es: "Áreas de especialización" },
  "career.sections.salaryRange": { en: "Salary Range", es: "Rango salarial" },
  "career.sections.educationalPrograms": { en: "Educational Programs", es: "Programas educativos" },
  "career.sections.professionalAssociations": { en: "Professional Associations", es: "Asociaciones profesionales" },
  "career.sections.similarCareers": { en: "Similar Careers", es: "Carreras similares" },
  "career.cta.exploreEducationalPrograms": { en: "Explore educational programs", es: "Explorar programas educativos" },
  "careerHighlight.typicalSalary": { en: "Typical Salary", es: "Salario típico" },
  "careerHighlight.programLength": { en: "Program Length", es: "Duración del programa" },
  "careerHighlight.projectedGrowth": { en: "Projected 10-Year Growth", es: "Crecimiento proyectado a 10 años" },
  "career.map.placeholder": { en: "Map will be added next (Mapbox).", es: "El mapa se agregará a continuación (Mapbox)." },
  "career.map.noToken": {
    en: "Missing Mapbox token. Create apps/web/.env.local with VITE_MAPBOX_TOKEN=… then restart.",
    es: "Falta el token de Mapbox. Crea apps/web/.env.local con VITE_MAPBOX_TOKEN=… y reinicia."
  },
  "career.sectionNavA11y": { en: "Career page sections", es: "Secciones de la página de carrera" },
  "careerCard.typicalVaSalary": { en: "Typical VA Salary", es: "Salario típico en VA" },
  "careerCard.learnMore": { en: "Learn more", es: "Ver más" },
  "career.salary.entryLevel": { en: "Entry Level", es: "Nivel inicial" },
  "career.salary.median": { en: "Median", es: "Mediana" },
  "career.salary.experienced": { en: "Experienced", es: "Con experiencia" },
  "career.loading": { en: "Loading career…", es: "Cargando carrera…" },
  "career.notFound": { en: "Career not found.", es: "No se encontró la carrera." },
  "career.error": { en: "Something went wrong loading this career.", es: "Ocurrió un error al cargar esta carrera." },
  "common.missing": { en: "(missing)", es: "(falta)" },
  "compare.title": { en: "Compare Careers", es: "Comparar carreras" },
  "compare.body": { en: "Placeholder page. Will compare selected careers.", es: "Página temporal. Comparará carreras seleccionadas." },
  "quiz.title": { en: "Career Quiz", es: "Cuestionario" },
  "quiz.body": { en: "Placeholder page. Will guide users to recommended careers.", es: "Página temporal. Recomendará carreras a los usuarios." },
  "resources.title": { en: "Resources", es: "Recursos" },
  "resources.body": { en: "Placeholder page. Will list scholarships and resources.", es: "Página temporal. Listará becas y recursos." },
  "chat.welcome": { en: "Got Questions? The chat Got Answers.", es: "¿Tienes preguntas? Chat tiene respuestas." },
  "chat.placeholder": { en: "Type your message here...", es: "Escribe tu mensaje aquí..." },
  "chat.send": { en: "Send", es: "Enviar" },
  "chat.clear": { en: "Clear", es: "Limpiar" },
  "chat.generating": { en: "Generating response...", es: "Generando respuesta..." },
  "chat.pleaseEnterPrompt": { en: "Please enter a prompt..", es: "Por favor ingresa un mensaje.." },
  "chat.failedToGenerate": { en: "Failed to generate response", es: "Error al generar respuesta" },
  "chat.loadingCareers": {
    en: "Loading career information...",
    es: "Cargando información de carreras...",
  },
  "chat.careersLoaded": {
    en: "Career information loaded. Ready to help!",
    es: "Información de carreras cargada. ¡Listo para ayudar!",
  },
  "chat.apiKeyNotConfigured": {
    en: "API key not configured. Please create a .env file with VITE_GEMINI_API_KEY=your_key_here",
    es: "API key no configurada. Por favor crea un archivo .env con VITE_GEMINI_API_KEY=tu_key_aqui",
  },
  "chat.apiKeyInvalid": {
    en: "Invalid API key. Please check your .env file and restart the server.",
    es: "API key inválida. Por favor verifica tu archivo .env y reinicia el servidor.",
  },
  "a11y.skipToContent": { en: "Skip to content", es: "Saltar al contenido" },

  "footer.heading.explore": { en: "Explore", es: "Explorar" },
  "footer.heading.helpTools": { en: "Help & Tools", es: "Ayuda y herramientas" },
  "footer.link.home": { en: "Home", es: "Inicio" },
  "footer.link.browseCareers": { en: "Browse careers", es: "Explorar carreras" },
  "footer.link.findCareer": { en: "Find your career", es: "Encuentra tu carrera" },
  "footer.link.resources": { en: "Resources", es: "Recursos" },
  "footer.link.scholarship": { en: "Scholarship", es: "Becas" },
  "footer.link.compareCareers": { en: "Compare careers", es: "Comparar carreras" },
  "footer.link.glossary": { en: "Glossary", es: "Glosario" },
  "footer.link.contact": { en: "Contact", es: "Contacto" },
  "footer.about": {
    en: "The Virginia Health Workforce Development Authority (VHWDA) strengthens Virginia’s healthcare workforce by aligning education, training, and employment resources with industry needs.",
    es: "La Autoridad para el Desarrollo de la Fuerza Laboral de Salud de Virginia (VHWDA) fortalece la fuerza laboral de salud de Virginia al alinear educación, capacitación y recursos de empleo con las necesidades de la industria."
  },
  "footer.address": { en: "7818 E. Parham Road, Richmond, VA 23294", es: "7818 E. Parham Road, Richmond, VA 23294" }
}

export type TranslationKey = keyof typeof dict

export function t(language: Language, key: TranslationKey): string {
  return dict[key][language]
}


