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
  "home.hero.title": { en: "Discover your health career in Virginia", es: "Descubre tu carrera de salud en Virginia" },
  "home.hero.subtitle": {
    en: "Clear, up-to-date steps on education, salary, demand, and programs so you can choose work that matters.",
    es: "Pasos claros y actualizados sobre educación, salario, demanda y programas para que puedas elegir un trabajo que importe."
  },
  "home.hero.primaryCTA": { en: "Find your path", es: "Encuentra tu camino" },
  "home.hero.secondaryCTA": { en: "Explore careers", es: "Explorar carreras" },
  "home.hero.browseCTA": { en: "Browse careers", es: "Explorar carreras" },
  "home.hero.quizCTA": { en: "Take the quiz", es: "Hacer el cuestionario" },
  "home.steps.heading": { en: "Start with these steps", es: "Empieza con estos pasos" },
  "home.steps.quiz.title": { en: "Take the career finder quiz", es: "Haz el cuestionario para encontrar tu carrera" },
  "home.steps.quiz.description": {
    en: "A quick quiz that points you to roles that fit your goals and schedule.",
    es: "Un breve cuestionario que te guía hacia roles que se ajustan a tus metas y horario."
  },
  "home.steps.browse.title": { en: "Browse & compare careers", es: "Explora y compara carreras" },
  "home.steps.browse.description": {
    en: "Filter and compare careers by salary, education, program length, and outlook.",
    es: "Filtra y compara carreras por salario, educación, duración del programa y perspectiva."
  },
  "home.steps.plan.title": { en: "Plan your next steps", es: "Planifica tus próximos pasos" },
  "home.steps.plan.description": {
    en: "Find programs, prerequisites, and scholarships in Virginia to get started.",
    es: "Encuentra programas, prerrequisitos y becas en Virginia para comenzar."
  },
  "home.catalogBanner.left": {
    en: "Virginia Health Workforce Development Authority",
    es: "Autoridad de Desarrollo de la Fuerza Laboral de Salud de Virginia"
  },
  "home.catalogBanner.right": { en: "Health Careers Catalog", es: "Catalogo de carreras de salud" },
  "home.catalogHighlights.careers.title": { en: "+120 Health Careers", es: "+120 Carreras de salud" },
  "home.catalogHighlights.careers.description": {
    en: "Jargon-free summaries for every role.",
    es: "Resumenes sin jerga para cada rol."
  },
  "home.catalogHighlights.updated.title": { en: "Updated regularly", es: "Actualizado con regularidad" },
  "home.catalogHighlights.updated.description": {
    en: "Fresh salary, education, and demand data.",
    es: "Datos recientes de salario, educacion y demanda."
  },
  "home.catalogHighlights.local.title": { en: "Built for Virginians", es: "Creado para virginianos" },
  "home.catalogHighlights.local.description": {
    en: "Programs, schools, and more in your region.",
    es: "Programas, escuelas y mas en tu region."
  },
  "home.featuredCareers.title": { en: "Featured Careers", es: "Carreras destacadas" },
  "home.featuredCareers.viewAll": { en: "View all careers", es: "Ver todas las carreras" },
  "home.featuredCareers.kicker": { en: "Featured Careers", es: "Carreras destacadas" },
  "home.featuredCareers.headline": { en: "Start fast, grow over time", es: "Empieza rapido, crece con el tiempo" },
  "home.featuredCareers.ctaExplore": { en: "Explore all careers", es: "Explora todas las carreras" },
  "home.featuredCareers.ctaFind": { en: "Find your career", es: "Encuentra tu carrera" },
  "home.quizSection.left.title": { en: "Career Discovery Quiz", es: "Cuestionario de descubrimiento de carreras" },
  "home.quizSection.left.cta": { en: "Start the quiz", es: "Empezar el cuestionario" },
  "home.quizSection.right.kicker": { en: "FIND YOUR CAREER", es: "ENCUENTRA TU CARRERA" },
  "home.quizSection.right.title": { en: "Not sure where to start? Take the quiz.", es: "¿No estás seguro de por dónde empezar? Haz el cuestionario." },
  "home.quizSection.right.description": {
    en: "Answer a few questions. We'll suggest careers that fit your interests, training goals, and timeline—then email you the results.",
    es: "Responde a unas preguntas. Te sugeriremos carreras que se ajusten a tus intereses, objetivos de formación y cronograma—luego te enviaremos los resultados por correo electrónico."
  },
  "home.quizSection.right.estimate": { en: "Est. time to complete: 5 minutes", es: "Tiempo estimado para completar: 5 minutos" },
  "home.sections.explore.title": { en: "Explore your options", es: "Explora tus opciones" },
  "home.sections.explore.browse.title": { en: "Explore the catalog", es: "Explora el catálogo" },
  "home.sections.explore.browse.description": {
    en: "Find in-depth information about roles, salaries, and training programs.",
    es: "Encuentra información detallada sobre roles, salarios y programas de capacitación."
  },
  "home.sections.explore.quiz.title": { en: "Find your match", es: "Encuentra tu pareja ideal" },
  "home.sections.explore.quiz.description": {
    en: "Take a quick quiz to discover which healthcare careers align with your interests.",
    es: "Responde un breve cuestionario para descubrir qué carreras de salud se alinean con tus intereses."
  },
  "home.sections.explore.resources.title": { en: "Plan your path", es: "Planifica tu camino" },
  "home.sections.explore.resources.description": {
    en: "Access scholarships, training programs, and professional resources in Virginia.",
    es: "Accede a becas, programas de capacitación y recursos profesionales en Virginia."
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
  "career.cta.searchForCareer": { en: "Search for a specific career", es: "Buscar una carrera específica" },
  "careerHighlight.typicalSalary": { en: "Typical Salary", es: "Salario típico" },
  "careerHighlight.programLength": { en: "Program Length", es: "Duración del programa" },
  "careerHighlight.projectedGrowth": { en: "Projected 10-Year Growth", es: "Crecimiento proyectado a 10 años" },
  "career.map.placeholder": { en: "Map will be added next (Mapbox).", es: "El mapa se agregará a continuación (Mapbox)." },
  "career.map.noToken": {
    en: "Missing Mapbox token. Create apps/web/.env.local with VITE_MAPBOX_TOKEN=… then restart.",
    es: "Falta el token de Mapbox. Crea apps/web/.env.local con VITE_MAPBOX_TOKEN=… y reinicia."
  },
  "career.sectionNavA11y": { en: "Career page sections", es: "Secciones de la página de carrera" },
  "careerCard.typicalVaSalary": { en: "Typical Salary", es: "Salario típico" },
  "careerCard.learnMore": { en: "Learn more", es: "Ver más" },
  "career.salary.entryLevel": { en: "Entry Level", es: "Nivel inicial" },
  "career.salary.median": { en: "Median", es: "Mediana" },
  "career.salary.experienced": { en: "Experienced", es: "Con experiencia" },
  "career.loading": { en: "Loading career…", es: "Cargando carrera…" },
  "career.notFound": { en: "Career not found.", es: "No se encontró la carrera." },
  "career.error": { en: "Something went wrong loading this career.", es: "Ocurrió un error al cargar esta carrera." },
  "common.missing": { en: "(missing)", es: "(falta)" },
  "compare.title": { en: "Compare Careers", es: "Comparar carreras" },
  "compare.title.comparing": { en: "Comparing {count} career", es: "Comparando {count} carrera" },
  "compare.title.comparingPlural": { en: "Comparing {count} careers", es: "Comparando {count} carreras" },
  "compare.body": { en: "Placeholder page. Will compare selected careers.", es: "Página temporal. Comparará carreras seleccionadas." },
  "compare.addCareer": { en: "Add Career", es: "Agregar carrera" },
  "compare.searchPlaceholder": { en: "Search for a specific career", es: "Buscar una carrera específica" },
  "compare.sections.dayToDay": { en: "Day-to-Day", es: "Día a día" },
  "compare.sections.overview": { en: "Overview", es: "Resumen" },
  "compare.sections.salaryDetails": { en: "Salary Details", es: "Detalles salariales" },
  "compare.sections.academicRequirements": { en: "Academic Requirements", es: "Requisitos académicos" },
  "compare.sections.jobOutlook": { en: "Job Outlook", es: "Perspectiva laboral" },
  "compare.sections.responsibilities": { en: "Responsibilities", es: "Responsabilidades" },
  "compare.sections.workEnvironments": { en: "Work Environments", es: "Entornos de trabajo" },
  "compare.sections.areasOfSpecialization": { en: "Areas of Specialization", es: "Áreas de especialización" },
  "compare.addCareerToCompare": { en: "Add a career to compare", es: "Agrega una carrera para comparar" },
  "compare.medianSalary": { en: "Median Salary", es: "Salario mediano" },
  "compare.salaryRange": { en: "Entry Level - Experienced", es: "Nivel inicial - Con experiencia" },
  "compare.projectedGrowth": { en: "Projected 10-Year Growth", es: "Crecimiento proyectado a 10 años" },
  "compare.noCareersFound": { en: "No careers found", es: "No se encontraron carreras" },
  "compare.startTyping": { en: "Start typing to search careers...", es: "Comienza a escribir para buscar carreras..." },
  "search.title": { en: "Browse Careers", es: "Explorar carreras" },
  "search.subtitle": { en: "Explore health careers in Virginia", es: "Explora carreras de salud en Virginia" },
  "search.placeholder": { en: "Search careers...", es: "Buscar carreras..." },
  "search.showing": { en: "Showing {count} careers", es: "Mostrando {count} carreras" },
  "search.showingPlural": { en: "Showing {count} careers", es: "Mostrando {count} carreras" },
  "search.noCareers": { en: "No careers found", es: "No se encontraron carreras" },
  "search.compareCareers": { en: "Compare careers", es: "Comparar carreras" },
  "filters.careerGroup": { en: "Career Group", es: "Grupo de carreras" },
  "filters.requiredEducation": { en: "Required Education", es: "Educación requerida" },
  "filters.salaryRange": { en: "Salary Range", es: "Rango salarial" },
  "filters.minSalary": { en: "Min", es: "Mín" },
  "filters.maxSalary": { en: "Max", es: "Máx" },
  "filters.jobOutlook": { en: "Job Outlook", es: "Perspectiva laboral" },
  "filters.workEnvironment": { en: "Work Environment", es: "Entorno de trabajo" },
  "filters.patientInteraction": { en: "Patient Interaction Level", es: "Nivel de interacción con pacientes" },
  "filters.areasOfSpecialization": { en: "Areas of Specialization", es: "Áreas de especialización" },
  "filters.yes": { en: "Yes", es: "Sí" },
  "filters.no": { en: "No", es: "No" },
  "filters.comingSoon": { en: "Coming soon", es: "Próximamente" },
  "quiz.title": { en: "Career Discovery Quiz", es: "Cuestionario de Descubrimiento de Carreras" },
  "quiz.body": { en: "Placeholder page. Will guide users to recommended careers.", es: "Página temporal. Recomendará carreras a los usuarios." },
  "resources.title": { en: "Resources", es: "Recursos" },
  "resources.body": { en: "Placeholder page. Will list scholarships and resources.", es: "Página temporal. Listará becas y recursos." },
  "chat.placeholder": { en: "Ask about careers, salaries, education...", es: "Pregunta sobre carreras, salarios, educación..." },
  "chat.send": { en: "Send", es: "Enviar" },
  "chat.clear": { en: "Clear", es: "Limpiar" },
  "chat.generating": { en: "Generating response...", es: "Generando respuesta..." },
  "chat.pleaseEnterPrompt": { en: "Please enter a prompt..", es: "Por favor ingresa un mensaje.." },
  "chat.error": {
    en: "Sorry, something went wrong. Please try again later.",
    es: "Lo siento, algo salió mal. Por favor intenta de nuevo más tarde.",
  },
  "chat.loadingCareers": {
    en: "Loading career information...",
    es: "Cargando información de carreras...",
  },
  "chat.selectOrEnterPrompt": {
    en: "SELECT OR ENTER A PROMPT",
    es: "SELECCIONA O INGRESA UN MENSAJE",
  },
  "chat.prompts.findCareers": {
    en: "I'm interested in careers that include",
    es: "Estoy interesado en carreras que incluyan",
  },
  "chat.prompts.findCareers.title": { en: "Find careers", es: "Buscar carreras" },
  "chat.prompts.findCareers.subtitle": {
    en: "Search by interest or skills",
    es: "Buscar por interés o habilidades",
  },
  "chat.prompts.compareSalaries": {
    en: "Compare salaries for different careers",
    es: "Comparar salarios de diferentes carreras",
  },
  "chat.prompts.compareSalaries.title": { en: "Compare Salaries", es: "Comparar Salarios" },
  "chat.prompts.compareSalaries.subtitle": {
    en: "See earning potential",
    es: "Ver potencial de ingresos",
  },
  "chat.prompts.educationPaths": {
    en: "What education paths are available?",
    es: "¿Qué caminos educativos están disponibles?",
  },
  "chat.prompts.educationPaths.title": { en: "Education paths", es: "Caminos educativos" },
  "chat.prompts.educationPaths.subtitle": {
    en: "Learn requirements",
    es: "Conocer requisitos",
  },
  "chat.prompts.jobOutlook": {
    en: "What is the job outlook for health careers?",
    es: "¿Cuál es la perspectiva laboral para carreras de salud?",
  },
  "chat.prompts.jobOutlook.title": { en: "Job Outlook", es: "Perspectiva Laboral" },
  "chat.prompts.jobOutlook.subtitle": {
    en: "Check demand",
    es: "Ver demanda",
  },
  "chat.prompts.careerTransitions": {
    en: "Help me transition to a health career",
    es: "Ayúdame a hacer la transición a una carrera de salud",
  },
  "chat.prompts.careerTransitions.title": { en: "Career transitions", es: "Transiciones de carrera" },
  "chat.prompts.careerTransitions.subtitle": {
    en: "Change careers",
    es: "Cambiar de carrera",
  },
  "chat.prompts.quickStart": {
    en: "Show me fast-track health careers",
    es: "Muéstrame carreras de salud de inicio rápido",
  },
  "chat.prompts.quickStart.title": { en: "Quick start", es: "Inicio rápido" },
  "chat.prompts.quickStart.subtitle": {
    en: "Fast-track careers",
    es: "Carreras de inicio rápido",
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
  "footer.address": { en: "7818 E. Parham Road, Richmond, VA 23294", es: "7818 E. Parham Road, Richmond, VA 23294" },
  "planNextSteps.title": { en: "Plan Your Next Steps", es: "Planifica tus próximos pasos" },
  "planNextSteps.description": {
    en: "Find programs, prerequisites, and scholarships in Virginia to get started.",
    es: "Encuentra programas, prerrequisitos y becas en Virginia para comenzar."
  },
  "planNextSteps.card.scholarships.title": {
    en: "Scholarships & Financial Aid",
    es: "Becas y Ayuda Financiera"
  },
  "planNextSteps.card.scholarships.description": {
    en: "Explore federal aid and Virginia options like G3.",
    es: "Explora ayuda federal y opciones de Virginia como G3."
  },
  "planNextSteps.card.professionalOrganizations.title": {
    en: "Professional Organizations",
    es: "Organizaciones Profesionales"
  },
  "planNextSteps.card.professionalOrganizations.description": {
    en: "Join networks that support your field.",
    es: "Únete a redes que apoyan tu campo."
  },
  "planNextSteps.card.schoolsPrerequisites.title": {
    en: "Schools & Prerequisites",
    es: "Escuelas y Prerrequisitos"
  },
  "planNextSteps.card.schoolsPrerequisites.description": {
    en: "Find accredited programs in Virginia.",
    es: "Encuentra programas acreditados en Virginia."
  },
  "home.shortcuts.heading": {
    en: "Shortcuts to the most common tasks",
    es: "Accesos directos a las tareas más comunes"
  },
  "home.shortcuts.browse.title": {
    en: "Browse all careers",
    es: "Ver todas las carreras"
  },
  "home.shortcuts.browse.description": {
    en: "Filter by salary, education, job outlook, and program length.",
    es: "Filtra por salario, educación, perspectiva laboral y duración del programa."
  },
  "home.shortcuts.compare.title": {
    en: "Compare careers",
    es: "Comparar carreras"
  },
  "home.shortcuts.compare.description": {
    en: "See requirements and salary side-by-side.",
    es: "Ver requisitos y salarios lado a lado."
  },
  "filters.search": { en: "Filter", es: "Filtrar" },
  "filters.currentStage": { en: "Current Stage", es: "Etapa Actual" },
  "filters.currentStage.highSchool": { en: "High School Student", es: "Estudiante de Secundaria" },
  "filters.currentStage.college": { en: "College Student", es: "Estudiante Universitario" },
  "filters.currentStage.graduate": { en: "Graduate Student", es: "Estudiante de Posgrado" },
  "filters.currentStage.workingProfessional": {
    en: "Working Professional",
    es: "Profesional en Activo"
  },
  "filters.currentStage.veteranMilitary": { en: "Veteran, Military", es: "Veterano, Militar" },
  "filters.currentStage.adultReturning": {
    en: "Adult Returning to School",
    es: "Adulto que Regresa a la Escuela"
  },
  "filters.fundingType": { en: "Funding Type", es: "Tipo de Financiamiento" },
  "filters.locationScope": { en: "Location & Scope", es: "Ubicación y Alcance" },
  "filters.careerArea": { en: "Career Area", es: "Área de Carrera" },
  "filters.membershipType": { en: "Membership Type", es: "Tipo de Membresía" },
  "filters.membershipType.student": { en: "Student", es: "Estudiante" },
  "filters.membershipType.professional": { en: "Professional", es: "Profesional" },
  "filters.membershipType.employer": { en: "Employer", es: "Empleador" },
  "filters.geographicFocus": { en: "Geographic Focus", es: "Enfoque Geográfico" },
  "common.visitSite": { en: "Visit Site", es: "Visitar Sitio" },

  // Quiz-specific translations
  "quiz.section.interestsValues": { en: "Interests & Values", es: "Intereses y Valores" },
  "quiz.section.skillsAptitudes": { en: "Skills & Aptitudes", es: "Habilidades y Aptitudes" },
  "quiz.section.workEnvironment": { en: "Work Environment", es: "Ambiente de Trabajo" },
  "quiz.section.scheduleLifestyle": { en: "Schedule & Lifestyle", es: "Horario y Estilo de Vida" },
  "quiz.section.educationPath": { en: "Education Path", es: "Camino Educativo" },
  "quiz.section.salaryOutlook": { en: "Salary & Outlook", es: "Salario y Perspectiva" },
  "quiz.section.careerFeatures": { en: "Career Features", es: "Características de Carrera" },
  "quiz.section.dealBreakers": { en: "Deal-breakers", es: "Factores Decisivos" },
  "quiz.adjustSlider": { en: "Adjust the slider to set your preference", es: "Ajusta el control deslizante para establecer tu preferencia" },
  "quiz.isDealbreaker": { en: "Is this a deal breaker?", es: "¿Es esto un factor decisivo?" },
  "quiz.yes": { en: "Yes", es: "Sí" },
  "quiz.no": { en: "No", es: "No" },
  "quiz.back": { en: "Back", es: "Atrás" },
  "quiz.nextQuestion": { en: "Next Question", es: "Siguiente Pregunta" },
  "quiz.submitAnswers": { en: "Submit Answers", es: "Enviar Respuestas" },
  "quiz.showVector": { en: "Show Debug Vector", es: "Mostrar Vector de Depuración" },
  "quiz.vectorTitle": { en: "Current Vector (Debug)", es: "Vector Actual (Depuración)" },
  "quiz.calculatingTitle": { en: "We're calculating your top career matches", es: "Estamos calculando tus mejores coincidencias de carrera" },
  "quiz.calculatingSubtitle": { en: "Hang tight while we work our magic...", es: "Espera mientras trabajamos nuestra magia..." }
}

export type TranslationKey = keyof typeof dict

export function t(language: Language, key: TranslationKey): string {
  return dict[key][language]
}


