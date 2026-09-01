import type { HubResource } from "../sanity/queries/hubResources"

export function isDemoResourcesEnabled() {
  return import.meta.env.DEV || import.meta.env.VITE_DEMO_RESOURCES === "true"
}

function text(en: string, es: string) {
  return { en, es }
}

export const DEMO_HUB_RESOURCES: Record<string, HubResource[]> = {
  internships: [
    {
      _id: "demo.internship.vdh-summer",
      title: text("VDH Summer Public Health Internship", "Pasantía de verano en salud pública de VDH"),
      summary: text(
        "Paid summer internship supporting local health districts across Virginia.",
        "Pasantía de verano remunerada que apoya a los distritos de salud locales de Virginia."
      ),
      description: text(
        "Interns assist with community outreach, health education events, and data collection. Open to undergraduate and graduate students interested in public health.",
        "Las personas becarias apoyan divulgación comunitaria, educación en salud y recopilación de datos. Abierto a estudiantes de pregrado y posgrado interesados en salud pública."
      ),
      institution: "Virginia Department of Health",
      region: "Virginia",
      deadline: "2026-03-15",
      link: "https://www.vdh.virginia.gov/",
      tags: ["internship", "public health"]
    },
    {
      _id: "demo.internship.ahec-shadow",
      title: text("AHEC Health Careers Shadowing", "Observación de carreras de salud AHEC"),
      summary: text(
        "Short-term job shadowing with clinicians in rural and underserved communities.",
        "Observación laboral de corta duración con clínicos en comunidades rurales y desatendidas."
      ),
      description: text(
        "Students spend time with nurses, physicians, and allied health professionals to explore day-to-day work in health settings.",
        "Los estudiantes acompañan a enfermería, medicina y profesionales de la salud aliada para conocer el trabajo diario."
      ),
      institution: "Virginia AHEC",
      region: "Virginia",
      link: "https://www.va-ahec.org/",
      tags: ["shadowing", "high school"]
    },
    {
      _id: "demo.internship.hospital-volunteer",
      title: text("Hospital Volunteer & Pre-Health Experience", "Voluntariado hospitalario y experiencia pre-salud"),
      summary: text(
        "Structured volunteer placements that introduce patient-facing and support roles.",
        "Colocaciones de voluntariado estructuradas que presentan roles de atención al paciente y de apoyo."
      ),
      institution: "Virginia Hospital & Healthcare Association",
      link: "https://www.vhha.com/",
      tags: ["volunteer"]
    }
  ],
  grants: [
    {
      _id: "demo.grant.g3",
      title: text("Get Skilled, Get a Job, Give Back (G3)", "Get Skilled, Get a Job, Give Back (G3)"),
      summary: text(
        "Last-dollar funding for qualifying students in high-demand community college programs.",
        "Financiamiento de último dólar para estudiantes elegibles en programas de alta demanda en colegios comunitarios."
      ),
      description: text(
        "Covers remaining tuition and fees after other aid for approved health and workforce programs at Virginia’s community colleges.",
        "Cubre matrícula y cuotas restantes después de otras ayudas para programas de salud y fuerza laboral aprobados."
      ),
      institution: "Virginia Community College System",
      region: "Virginia",
      link: "https://www.vccs.edu/g3/",
      tags: ["grant", "community college"]
    },
    {
      _id: "demo.grant.workforce-credential",
      title: text("New Economy Workforce Credential Grant", "Subvención de credenciales de la fuerza laboral"),
      summary: text(
        "Helps Virginians pay for short-term, non-credit training that leads to a credential.",
        "Ayuda a las personas en Virginia a pagar formación corta sin crédito que conduce a una credencial."
      ),
      institution: "State Council of Higher Education for Virginia",
      link: "https://www.schev.edu/",
      tags: ["credential", "workforce"]
    }
  ]
}

export const DEMO_TEACHER_RESOURCES: HubResource[] = [
  {
    _id: "demo.teacher.talking-safety",
    title: text("Youth@Work: Talking Safety (health settings)", "Youth@Work: Talking Safety (entornos de salud)"),
    summary: text(
      "A classroom curriculum on workplace safety that works well for CTE and health-occupations classes.",
      "Un currículo de aula sobre seguridad laboral, útil para CTE y clases de ocupaciones de salud."
    ),
    description: text(
      "Sample educator file for the demo. After go-live, the VHWDA team will replace this with VHWDA-authored lesson plans in Sanity.",
      "Archivo de muestra para la demostración. Después del lanzamiento, el equipo de VHWDA lo reemplazará con planes de lección propios en Sanity."
    ),
    institution: "NIOSH / CDC",
    link: "https://www.cdc.gov/niosh/docs/2013-141/pdfs/2013-141.pdf",
    fileUrl: "https://www.cdc.gov/niosh/docs/2013-141/pdfs/2013-141.pdf",
    hasFile: true,
    fileLabel: "PDF",
    tags: ["lesson plan", "safety"],
    resourceType: {
      _id: "fallback.teacher-materials",
      slug: "teacher-materials",
      title: text("Classroom Materials", "Materiales para el Aula")
    }
  },
  {
    _id: "demo.teacher.bls-healthcare",
    title: text("Exploring healthcare careers (BLS Occupational Outlook)", "Explorar carreras de salud (BLS)"),
    summary: text(
      "Official career profiles students can use for research on roles, pay, and education.",
      "Perfiles oficiales de carreras que el estudiantado puede usar para investigar roles, salario y educación."
    ),
    institution: "U.S. Bureau of Labor Statistics",
    link: "https://www.bls.gov/ooh/healthcare/",
    hasFile: false,
    tags: ["career exploration"],
    resourceType: {
      _id: "fallback.teacher-materials",
      slug: "teacher-materials",
      title: text("Classroom Materials", "Materiales para el Aula")
    }
  },
  {
    _id: "demo.teacher.vdh-school-health",
    title: text("Virginia school health resources", "Recursos de salud escolar de Virginia"),
    summary: text(
      "State health department materials educators can use when introducing public health careers.",
      "Materiales del departamento de salud estatal para presentar carreras de salud pública."
    ),
    institution: "Virginia Department of Health",
    link: "https://www.vdh.virginia.gov/",
    hasFile: false,
    tags: ["Virginia", "public health"],
    resourceType: {
      _id: "fallback.teacher-materials",
      slug: "teacher-materials",
      title: text("Classroom Materials", "Materiales para el Aula")
    }
  }
]

export function getDemoHubResources(slug: string): HubResource[] {
  return DEMO_HUB_RESOURCES[slug] ?? []
}
