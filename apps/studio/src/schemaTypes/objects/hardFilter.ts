import { defineField, defineType } from "sanity"

export const hardFilter = defineType({
  name: "hardFilter",
  title: "Hard Filter",
  type: "object",
  description: "Filter that excludes careers when this option is selected",
  fields: [
    defineField({
      name: "type",
      title: "Filter Type",
      type: "string",
      description: "Type of hard filter to apply (leave empty if this option should not filter careers)",
      options: {
        list: [
          { 
            title: "Education Ceiling", 
            value: "education_ceiling"
          },
          { 
            title: "Licensure Rule", 
            value: "licensure_rule"
          },
          { 
            title: "Minimum Start Salary", 
            value: "min_start_salary"
          },
          { 
            title: "Deal-breaker", 
            value: "dealbreaker"
          },
          { 
            title: "Region", 
            value: "region"
          }
        ]
      }
    }),
    defineField({
      name: "educationLevel",
      title: "Education Level",
      type: "string",
      description: "Maximum education level to exclude (excludes careers requiring higher)",
      options: {
        list: [
          { title: "Free Form (FF)", value: "FF" },
          { title: "College Success Course (CSC)", value: "CSC" },
          { title: "Certificate (CERT)", value: "CERT" },
          { title: "Associate (AAS)", value: "AAS" },
          { title: "Bachelor (BACH)", value: "BACH" },
          { title: "Graduate (GRAD)", value: "GRAD" }
        ]
      },
      hidden: ({ parent }) => !parent?.type || parent?.type !== "education_ceiling",
      validation: (r) => 
        r.custom((value, context) => {
          const parent = context.parent as { type?: string }
          if (parent?.type === "education_ceiling" && !value) {
            return "Education level is required when filter type is 'Education Ceiling'"
          }
          return true
        })
    }),
    defineField({
      name: "excludeLicensure",
      title: "Exclude Licensure Required",
      type: "boolean",
      description: "If true, excludes careers that require licensure/certification",
      initialValue: true,
      hidden: ({ parent }) => !parent?.type || parent?.type !== "licensure_rule",
      validation: (r) => 
        r.custom((value, context) => {
          const parent = context.parent as { type?: string }
          if (parent?.type === "licensure_rule" && value === undefined) {
            return "Exclude licensure flag is required when filter type is 'Licensure Rule'"
          }
          return true
        })
    }),
    defineField({
      name: "salaryMin",
      title: "Minimum Starting Salary ($)",
      type: "number",
      description: "Minimum starting salary in USD (excludes careers with lower starting salary)",
      hidden: ({ parent }) => !parent?.type || parent?.type !== "min_start_salary",
      validation: (r) => 
        r.custom((value, context) => {
          const parent = context.parent as { type?: string }
          if (parent?.type === "min_start_salary") {
            if (!value || value <= 0) {
              return "Minimum salary is required and must be greater than 0 when filter type is 'Minimum Start Salary'"
            }
          }
          return true
        })
    }),
    defineField({
      name: "dealbreakerType",
      title: "Deal-breaker Type",
      type: "string",
      description: "Select which deal-breaker requirement to exclude",
      options: {
        list: [
          { title: "Heavy Lifting / Patient Transfers", value: "exclude_requires_lifting" },
          { title: "Nights / Weekends / Holidays", value: "exclude_requires_nights_weekends" },
          { title: "Blood / Needles Exposure", value: "exclude_requires_blood_needles" },
          { title: "High Stress / Emergencies", value: "exclude_requires_acute_stress" }
        ]
      },
      hidden: ({ parent }) => !parent?.type || parent?.type !== "dealbreaker",
      validation: (r) => 
        r.custom((value, context) => {
          const parent = context.parent as { type?: string }
          if (parent?.type === "dealbreaker" && !value) {
            return "Deal-breaker type is required when filter type is 'Deal-breaker'"
          }
          return true
        })
    }),
    defineField({
      name: "region",
      title: "Region",
      type: "string",
      description: "Geographic region filter",
      hidden: ({ parent }) => !parent?.type || parent?.type !== "region"
    }),
    defineField({
      name: "description",
      title: "Filter Description (for reference)",
      type: "string",
      description: "Optional: Human-readable description of what this filter does (for documentation)",
      placeholder: "e.g., 'Exclude careers requiring higher education than selected'"
    })
  ],
  preview: {
    select: {
      type: "type",
      educationLevel: "educationLevel",
      salaryMin: "salaryMin",
      excludeLicensure: "excludeLicensure",
      dealbreakerType: "dealbreakerType",
      description: "description"
    },
    prepare({ type, educationLevel, salaryMin, excludeLicensure, dealbreakerType, description }) {
      let subtitle = ""
      
      if (type === "education_ceiling") {
        subtitle = `Education: ${educationLevel || "Not set"}`
      } else if (type === "licensure_rule") {
        subtitle = excludeLicensure ? "Exclude careers requiring licensure" : "Include all"
      } else if (type === "min_start_salary") {
        subtitle = salaryMin ? `Min salary: $${salaryMin.toLocaleString()}` : "Min salary: Not set"
      } else if (type === "dealbreaker") {
        const labels: Record<string, string> = {
          "exclude_requires_lifting": "Exclude: Heavy Lifting",
          "exclude_requires_nights_weekends": "Exclude: Nights/Weekends",
          "exclude_requires_blood_needles": "Exclude: Blood/Needles",
          "exclude_requires_acute_stress": "Exclude: High Stress"
        }
        subtitle = dealbreakerType ? labels[dealbreakerType] || "Deal-breaker" : "Deal-breaker: Not set"
      } else if (type === "region") {
        subtitle = "Region filter"
      }
      
      return {
        title: description || type || "Hard Filter",
        subtitle
      }
    }
  }
})

