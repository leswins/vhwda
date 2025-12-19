import { createClient } from "@sanity/client"
import { SANITY_DATASET, SANITY_PROJECT_ID } from "@vhwda/shared"

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID ?? SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET ?? SANITY_DATASET,
  apiVersion: "2025-11-01",
  useCdn: true
})


