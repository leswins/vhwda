import { defineArrayMember, defineField, defineType } from "sanity"
import { SplitVerticalIcon } from "@sanity/icons"

export const pathwayChoice = defineType({
  name: "pathwayChoice",
  title: "Choose One",
  type: "object",
  icon: SplitVerticalIcon,
  fields: [
    defineField({
      name: "label",
      title: "Choice label",
      description: "Shown above the options (e.g. “Choose one accreditation type”).",
      type: "localizedString",
      validation: (r) => r.required()
    }),
    defineField({
      name: "options",
      title: "Options",
      description: "Add at least two mutually exclusive options. The next item in the pathway is the merge point.",
      type: "array",
      of: [defineArrayMember({ type: "pathwayStep" })],
      validation: (r) => r.min(2).error("Add at least two options for a choose-one group.")
    })
  ],
  preview: {
    select: {
      title: "label.en",
      options: "options"
    },
    prepare: ({ title, options }) => {
      const count = Array.isArray(options) ? options.length : 0
      return {
        title: title || "Choose one",
        subtitle: count === 1 ? "1 option" : `${count} options`
      }
    }
  }
})
