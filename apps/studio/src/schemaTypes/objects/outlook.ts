import { defineField, defineType } from "sanity"
import { BarChartIcon } from "@sanity/icons"

export const outlook = defineType({
  name: "outlook",
  title: "Outlook",
  type: "object",
  icon: BarChartIcon,
  fields: [
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({ name: "value", title: "Value", type: "number" }),
    defineField({ name: "notes", title: "Notes", type: "localizedString" }),
    defineField({ name: "source", title: "Source (URL or citation)", type: "string" }),
    defineField({ name: "year", title: "Year", type: "number", validation: (r) => r.integer().min(1900).max(2100) })
  ]
})


