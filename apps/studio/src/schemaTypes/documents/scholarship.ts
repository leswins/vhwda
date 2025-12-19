import { defineField, defineType } from "sanity"
import { SparklesIcon } from "@sanity/icons"

export const scholarship = defineType({
  name: "scholarship",
  title: "Scholarship",
  type: "document",
  icon: SparklesIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "summary", title: "Summary", type: "localizedString" }),
    defineField({ name: "eligibility", title: "Eligibility", type: "localizedPortableText" }),
    defineField({ name: "region", title: "Region", type: "string" }),
    defineField({ name: "deadline", title: "Deadline", type: "date" }),
    defineField({ name: "link", title: "Link", type: "url", validation: (r) => r.required() })
  ],
  preview: {
    select: { title: "name", subtitle: "region" }
  }
})


