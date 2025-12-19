import { defineField, defineType } from "sanity"
import { BookIcon } from "@sanity/icons"

export const program = defineType({
  name: "program",
  title: "Program",
  type: "document",
  icon: BookIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "region", title: "Region", type: "string" }),
    defineField({ name: "credentialType", title: "Credential Type", type: "string" }),
    defineField({ name: "duration", title: "Duration", type: "duration" }),
    defineField({ name: "cost", title: "Cost", type: "moneyRange" }),
    defineField({ name: "prerequisites", title: "Prerequisites", type: "localizedPortableText" }),
    defineField({ name: "accreditation", title: "Accreditation", type: "localizedString" }),
    defineField({ name: "link", title: "Link", type: "url" })
  ],
  preview: {
    select: { title: "name", subtitle: "credentialType" }
  }
})


