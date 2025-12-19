import { defineField, defineType } from "sanity"
import { BillIcon } from "@sanity/icons"

export const salary = defineType({
  name: "salary",
  title: "Salary",
  type: "object",
  icon: BillIcon,
  fields: [
    defineField({ name: "median", title: "Median", type: "number", validation: (r) => r.min(0) }),
    defineField({ name: "rangeMin", title: "Entry Level", type: "number", validation: (r) => r.min(0) }),
    defineField({ name: "rangeMax", title: "Experienced", type: "number", validation: (r) => r.min(0) }),
    defineField({ name: "notes", title: "Notes", type: "localizedString" }),
    defineField({ name: "source", title: "Source (URL or citation)", type: "string" }),
    defineField({ name: "year", title: "Year", type: "number", validation: (r) => r.integer().min(1900).max(2100) })
  ]
})


