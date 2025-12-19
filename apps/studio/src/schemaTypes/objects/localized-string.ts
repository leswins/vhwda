import { defineField, defineType } from "sanity"
import { TranslateIcon } from "@sanity/icons"

export const localizedString = defineType({
  name: "localizedString",
  title: "Localized String",
  type: "object",
  icon: TranslateIcon,
  fields: [
    defineField({ name: "en", title: "English", type: "string", validation: (r) => r.required() }),
    defineField({ name: "es", title: "Spanish", type: "string" })
  ],
  preview: {
    select: { title: "en", subtitle: "es" }
  }
})


