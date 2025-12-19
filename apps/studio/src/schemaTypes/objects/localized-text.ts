import { defineField, defineType } from "sanity"
import { TranslateIcon } from "@sanity/icons"

export const localizedText = defineType({
  name: "localizedText",
  title: "Localized Text",
  type: "object",
  icon: TranslateIcon,
  fields: [
    defineField({ name: "en", title: "English", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "es", title: "Spanish", type: "text", rows: 4 })
  ],
  preview: {
    select: { title: "en", subtitle: "es" }
  }
})


