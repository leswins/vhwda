import { defineCliConfig } from "sanity/cli"

export default defineCliConfig({
  api: {
    projectId: "j0yc55ca",
    dataset: "production"
  },
  // Prevent interactive prompts during `sanity deploy` by pinning the studio hostname.
  // This becomes the hosted Studio URL: https://<studioHost>.sanity.studio
  studioHost: "careercatalog"
})


