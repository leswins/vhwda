import { defineField, defineType } from "sanity"
import { UsersIcon } from "@sanity/icons"

export const professionalOrganization = defineType({
  name: "professionalOrganization",
  title: "Professional Organization",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "link", title: "Link", type: "url" }),
    defineField({ name: "description", title: "Description", type: "localizedText" })
  ],
  preview: {
    select: { title: "name" }
  }
})


