import { defineArrayMember, defineField, defineType } from "sanity"
import { TranslateIcon } from "@sanity/icons"

const portableTextSmall = [
  defineArrayMember({
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "Small", value: "small" }
    ],
    // Academic Requirements + supporting notes should not be lists/headings
    lists: []
  })
]

export const localizedPortableTextSmall = defineType({
  name: "localizedPortableTextSmall",
  title: "Localized Rich Text (Small)",
  type: "object",
  icon: TranslateIcon,
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: portableTextSmall,
      validation: (r) => r.required()
    }),
    defineField({
      name: "es",
      title: "Spanish",
      type: "array",
      of: portableTextSmall
    })
  ]
})

