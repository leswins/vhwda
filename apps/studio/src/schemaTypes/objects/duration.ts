import { defineField, defineType } from "sanity"
import { ClockIcon } from "@sanity/icons"

export const duration = defineType({
  name: "duration",
  title: "Duration",
  type: "object",
  icon: ClockIcon,
  fields: [
    defineField({ name: "value", type: "number", validation: (r) => r.min(0) }),
    defineField({
      name: "unit",
      type: "string",
      options: {
        list: [
          { title: "Days", value: "days" },
          { title: "Weeks", value: "weeks" },
          { title: "Months", value: "months" },
          { title: "Years", value: "years" }
        ],
        layout: "radio"
      }
    })
  ]
})


