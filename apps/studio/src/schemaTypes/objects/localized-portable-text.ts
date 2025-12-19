import { defineArrayMember, defineField, defineType } from "sanity"
import { TranslateIcon } from "@sanity/icons"

const portableText = [
  defineArrayMember({
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "H2", value: "h2" },
      { title: "H3", value: "h3" }
    ],
    lists: [{ title: "Bullet", value: "bullet" }, { title: "Numbered", value: "number" }]
  })
]

export const localizedPortableText = defineType({
  name: "localizedPortableText",
  title: "Localized Rich Text",
  type: "object",
  icon: TranslateIcon,
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: portableText,
      validation: (r) => r.required()
    }),
    defineField({
      name: "es",
      title: "Spanish",
      type: "array",
      of: portableText
    })
  ]
})


