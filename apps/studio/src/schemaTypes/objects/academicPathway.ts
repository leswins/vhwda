import { defineArrayMember, defineField, defineType } from "sanity"
import { MasterDetailIcon } from "@sanity/icons"

export const academicPathway = defineType({
  name: "academicPathway",
  title: "Visual Academic Pathway",
  type: "object",
  icon: MasterDetailIcon,
  fields: [
    defineField({
      name: "status",
      title: "Pathway status",
      description:
        "Only “Verified” pathways appear on the public Career Detail page. Until then, the existing Academic Pathway text is shown.",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "In review", value: "inReview" },
          { title: "Verified", value: "verified" }
        ],
        layout: "radio"
      },
      initialValue: "draft",
      validation: (r) => r.required()
    }),
    defineField({
      name: "verifiedAt",
      title: "Verified at",
      type: "datetime",
      hidden: ({ parent }) => parent?.status !== "verified"
    }),
    defineField({
      name: "editorNotes",
      title: "Internal notes",
      description: "Studio-only. Not shown on the website. Use for source questions or review flags.",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "items",
      title: "Pathway items",
      description:
        "Add steps in order. Use “Choose One” for mutually exclusive options (accreditation, certificate vs apprenticeship, etc.). Do not invent missing degrees or licensure steps that are not in the Academic Pathway text.",
      type: "array",
      of: [defineArrayMember({ type: "pathwayStep" }), defineArrayMember({ type: "pathwayChoice" })]
    })
  ]
})
