import { defineField, defineType } from "sanity"
import { BillIcon } from "@sanity/icons"

export const moneyRange = defineType({
  name: "moneyRange",
  title: "Money Range",
  type: "object",
  icon: BillIcon,
  fields: [
    defineField({ name: "rangeMin", title: "Min", type: "number", validation: (r) => r.min(0) }),
    defineField({ name: "rangeMax", title: "Max", type: "number", validation: (r) => r.min(0) }),
    defineField({ name: "notes", title: "Notes", type: "localizedString" }),
    defineField({ name: "source", title: "Source (URL or citation)", type: "string" }),
    defineField({ name: "year", title: "Year", type: "number", validation: (r) => r.integer().min(1900).max(2100) })
  ]
})


