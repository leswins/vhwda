import { defineArrayMember, defineField, defineType } from "sanity"
import { RocketIcon } from "@sanity/icons"
import { hardFilter } from "../objects/hardFilter"

export const quiz = defineType({
  name: "quiz",
  title: "Quiz",
  type: "document",
  icon: RocketIcon,
  fields: [
    defineField({
      name: "title",
      title: "Quiz Title",
      type: "localizedString",
      description: "Title for this quiz (e.g., 'Career Matching Quiz')",
      validation: (r) => r.required()
    }),
    defineField({
      name: "questions",
      title: "Questions",
      type: "array",
      validation: (r) => r.min(1).error("Add at least one question."),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ 
              name: "order", 
              title: "Order", 
              type: "number", 
              description: "Question order (1, 2, 3...)" 
            }),
            defineField({ 
              name: "title", 
              title: "Question Title (Optional)", 
              type: "localizedString",
              description: "Optional short title for this question (for internal reference)"
            }),
            defineField({ 
              name: "section", 
              title: "Section", 
              type: "string",
              description: "Section name (e.g., 'Interests & Values', 'Skills & Aptitudes')",
              options: {
                list: [
                  { title: "Interests & Values", value: "Interests & Values" },
                  { title: "Skills & Aptitudes", value: "Skills & Aptitudes" },
                  { title: "Work Environment", value: "Work Environment" },
                  { title: "Schedule & Lifestyle", value: "Schedule & Lifestyle" },
                  { title: "Education Path", value: "Education Path" },
                  { title: "Salary & Outlook", value: "Salary & Outlook" },
                  { title: "Location & Access", value: "Location & Access" },
                  { title: "Career Features", value: "Career Features" },
                  { title: "Deal-breakers", value: "Deal-breakers" }
                ]
              }
            }),
            defineField({ name: "prompt", title: "Prompt", type: "localizedString", validation: (r) => r.required() }),
            defineField({ 
              name: "type", 
              title: "Question Type", 
              type: "string",
              description: "Type of question",
              options: {
                list: [
                  { title: "Likert 5-point scale", value: "likert_5" },
                  { title: "Rating 1-5", value: "rating_1_5" },
                  { title: "Multi-select", value: "multi_select" },
                  { title: "Single-select", value: "single_select" },
                  { title: "Boolean (Yes/No)", value: "boolean" },
                  { title: "Region select", value: "region_select" }
                ]
              }
            }),
            defineField({ 
              name: "maxSelect", 
              title: "Max Select (for multi-select)", 
              type: "number",
              description: "Maximum number of options user can select (only for multi_select)",
              validation: (r) => r.min(1).max(10)
            }),
            defineField({ 
              name: "isDealbreaker", 
              title: "Is Deal-breaker", 
              type: "boolean",
              description: "If true, this question is a deal-breaker (excludes careers if user answers 'Yes')"
            }),
            defineField({
              name: "options",
              title: "Options",
              type: "array",
              validation: (r) => r.min(1).error("Add at least one option."),
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({ name: "label", title: "Label", type: "localizedString", validation: (r) => r.required() }),
                    defineField({ 
                      name: "weights", 
                      title: "Vector Weights (REQUIRED - Click to expand)", 
                      type: "object",
                      description: "USE THIS FIELD: Weights for quiz vector dimensions. Values from -2 to +2. Can affect multiple dimensions. Click to expand and set values for w_patient_facing, w_lab_research, etc.",
                      options: {
                        collapsible: true,
                        collapsed: false
                      },
                      fields: [
                        defineField({ name: "w_patient_facing", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_tech_equipment", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_lab_research", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_counseling_education", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_pediatrics", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_geriatrics", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_exposure_tolerance", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_analytical", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_admin", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_procedural_dexterity", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_collaboration", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_pace_routine", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_pace_fast", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_schedule_flex", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_stress_tolerance", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_physical_light", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_physical_on_feet", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_physical_lifting", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_env_hospital", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_env_clinic", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_env_community", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_env_school", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_env_lab", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_env_office", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_multi_env", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_outlook_importance", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 }),
                        defineField({ name: "w_short_path", type: "number", validation: (r) => r.min(-2).max(2), initialValue: 0 })
                      ]
                    }),
                    defineField({ 
                      name: "hardFilter", 
                      title: "Hard Filter (Optional)", 
                      type: "hardFilter",
                      description: "If set, this option will exclude careers based on the filter criteria. Leave empty if this option should not filter careers."
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
    })
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "title.es"
    },
    prepare: ({ title, subtitle }) => ({
      title: title || "Untitled Quiz",
      subtitle: subtitle
    })
  }
})

