import { defineArrayMember, defineField, defineType } from "sanity"
import { TranslateIcon } from "@sanity/icons"

export const localizedBulletList = defineType({
  name: "localizedBulletList",
  title: "Localized Bullet List",
  type: "object",
  icon: TranslateIcon,
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (r) => r.required().min(1).unique()
    }),
    defineField({
      name: "es",
      title: "Spanish",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (r) => r.unique()
    })
  ]
})

