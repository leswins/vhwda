/**
 * Sample internships, grants, and educational resources for filter testing.
 * Stable IDs so the script is safe to re-run. Delete documents whose _id
 * starts with `resource.sample.` after the demo.
 *
 *   pnpm --filter studio run seed:hub-resources
 */
import { createClient } from "@sanity/client"
import { config as loadEnv } from "dotenv"
import { RESOURCE_TYPE_IDS } from "../src/schemaTypes/documents/resourceTypeIds"

loadEnv({ path: "../../.env.local" })
loadEnv({ path: "../../.env" })

const projectId = process.env.SANITY_PROJECT_ID || "j0yc55ca"
const dataset = process.env.SANITY_DATASET || "production"
const token = process.env.SANITY_API_TOKEN

if (!token) {
  console.error("SANITY_API_TOKEN is required")
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-11-01",
  token,
  useCdn: false
})

function loc(en: string, es: string) {
  return { _type: "localizedString", en, es }
}

function locText(en: string, es: string) {
  return { _type: "localizedText", en, es }
}

function refs(ids: string[]) {
  return ids.map((id) => ({ _type: "reference" as const, _ref: id, _key: id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12) }))
}

function pickCategories(categories: Array<{ _id: string; title: string }>, ...needles: string[]) {
  const matches = categories.filter((category) =>
    needles.some((needle) => category.title.toLowerCase().includes(needle.toLowerCase()))
  )
  return refs(matches.slice(0, 2).map((category) => category._id))
}

