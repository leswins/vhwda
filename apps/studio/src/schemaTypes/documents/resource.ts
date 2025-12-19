import { defineField, defineType } from "sanity"
import { LinkIcon } from "@sanity/icons"

export const resource = defineType({
  name: "resource",
  title: "Resource",
  type: "document",
  icon: LinkIcon,
  fields: [
    defineField({ name: "category", title: "Category", type: "string", validation: (r) => r.required() }),
    defineField({ name: "title", title: "Title", type: "localizedString", validation: (r) => r.required() }),
    defineField({ name: "summary", title: "Summary", type: "localizedString" }),
    defineField({ name: "link", title: "Link", type: "url", validation: (r) => r.required() }),
    defineField({ name: "region", title: "Region", type: "string" })
  ],
  preview: {
    select: { title: "title.en", subtitle: "category" }
  }
})


