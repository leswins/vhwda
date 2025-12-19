import { defineField, defineType } from "sanity"
import { TagIcon } from "@sanity/icons"

export const careerCategory = defineType({
  name: "careerCategory",
  title: "Career Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "localizedText" })
  ],
  preview: {
    select: { title: "title" }
  }
})