async function main() {
  const categories = await client.fetch<Array<{ _id: string; title: string }>>(
    `*[_type == "careerCategory"]{_id, title}`
  )

  const nursing = pickCategories(categories, "nurs")
  const publicHealth = pickCategories(categories, "public health", "community")
  const allied = pickCategories(categories, "allied", "therapy", "technician")
  const physician = pickCategories(categories, "physician", "medic")

  const documents = [
    {
      _id: "resource.sample.internship.vdh-summer",
      resourceType: RESOURCE_TYPE_IDS.internships,
      title: loc("VDH Summer Public Health Internship", "Pasantía de verano en salud pública de VDH"),
      summary: loc(
        "Paid summer internship supporting local health districts across Virginia.",
        "Pasantía de verano remunerada que apoya a los distritos de salud locales de Virginia."
      ),
      description: locText(
        "Interns assist with community outreach, health education events, and data collection.",
        "Las personas becarias apoyan divulgación comunitaria, educación en salud y recopilación de datos."
      ),
      institution: "Virginia Department of Health",
      link: "https://www.vdh.virginia.gov/",
      experienceKind: "internship",
      compensation: "paid",
      audienceLevel: ["undergraduate", "graduate"],
      locationScope: "virginia_statewide",
      setting: "public_health",
      duration: "Summer, 10 weeks",
      deadline: "2026-03-15",
      careerAreas: publicHealth
    },
    {
      _id: "resource.sample.internship.ahec-shadow",
      resourceType: RESOURCE_TYPE_IDS.internships,
      title: loc("AHEC Health Careers Shadowing", "Observación de carreras de salud AHEC"),
      summary: loc(
        "Short-term job shadowing with clinicians in rural and underserved communities.",
        "Observación laboral de corta duración con clínicos en comunidades rurales y desatendidas."
      ),
      institution: "Virginia AHEC",
      link: "https://www.va-ahec.org/",
      experienceKind: "shadowing",
      compensation: "unpaid",
      audienceLevel: ["high_school", "undergraduate"],
      locationScope: "regional",
      setting: "clinic",
      duration: "1–5 days",
      careerAreas: allied
    },
    {
      _id: "resource.sample.internship.hospital-volunteer",
      resourceType: RESOURCE_TYPE_IDS.internships,
      title: loc("Hospital Volunteer & Pre-Health Experience", "Voluntariado hospitalario y experiencia pre-salud"),
      summary: loc(
        "Structured volunteer placements that introduce patient-facing and support roles.",
        "Colocaciones de voluntariado estructuradas que presentan roles de atención al paciente y de apoyo."
      ),
      institution: "Virginia Hospital & Healthcare Association",
      link: "https://www.vhha.com/",
      experienceKind: "volunteer",
      compensation: "unpaid",
      audienceLevel: ["high_school", "undergraduate"],
      locationScope: "local",
      setting: "hospital",
      duration: "Ongoing",
      careerAreas: nursing
    },
    {
      _id: "resource.sample.internship.uva-research",
      resourceType: RESOURCE_TYPE_IDS.internships,
      title: loc("UVA Health Undergraduate Research Internship", "Pasantía de investigación de UVA Health"),
      summary: loc(
        "Stipend-supported lab research for undergraduates exploring biomedical careers.",
        "Investigación de laboratorio con estipendio para estudiantes de pregrado."
      ),
      institution: "UVA Health",
      link: "https://www.uvahealth.com/",
      experienceKind: "research",
      compensation: "stipend",
      audienceLevel: ["undergraduate"],
      locationScope: "local",
      setting: "lab",
      duration: "8 weeks",
      deadline: "2026-02-01",
      careerAreas: physician
    },
    {
      _id: "resource.sample.internship.vcu-nursing",
      resourceType: RESOURCE_TYPE_IDS.internships,
      title: loc("VCU Health Nursing Student Internship", "Pasantía de enfermería de VCU Health"),
      summary: loc(
        "Paid clinical internship for nursing students in hospital units.",
        "Pasantía clínica remunerada para estudiantes de enfermería."
      ),
      institution: "VCU Health",
      link: "https://www.vcuhealth.org/",
      experienceKind: "clinical_rotation",
      compensation: "paid",
      audienceLevel: ["undergraduate", "graduate"],
      locationScope: "regional",
      setting: "hospital",
      duration: "Semester",
      deadline: "2026-04-01",
      careerAreas: nursing
    },
    {
      _id: "resource.sample.internship.remote-health-comms",
      resourceType: RESOURCE_TYPE_IDS.internships,
      title: loc("Remote Health Communications Internship", "Pasantía remota de comunicaciones en salud"),
      summary: loc(
        "Remote internship creating public-facing health education content.",
        "Pasantía remota creando contenido de educación en salud."
      ),
      institution: "Virginia Department of Health",
      link: "https://www.vdh.virginia.gov/",
      experienceKind: "internship",
      compensation: "stipend",
      audienceLevel: ["undergraduate", "career_changer"],
      locationScope: "remote",
      setting: "community",
      duration: "12 weeks",
      deadline: "2026-05-30",
      careerAreas: publicHealth
    },
    {
      _id: "resource.sample.grant.g3",
      resourceType: RESOURCE_TYPE_IDS.grants,
      title: loc("Get Skilled, Get a Job, Give Back (G3)", "Get Skilled, Get a Job, Give Back (G3)"),
      summary: loc(
        "Last-dollar funding for qualifying students in high-demand community college programs.",
        "Financiamiento de último dólar para estudiantes elegibles en programas de alta demanda."
      ),
      institution: "Virginia Community College System",
      link: "https://www.vccs.edu/g3/",
      opportunityKind: "last_dollar",
      applicantType: ["student"],
      locationScope: "virginia_statewide",
      fundingAmount: "Last-dollar tuition and fees",
      deadline: "2026-08-01",
      careerAreas: allied
    },
    {
      _id: "resource.sample.grant.workforce-credential",
      resourceType: RESOURCE_TYPE_IDS.grants,
      title: loc("New Economy Workforce Credential Grant", "Subvención de credenciales de la fuerza laboral"),
      summary: loc(
        "Helps Virginians pay for short-term, non-credit training that leads to a credential.",
        "Ayuda a pagar formación corta sin crédito que conduce a una credencial."
      ),
      institution: "State Council of Higher Education for Virginia",
      link: "https://www.schev.edu/",
      opportunityKind: "credential_funding",
      applicantType: ["worker", "adult_learner"],
      locationScope: "virginia_statewide",
      fundingAmount: "Up to two-thirds of program cost",
      careerAreas: allied
    },
    {
      _id: "resource.sample.grant.employer-tuition",
      resourceType: RESOURCE_TYPE_IDS.grants,
      title: loc("Hospital Employer Tuition Support", "Apoyo de matrícula de empleadores hospitalarios"),
      summary: loc(
        "Employer-sponsored tuition assistance for incumbent healthcare workers.",
        "Asistencia de matrícula patrocinada por empleadores para personal de salud."
      ),
      institution: "Virginia Hospital & Healthcare Association",
      link: "https://www.vhha.com/",
      opportunityKind: "employer_sponsored",
      applicantType: ["worker", "employer"],
      locationScope: "regional",
      fundingAmount: "Varies by employer",
      careerAreas: nursing
    },
    {
      _id: "resource.sample.grant.rural-workforce",
      resourceType: RESOURCE_TYPE_IDS.grants,
      title: loc("Rural Health Workforce Opportunity Grant", "Subvención de fuerza laboral rural"),
      summary: loc(
        "Supports rural providers that train and hire allied health workers.",
        "Apoya a proveedores rurales que forman y contratan personal de salud aliada."
      ),
      institution: "Virginia Department of Health",
      link: "https://www.vdh.virginia.gov/",
      opportunityKind: "workforce_grant",
      applicantType: ["employer", "school"],
      locationScope: "regional",
      fundingAmount: "Competitive award",
      deadline: "2026-01-20",
      careerAreas: allied
    },
    {
      _id: "resource.sample.grant.adult-career-switch",
      resourceType: RESOURCE_TYPE_IDS.grants,
      title: loc("Adult Career Switcher Health Training Award", "Premio para cambio de carrera en salud"),
      summary: loc(
        "Funding for adult learners entering approved health training programs.",
        "Financiamiento para personas adultas que entran a programas de salud aprobados."
      ),
      institution: "Virginia Community College System",
      link: "https://www.vccs.edu/",
      opportunityKind: "other",
      applicantType: ["adult_learner", "student"],
      locationScope: "local",
      fundingAmount: "Up to $2,500",
      deadline: "2026-06-15",
      careerAreas: nursing
    },
    {
      _id: "resource.sample.education.talking-safety",
      resourceType: RESOURCE_TYPE_IDS.educational,
      title: loc("Youth@Work: Talking Safety (health settings)", "Youth@Work: Talking Safety (entornos de salud)"),
      summary: loc(
        "A classroom curriculum on workplace safety for CTE and health-occupations classes.",
        "Currículo de aula sobre seguridad laboral para CTE y ocupaciones de salud."
      ),
      institution: "NIOSH / CDC",
      link: "https://www.cdc.gov/niosh/docs/2013-141/pdfs/2013-141.pdf",
      fileUrl: "https://www.cdc.gov/niosh/docs/2013-141/pdfs/2013-141.pdf",
      fileLabel: "PDF",
      materialKind: "curriculum",
      gradeBands: ["high_school", "cte"],
      topicFocus: "workplace_safety",
      format: "pdf",
      careerAreas: allied
    },
    {
      _id: "resource.sample.education.bls-healthcare",
      resourceType: RESOURCE_TYPE_IDS.educational,
      title: loc("Exploring healthcare careers (BLS Occupational Outlook)", "Explorar carreras de salud (BLS)"),
      summary: loc(
        "Official career profiles students can use for research on roles, pay, and education.",
        "Perfiles oficiales de carreras para investigar roles, salario y educación."
      ),
      institution: "U.S. Bureau of Labor Statistics",
      link: "https://www.bls.gov/ooh/healthcare/",
      materialKind: "career_profile",
      gradeBands: ["middle", "high_school", "counselor"],
      topicFocus: "career_exploration",
      format: "web",
      careerAreas: physician
    },
    {
      _id: "resource.sample.education.vdh-school-health",
      resourceType: RESOURCE_TYPE_IDS.educational,
      title: loc("Virginia school health resources", "Recursos de salud escolar de Virginia"),
      summary: loc(
        "State health department materials for introducing public health careers.",
        "Materiales estatales para presentar carreras de salud pública."
      ),
      institution: "Virginia Department of Health",
      link: "https://www.vdh.virginia.gov/",
      materialKind: "facilitator_guide",
      gradeBands: ["high_school", "counselor"],
      topicFocus: "public_health",
      format: "web",
      careerAreas: publicHealth
    },
    {
      _id: "resource.sample.education.pathway-planner",
      resourceType: RESOURCE_TYPE_IDS.educational,
      title: loc("Health career pathway planner (classroom activity)", "Planificador de trayectoria (actividad)"),
      summary: loc(
        "A one-period activity that helps students map education steps to a health role.",
        "Actividad de una clase para mapear pasos educativos hacia un rol de salud."
      ),
      institution: "VHWDA",
      link: "https://vahealthcareers.org/browse",
      materialKind: "activity",
      gradeBands: ["middle", "high_school"],
      topicFocus: "pathway_planning",
      format: "web",
      careerAreas: allied
    },
    {
      _id: "resource.sample.education.clinical-skills-slides",
      resourceType: RESOURCE_TYPE_IDS.educational,
      title: loc("Intro to clinical skills slide deck", "Presentación de habilidades clínicas"),
      summary: loc(
        "Slides for introducing basic clinical skills language in CTE health courses.",
        "Diapositivas para presentar lenguaje básico de habilidades clínicas."
      ),
      institution: "VHWDA",
      link: "https://vahealthcareers.org/teachers",
      materialKind: "slide_deck",
      gradeBands: ["cte", "high_school"],
      topicFocus: "clinical_skills",
      format: "slides",
      careerAreas: nursing
    }
  ]

  const mutations = documents.map((item) => {
    const { resourceType, ...rest } = item
    return {
      createOrReplace: {
        ...rest,
        _type: "resource",
        published: true,
        resourceType: { _type: "reference", _ref: resourceType }
      }
    }
  })

  const result = await client.mutate(mutations, { autoGenerateArrayKeys: true })
  console.log(`Seeded ${documents.length} sample hub resources`)
  console.log(JSON.stringify(result, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
