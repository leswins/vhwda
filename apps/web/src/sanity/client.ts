import { createClient } from "@sanity/client"

// NOTE:
// Keep these defaults here (instead of importing from @vhwda/shared) so Vite can start
// without requiring a built JS entrypoint for the shared workspace package.
const DEFAULT_PROJECT_ID = "j0yc55ca"
const DEFAULT_DATASET = "production"

const clientConfig = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID ?? DEFAULT_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET ?? DEFAULT_DATASET,
  apiVersion: "2025-11-01"
}

export const sanityClient = createClient({
  ...clientConfig,
  useCdn: true
})


