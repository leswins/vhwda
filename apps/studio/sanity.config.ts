import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { schemaTypes } from "./src/schemaTypes"
import { structure } from "./src/structure"
import { resourceTemplates } from "./src/templates/resourceTemplates"

export default defineConfig({
  name: "default",
  title: "VHWDA Studio",

  projectId: "j0yc55ca",
  dataset: "production",

  plugins: [structureTool({ structure })],

  schema: {
    types: schemaTypes,
    templates: (prev) => [...prev.filter((template) => template.id !== "resource"), ...resourceTemplates]
  }
})


