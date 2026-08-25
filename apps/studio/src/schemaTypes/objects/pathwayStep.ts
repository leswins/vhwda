import { defineField, defineType } from "sanity"
import { CheckmarkCircleIcon } from "@sanity/icons"

const KIND_OPTIONS = [
  { title: "Prior education", value: "priorEducation" },
  { title: "Certificate", value: "certificate" },
  { title: "Associate degree", value: "associate" },
  { title: "Bachelor's degree", value: "bachelor" },
  { title: "Master's degree", value: "master" },
  { title: "Doctoral degree", value: "doctoral" },
  { title: "Clinical experience", value: "clinical" },
  { title: "Exam", value: "exam" },
  { title: "Credential / certification", value: "credential" },
  { title: "State licensure", value: "licensure" },
  { title: "Apprenticeship", value: "apprenticeship" },
  { title: "Other", value: "other" }
] as const

const REQUIREMENT_OPTIONS = [
  { title: "Required", value: "required" },
  { title: "Optional", value: "optional" },
  { title: "Recommended", value: "recommended" }
] as const

export const pathwayStep = defineType({
  name: "pathwayStep",
  title: "Pathway Step",
  type: "object",
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      validation: (r) => r.required()
    }),
    defineField({
      name: "description",
      title: "Short description",
      description: "One-line subtitle shown under the title (e.g. duration, program focus).",
      type: "localizedString"
    }),
    defineField({
      name: "kind",
      title: "Step type",
      type: "string",
      options: { list: [...KIND_OPTIONS] },
      validation: (r) => r.required()
    }),
    defineField({
      name: "requirement",
      title: "Requirement",
      type: "string",
      options: { list: [...REQUIREMENT_OPTIONS], layout: "radio" },
      initialValue: "required",
      validation: (r) => r.required()
    }),
    defineField({
      name: "organization",
      title: "Organization or accrediting body",
      description: "Optional. Example: CAAHEP, Virginia Board of Nursing.",
      type: "string"
    })
  ],
  preview: {
    select: {
      title: "title.en",
      requirement: "requirement",
      kind: "kind",
      organization: "organization"
    },
    prepare: ({ title, requirement, kind, organization }) => {
      const kindLabel = KIND_OPTIONS.find((option) => option.value === kind)?.title ?? kind
      const requirementLabel =
        REQUIREMENT_OPTIONS.find((option) => option.value === requirement)?.title ?? requirement
      const parts = [requirementLabel, kindLabel, organization].filter(Boolean)
      return {
        title: title || "Untitled step",
        subtitle: parts.join(" · ")
      }
    }
  }
})
