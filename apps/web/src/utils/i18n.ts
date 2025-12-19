export type Language = "en" | "es"

type Dictionary = Record<string, { en: string; es: string }>

const dict: Dictionary = {
  "app.title": { en: "VHWDA Careers", es: "Carreras VHWDA" },
  "nav.browse": { en: "Browse Careers", es: "Explorar carreras" },
  "nav.quiz": { en: "Career Quiz", es: "Cuestionario" },
  "nav.compare": { en: "Compare", es: "Comparar" },
  "nav.resources": { en: "Resources", es: "Recursos" },
  "nav.language": { en: "Language", es: "Idioma" },
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
  "common.missing": { en: "(missing)", es: "(falta)" },
  "compare.title": { en: "Compare Careers", es: "Comparar carreras" },
  "compare.body": { en: "Placeholder page. Will compare selected careers.", es: "Página temporal. Comparará carreras seleccionadas." },
  "quiz.title": { en: "Career Quiz", es: "Cuestionario" },
  "quiz.body": { en: "Placeholder page. Will guide users to recommended careers.", es: "Página temporal. Recomendará carreras a los usuarios." },
  "resources.title": { en: "Resources", es: "Recursos" },
  "resources.body": { en: "Placeholder page. Will list scholarships and resources.", es: "Página temporal. Listará becas y recursos." },
  "a11y.skipToContent": { en: "Skip to content", es: "Saltar al contenido" }
}

export function t(language: Language, key: keyof typeof dict): string {
  return dict[key][language]
}


