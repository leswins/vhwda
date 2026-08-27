/**
 * Seed built-in resource types so the hub, submission form, and teacher
 * portal have a starting taxonomy. Editors can add more types in Studio
 * afterwards — the frontend will pick them up automatically.
 *
 * Usage (from apps/studio, with SANITY_API_TOKEN set):
 *   pnpm exec tsx scripts/seed-resource-types.ts
 */
import { createClient } from "@sanity/client"
import { config as loadEnv } from "dotenv"

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

type SeedType = {
  _id: string
  slug: string
  title: { _type: "localizedString"; en: string; es: string }
  description: { _type: "localizedString"; en: string; es: string }
  accent: string
  icon: string
  sortOrder: number
  audience: "publicHub" | "teacherPortal" | "both"
  sourceKind: "scholarship" | "professionalOrganization" | "educationalInstitution" | "generic"
  showInSubmissionForm: boolean
  allowFileAttachment: boolean
  enabled: boolean
}

const SEED: SeedType[] = [
  {
    _id: "resourceType.scholarships",
    slug: "scholarships",
    title: {
      _type: "localizedString",
      en: "Scholarships & Financial Aid",
      es: "Becas y Ayuda Financiera"
    },
    description: {
      _type: "localizedString",
      en: "Explore scholarships, grants, and funding options to support your education.",
      es: "Explora becas, subvenciones y opciones de financiamiento para apoyar tu educación."
    },
    accent: "green",
    icon: "help",
    sortOrder: 10,
    audience: "publicHub",
    sourceKind: "scholarship",
    showInSubmissionForm: true,
    allowFileAttachment: false,
    enabled: true
  },
  {
    _id: "resourceType.organizations",
    slug: "organizations",
    title: {
      _type: "localizedString",
      en: "Professional Organizations",
      es: "Organizaciones Profesionales"
    },
    description: {
      _type: "localizedString",
      en: "Connect with professional associations and networks in healthcare.",
      es: "Conéctate con asociaciones profesionales y redes en el sector de la salud."
    },
    accent: "pink",
    icon: "doctor",
    sortOrder: 20,
    audience: "publicHub",
    sourceKind: "professionalOrganization",
    showInSubmissionForm: true,
    allowFileAttachment: false,
    enabled: true
  },
  {
    _id: "resourceType.schools",
    slug: "schools",
    title: {
      _type: "localizedString",
      en: "Schools & Prerequisites",
      es: "Escuelas y Prerrequisitos"
    },
    description: {
      _type: "localizedString",
      en: "Find training programs, schools, and prerequisite courses in Virginia.",
      es: "Encuentra programas de formación, escuelas y cursos prerrequisito en Virginia."
    },
    accent: "blue",
    icon: "education",
    sortOrder: 30,
    audience: "publicHub",
    sourceKind: "educationalInstitution",
    showInSubmissionForm: false,
    allowFileAttachment: false,
    enabled: true
  },
  {
    _id: "resourceType.internships",
    slug: "internships",
    title: {
      _type: "localizedString",
      en: "Internships & Experiences",
      es: "Pasantías y Experiencias"
    },
    description: {
      _type: "localizedString",
      en: "Discover internships, shadowing, and hands-on healthcare experiences.",
      es: "Descubre pasantías, observación y experiencias prácticas en salud."
    },
    accent: "yellow",
    icon: "briefcase",
    sortOrder: 40,
    audience: "publicHub",
    sourceKind: "generic",
    showInSubmissionForm: true,
    allowFileAttachment: false,
    enabled: true
  },
  {
    _id: "resourceType.grants",
    slug: "grants",
    title: {
      _type: "localizedString",
      en: "Grants & Opportunities",
      es: "Subvenciones y Oportunidades"
    },
    description: {
      _type: "localizedString",
      en: "Find grants and workforce opportunities that support training and career growth.",
      es: "Encuentra subvenciones y oportunidades laborales que apoyan la formación y el crecimiento profesional."
    },
    accent: "orange",
    icon: "grant",
    sortOrder: 50,
    audience: "publicHub",
    sourceKind: "generic",
    showInSubmissionForm: true,
    allowFileAttachment: false,
    enabled: true
  },
  {
    _id: "resourceType.teacher-materials",
    slug: "teacher-materials",
    title: {
      _type: "localizedString",
      en: "Classroom Materials",
      es: "Materiales para el Aula"
    },
    description: {
      _type: "localizedString",
      en: "Lesson plans, activities, and educator guides for introducing health careers.",
      es: "Planes de lección, actividades y guías educativas para presentar carreras de salud."
    },
    accent: "yellow",
    icon: "document",
    sortOrder: 10,
    audience: "teacherPortal",
    sourceKind: "generic",
    showInSubmissionForm: true,
    allowFileAttachment: true,
    enabled: true
  }
]

async function main() {
  const mutations = SEED.map((item) => ({
    createIfNotExists: {
      _id: item._id,
      _type: "resourceType",
      ...item
    }
  }))

  const result = await client.mutate(mutations, { autoGenerateArrayKeys: true })
  console.log(`Seeded ${SEED.length} resource types`)
  console.log(JSON.stringify(result, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
