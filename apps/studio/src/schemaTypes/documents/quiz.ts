import { defineArrayMember, defineField, defineType } from "sanity"
import { RocketIcon } from "@sanity/icons"

export const quiz = defineType({
  name: "quiz",
  title: "Quiz",
  type: "document",
  icon: RocketIcon,
  fields: [
    defineField({ name: "title", title: "Title", type: "localizedString", validation: (r) => r.required() }),
    defineField({
      name: "questions",
      title: "Questions",
      type: "array",
      validation: (r) => r.min(1).error("Add at least one question."),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "prompt", title: "Prompt", type: "localizedString", validation: (r) => r.required() }),
            defineField({
              name: "type",
              title: "Type",
              type: "string",
              options: {
                list: [
                  { title: "Single select", value: "single" },
                  { title: "Multi select", value: "multi" },
                  { title: "Likert", value: "likert" }
                ],
                layout: "radio"
              },
              validation: (r) => r.required()
            }),
            defineField({
              name: "options",
              title: "Options",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({ name: "label", title: "Label", type: "localizedString", validation: (r) => r.required() }),
                    defineField({ name: "score", title: "Score", type: "number" })
                  ]
                })
              ]
            })
          ]
        })
      ]
    })
  ]
})





