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
  "header.closeAiChat": { en: "Close AI Chat", es: "Cerrar chat de IA" },
  "header.searchA11y": { en: "Search", es: "Buscar" },
  "header.menuA11y": { en: "Menu", es: "Menú" },
  "header.searchCloseA11y": { en: "Close search", es: "Cerrar búsqueda" },
  "header.selectAPage": { en: "Select a page", es: "Selecciona una página" },
  "header.menu.home": { en: "Home", es: "Inicio" },
  "header.menu.quiz": { en: "Quiz", es: "Cuestionario" },
  "header.menu.careers": { en: "Careers", es: "Carreras" },
  "header.menu.resources": { en: "Resources", es: "Recursos" },
  "header.menu.about": { en: "About", es: "Acerca de" },
  "header.searchFieldA11y": { en: "Search input", es: "Campo de búsqueda" },
  "header.searchPlaceholder": {
    en: "Search for a career, keyword, organization, etc.",
    es: "Buscar una carrera, palabra clave, organización, etc."
  },
  "header.searchPrompt": { en: "Start typing to search.", es: "Empieza a escribir para buscar." },
  "header.searchLoading": { en: "Loading search results…", es: "Cargando resultados de búsqueda…" },
  "header.noResults": {
    en: "No results found. Try searching something else.",
    es: "No se encontraron resultados. Prueba buscando otra cosa."
  },
  "header.searchTypeCareer": { en: "Career", es: "Carrera" },
  "header.searchTypeScholarship": { en: "Scholarship", es: "Beca" },
  "header.searchTypeOrganization": { en: "Organization", es: "Organización" },
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
  "search.quizCTA": { en: "Take the Career Quiz", es: "Hacer el cuestionario de carrera" },
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
  "compare.subtitle": { en: "Get a side-by-side comparison of any careers", es: "Obtén una comparación lado a lado de cualquier carrera" },
  "compare.title.comparing": { en: "Comparing {count} career", es: "Comparando {count} carrera" },
  "compare.title.comparingPlural": { en: "Comparing {count} careers", es: "Comparando {count} carreras" },
  "compare.body": { en: "Placeholder page. Will compare selected careers.", es: "Página temporal. Comparará carreras seleccionadas." },
  "compare.category": { en: "Career", es: "Carrera" },
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
  "compare.noResults": { en: "No results. Try searching for a different career.", es: "Sin resultados. Intenta buscar una carrera diferente." },
  "compare.startTyping": { en: "Start typing to search careers...", es: "Comienza a escribir para buscar carreras..." },
  "search.title": { en: "Browse Careers", es: "Explorar carreras" },
  "search.subtitle": { en: "Explore health careers in Virginia", es: "Explora carreras de salud en Virginia" },
  "search.placeholder": { en: "Search careers...", es: "Buscar carreras..." },
  "search.showing": { en: "Showing {count} careers", es: "Mostrando {count} carreras" },
  "search.showingPlural": { en: "Showing {count} careers", es: "Mostrando {count} carreras" },
  "search.noCareers": { en: "No careers found", es: "No se encontraron carreras" },
  "search.compareCareers": { en: "Compare careers", es: "Comparar carreras" },
  "search.compare": { en: "Compare", es: "Comparar" },
  "search.careers": { en: "Careers", es: "Carreras" },
  "search.career": { en: "Career", es: "Carrera" },
  "filters.filter": { en: "Filter", es: "Filtrar" },
  "filters.sort": { en: "Sort", es: "Ordenar" },
  "filters.careerGroup": { en: "Career Group", es: "Grupo de carreras" },
  "filters.requiredEducation": { en: "Required Education", es: "Educación requerida" },
  "filters.salaryRange": { en: "Salary Range", es: "Rango salarial" },
  "filters.minSalary": { en: "Min", es: "Mín" },
  "filters.maxSalary": { en: "Max", es: "Máx" },
  "filters.jobOutlook": { en: "Job Outlook", es: "Perspectiva laboral" },
  "filters.workEnvironment": { en: "Work Environment", es: "Entorno de trabajo" },
  "filters.patientInteraction": { en: "Patient Interaction", es: "Interacción con pacientes" },
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
  "chat.careerAssistant": { en: "Career Assistant", es: "Asistente de Carreras" },
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
  "footer.link.about": { en: "About", es: "Acerca de" },
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
  "quiz.calculating.title": { en: "We're calculating your top career matches", es: "Estamos calculando tus mejores coincidencias de carrera" },
  "quiz.calculating.subtitle": { en: "Hang tight while we work our magic...", es: "Espera mientras trabajamos nuestra magia..." },
  "quiz.sidebar.title": { en: "Career Discovery Quiz", es: "Cuestionario de Descubrimiento de Carreras" },
  "quiz.complete.title": { en: "HEALTH CAREERS CATALOG", es: "CATÁLOGO DE CARRERAS DE SALUD" },
  "quiz.complete.message": { en: "Complete the quiz to discover careers for you", es: "Completa el cuestionario para descubrir carreras para ti" },
  "quiz.calculatingTitle": { en: "We're calculating your top career matches", es: "Estamos calculando tus mejores coincidencias de carrera" },
  "quiz.calculatingSubtitle": { en: "Hang tight while we work our magic...", es: "Espera mientras trabajamos nuestra magia..." },
  "quiz.results.topMatches": { en: "Your Top Matches", es: "Tus Mejores Coincidencias" },
  "quiz.results.otherMatches": { en: "Other Strong Matches", es: "Otras Coincidencias Fuertes" },
  "quiz.results.retake": { en: "Retake Quiz", es: "Volver a Hacer el Cuestionario" },
  "quiz.results.searchPlaceholder": { en: "Search for a specific career", es: "Buscar una carrera específica" },

  // About page translations
  "about.kicker": { en: "About the health careers catalog", es: "Acerca del catálogo de carreras de salud" },
  "about.title": { en: "A resource to explore health careers in Virginia.", es: "Un recurso para explorar carreras de salud en Virginia." },
  "about.sectionNavA11y": { en: "About page sections", es: "Secciones de la página Acerca de" },

  "about.sections.aboutVhwda": { en: "About VHWDA", es: "Acerca de VHWDA" },
  "about.sections.dataSources": { en: "Data Sources", es: "Fuentes de Datos" },
  "about.sections.quizMethodology": { en: "Quiz Methodology", es: "Metodología del Cuestionario" },
  "about.sections.aiFeatures": { en: "AI Features Disclosure", es: "Divulgación de Características de IA" },
  "about.sections.updateCadence": { en: "Update Cadence & Feedback", es: "Frecuencia de Actualización y Comentarios" },

  "about.aboutVhwda.heading": {
    en: "The Virginia Health Workforce Development Authority (VHWDA) strengthens Virginia's healthcare workforce by aligning education, training, and employment resources with industry needs.",
    es: "La Autoridad para el Desarrollo de la Fuerza Laboral de Salud de Virginia (VHWDA) fortalece la fuerza laboral de salud de Virginia al alinear los recursos de educación, capacitación y empleo con las necesidades de la industria."
  },
  "about.aboutVhwda.paragraph": {
    en: "The Health Careers Catalog is part of VHWDA's work to support a strong, resilient healthcare workforce across the Commonwealth. This site helps students, career changers, educators, and advisors explore health careers, compare pathways, and find relevant programs and professional resources. VHWDA and partners periodically update the catalog so information stays useful as education options and workforce needs evolve.",
    es: "El Catálogo de Carreras de Salud es parte del trabajo de VHWDA para apoyar una fuerza laboral de atención médica sólida y resiliente en todo el Commonwealth. Este sitio ayuda a estudiantes, personas que cambian de carrera, educadores y asesores a explorar carreras de salud, comparar caminos y encontrar programas y recursos profesionales relevantes. VHWDA y sus socios actualizan periódicamente el catálogo para que la información siga siendo útil a medida que evolucionan las opciones educativas y las necesidades de la fuerza laboral."
  },

  "about.aiFeatures.item3": {
    en: "Data Verification: All salary figures, education requirements, and job outlook data come directly from authoritative sources and are not AI-generated",
    es: "Verificación de Datos: Todas las cifras salariales, requisitos educativos y datos de perspectiva laboral provienen directamente de fuentes autorizadas y no son generados por IA"
  },
  "about.aiFeatures.item4": {
    en: "Continuous Improvement: We regularly review and update AI-assisted features to ensure accuracy, fairness, and usefulness for all users",
    es: "Mejora Continua: Revisamos y actualizamos regularmente las características asistidas por IA para garantizar precisión, equidad y utilidad para todos los usuarios"
  },

  "about.dataSources.careerInfo.title": { en: "Career information", es: "Información de carrera" },
  "about.dataSources.careerInfo.description": {
    en: "Career pages summarize responsibilities, work environment, education requirements, and related details based on the Health Careers Catalog content and partner-provided references. Content is maintained through an internal content management system so it can be reviewed and updated over time.",
    es: "Las páginas de carrera resumen las responsabilidades, el entorno laboral, los requisitos educativos y los detalles relacionados según el contenido del Catálogo de Carreras de Salud y las referencias proporcionadas por los socios. El contenido se mantiene a través de un sistema interno de gestión de contenidos para que pueda ser revisado y actualizado con el tiempo."
  },
  "about.dataSources.salaryOutlook.title": { en: "Salary and job outlook", es: "Salario y perspectiva laboral" },
  "about.dataSources.salaryOutlook.description": {
    en: "Salary and outlook fields are populated primarily using Virginia Works workforce datasets where roles can be reliably matched. When a role does not map cleanly to a dataset category, values may be added or refined manually after review.",
    es: "Los campos de salario y perspectivas se completan principalmente utilizando conjuntos de datos de la fuerza laboral de Virginia Works donde los roles se pueden combinar de manera confiable. Cuando un rol no se asigna claramente a una categoría de conjunto de datos, los valores se pueden agregar o refinar manualmente después de la revisión."
  },
  "about.dataSources.educationPrograms.title": { en: "Education programs", es: "Programas de educación" },
  "about.dataSources.educationPrograms.description": {
    en: "Education programs listed on the site reflect cataloged Virginia-based programs and training opportunities. Program links take you to external school or program websites, which may change independently of this site.",
    es: "Los programas educativos enumerados en el sitio reflejan programas y oportunidades de capacitación catalogados con sede en Virginia. Los enlaces del programa lo llevan a sitios web externos de escuelas o programas, que pueden cambiar independientemente de este sitio."
  },
  "about.dataSources.profOrgs.title": { en: "Professional organizations", es: "Organizaciones profesionales" },
  "about.dataSources.profOrgs.description": {
    en: "Professional organizations are included to help users learn more about standards, continuing education, and career communities. Organization listings are associated to careers and include outbound links for the most current information.",
    es: "Se incluyen organizaciones profesionales para ayudar a los usuarios a aprender más sobre estándares, educación continua y comunidades profesionales. Los listados de organizaciones están asociados a carreras e incluyen enlaces externos para obtener la información más actualizada."
  },

  "about.quizMethodology.intro": {
    en: "The quiz is designed to help users explore careers that align with their interests, preferences, and constraints. It combines preference-based scoring with straightforward filters that can remove careers that don't fit a user's needs.",
    es: "El cuestionario está diseñado para ayudar a los usuarios a explorar carreras que se alineen con sus intereses, preferencias y limitaciones. Combina una puntuación basada en preferencias con filtros directos que pueden eliminar las carreras que no se ajustan a las necesidades del usuario."
  },
  "about.quizMethodology.softScoring.title": { en: "1. Soft Scoring", es: "1. Puntuación suave" },
  "about.quizMethodology.softScoring.item1": {
    en: "Your answers build a preference profile across multiple dimensions (for example: patient interaction, work style, and areas of interest).",
    es: "Sus respuestas crean un perfil de preferencias en múltiples dimensiones (por ejemplo: interacción con el paciente, estilo de trabajo y áreas de interés)."
  },
  "about.quizMethodology.softScoring.item2": {
    en: "Each career has its own profile across those same dimensions, based on the catalog and structured review.",
    es: "Cada carrera tiene su propio perfil en esas mismas dimensiones, basado en el catálogo y la revisión estructurada."
  },
  "about.quizMethodology.softScoring.item3": {
    en: "The quiz calculates a match score by comparing your profile to each career profile, then ranks careers accordingly.",
    es: "El cuestionario calcula una puntuación de coincidencia al comparar su perfil con cada perfil de carrera, luego clasifica las carreras en consecuencia."
  },
  "about.quizMethodology.hardFilters.title": { en: "2. Hard Filters", es: "2. Filtros estrictos" },
  "about.quizMethodology.hardFilters.item1": {
    en: "Some questions act as \"must-have\" or \"must-avoid\" constraints (for example: licensure requirements, exposure considerations, or schedule constraints).",
    es: "Algunas preguntas actúan como restricciones de \"debe tener\" o \"debe evitar\" (por ejemplo: requisitos de licencia, consideraciones de exposición o restricciones de horario)."
  },
  "about.quizMethodology.hardFilters.item2": {
    en: "If a career conflicts with a hard filter, it may be excluded even if the match score is otherwise strong.",
    es: "Si una carrera entra en conflicto con un filtro estricto, puede ser excluida incluso si la puntuación de coincidencia es fuerte en otros aspectos."
  },
  "about.quizMethodology.hardFilters.item3": {
    en: "Filters are intended to reduce irrelevant options and make results more practical.",
    es: "Los filtros están destinados a reducir opciones irrelevantes y hacer que los resultados sean más prácticos."
  },
  "about.quizMethodology.outro": {
    en: "Results are meant to support exploration and advising conversations—not replace them.",
    es: "Los resultados están destinados a apoyar la exploración y las conversaciones de asesoramiento, no a reemplazarlas."
  },

  "about.aiFeatures.intro": {
    en: "Some features use AI to make the catalog easier to navigate and faster to understand. AI outputs are provided to support discovery and should be validated using the career details and official program resources on each page.",
    es: "Algunas funciones utilizan IA para que el catálogo sea más fácil de navegar y más rápido de entender. Los resultados de la IA se proporcionan para apoyar el descubrimiento y deben validarse utilizando los detalles de la carrera y los recursos oficiales del programa en cada página."
  },
  "about.aiFeatures.aiChat.title": { en: "1. AI Chat", es: "1. Chat de IA" },
  "about.aiFeatures.aiChat.item1": {
    en: "The chat helps users find relevant careers using natural language (for example: \"careers like nursing\" or \"low blood exposure roles\").",
    es: "El chat ayuda a los usuarios a encontrar carreras relevantes utilizando un lenguaje natural (por ejemplo: \"carreras como enfermería\" o \"roles con baja exposición a la sangre\")."
  },
  "about.aiFeatures.aiChat.item2": {
    en: "It suggests options and follow-up questions to narrow results, then links directly to career pages.",
    es: "Sugiere opciones y preguntas de seguimiento para limitar los resultados, luego enlaza directamente a las páginas de carrera."
  },
  "about.aiFeatures.aiChat.item3": {
    en: "Responses may be incomplete or imperfect; users should confirm details on the career page and linked resources.",
    es: "Las respuestas pueden estar incompletas o ser imperfectas; los usuarios deben confirmar los detalles en la página de la carrera y los recursos enlazados."
  },
  "about.aiFeatures.careerVideos.title": { en: "2. Career Videos", es: "2. Vídeos de carreras" },
  "about.aiFeatures.careerVideos.item1": {
    en: "Career videos are generated from structured prompts designed to reflect common tasks and settings for each role.",
    es: "Los vídeos de carreras se generan a partir de indicaciones estructuradas diseñadas para reflejar tareas y entornos comunes para cada función."
  },
  "about.aiFeatures.careerVideos.item2": {
    en: "Videos are reviewed and can be regenerated or updated if something looks inaccurate or out of date.",
    es: "Los vídeos se revisan y pueden regenerarse o actualizarse si algo parece inexacto o desactualizado."
  },
  "about.aiFeatures.careerVideos.item3": {
    en: "Videos are illustrative and not a substitute for program guidance, job shadowing, or employer-specific expectations.",
    es: "Los vídeos son ilustrativos y no sustituyen la orientación del programa, la observación del trabajo o las expectativas específicas del empleador."
  },
  "about.aiFeatures.quizScoring.title": { en: "3. Quiz Scoring", es: "3. Puntuación del cuestionario" },
  "about.aiFeatures.quizScoring.item1": {
    en: "AI-assisted workflows were used to accelerate initial career profiling across quiz dimensions.",
    es: "Se utilizaron flujos de trabajo asistidos por IA para acelerar el perfilado inicial de las carreras en todas las dimensiones del cuestionario."
  },
  "about.aiFeatures.quizScoring.item2": {
    en: "All career profiles remain editable and can be updated as catalog information evolves.",
    es: "Todos los perfiles de carrera siguen siendo editables y pueden actualizarse a medida que evoluciona la información del catálogo."
  },
  "about.aiFeatures.quizScoring.item3": {
    en: "Quiz results reflect the current profiles, filters, and weighting strategy configured by the program team.",
    es: "Los resultados del cuestionario reflejan los perfiles, filtros y estrategias de ponderación actuales configurados por el equipo del programa."
  },
  "about.updateCadence.paragraph1": {
    en: "Content is updated periodically as new information becomes available or as programs and workforce data refresh. Last updated: January 2026.",
    es: "El contenido se actualiza periódicamente a medida que hay nueva información disponible o a medida que se actualizan los programas y los datos de la fuerza laboral. Última actualización: enero de 2026."
  },
  "about.updateCadence.contactHeading": {
    en: "See something that needs updating or doesn't look right? Contact us.",
    es: "¿Ves algo que deba actualizarse o que no parezca correcto? Contáctanos."
  },
  "about.updateCadence.emailButton": {
    en: "Send us an email",
    es: "Envíanos un correo electrónico"
  }
}

export type TranslationKey = keyof typeof dict

export function t(language: Language, key: TranslationKey): string {
  return dict[key][language]
}


