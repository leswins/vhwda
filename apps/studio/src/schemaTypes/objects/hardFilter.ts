import { defineField, defineType } from "sanity"

export const hardFilter = defineType({
  name: "hardFilter",
  title: "Hard Filter",
  type: "object",
  description: "Filter that excludes careers when this option is selected. Enable toggles to activate specific filters.",
  fields: [
    defineField({
      name: "requiresLicensure",
      title: "Requires Licensure",
      type: "boolean",
      description: "If true, users who refuse licensure will not see this career",
      initialValue: false
    }),
    defineField({
      name: "requiresLifting",
      title: "Requires Lifting",
      type: "boolean",
      description: "If true, users who refuse lifting will not see this career",
      initialValue: false
    }),
    defineField({
      name: "requiresNightsWeekends",
      title: "Requires Nights/Weekends",
      type: "boolean",
      description: "If true, users who refuse nights/weekends will not see this career",
      initialValue: false
    }),
    defineField({
      name: "requiresBloodNeedles",
      title: "Requires Blood/Needles Exposure",
      type: "boolean",
      description: "If true, users who refuse blood/needles will not see this career",
      initialValue: false
    }),
    defineField({
      name: "requiresAcuteHighStress",
      title: "Requires Acute/High Stress",
      type: "boolean",
      description: "If true, users who refuse high stress will not see this career",
      initialValue: false
    }),
    defineField({
      name: "hasMinimumEducation",
      title: "Minimum Education",
      type: "boolean",
      description: "If true, users who select education below the required level will not see this career",
      initialValue: false
    }),
    defineField({
      name: "educationLevel",
      title: "Education Level",
      type: "string",
      description: "Maximum education level to exclude (excludes careers requiring higher)",
      options: {
        list: [
          { title: "FastForward / <6 months", value: "FF" },
          { title: "Career Studies Certificate (~12-18 credits)", value: "CSC" },
          { title: "Certificate", value: "CERT" },
          { title: "Associate (AAS/2 years)", value: "AAS" },
          { title: "Bachelor's (≈4 years)", value: "BACH" },
          { title: "Graduate degree", value: "GRAD" }
        ]
      },
      hidden: ({ parent }) => !parent?.hasMinimumEducation,
      validation: (r) => 
        r.custom((value, context) => {
          const parent = context.parent as { hasMinimumEducation?: boolean }
          if (parent?.hasMinimumEducation && !value) {
            return "Education level is required when 'Minimum Education' is enabled"
          }
          return true
        })
    }),
    defineField({
      name: "hasMinimumSalary",
      title: "Minimum Starting Salary",
      type: "boolean",
      description: "If true, uses the career's entry level salary (salary.rangeMin) as the minimum requirement. Users who select a lower minimum salary will not see this career.",
      initialValue: false
    }),
    defineField({
      name: "region",
      title: "Region",
      type: "string",
      description: "Geographic region filter"
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
      requiresLicensure: "requiresLicensure",
      requiresLifting: "requiresLifting",
      requiresNightsWeekends: "requiresNightsWeekends",
      requiresBloodNeedles: "requiresBloodNeedles",
      requiresAcuteHighStress: "requiresAcuteHighStress",
      hasMinimumEducation: "hasMinimumEducation",
      educationLevel: "educationLevel",
      hasMinimumSalary: "hasMinimumSalary",
      description: "description"
    },
    prepare({ requiresLicensure, requiresLifting, requiresNightsWeekends, requiresBloodNeedles, requiresAcuteHighStress, hasMinimumEducation, educationLevel, hasMinimumSalary, description }) {
      const activeFilters: string[] = []
      
      if (requiresLicensure) activeFilters.push("Requires Licensure")
      if (requiresLifting) activeFilters.push("Requires Lifting")
      if (requiresNightsWeekends) activeFilters.push("Requires Nights/Weekends")
      if (requiresBloodNeedles) activeFilters.push("Requires Blood/Needles")
      if (requiresAcuteHighStress) activeFilters.push("Requires High Stress")
      if (hasMinimumEducation) {
        const eduLabel = educationLevel ? ` (${educationLevel})` : ""
        activeFilters.push(`Min Education${eduLabel}`)
      }
      if (hasMinimumSalary) activeFilters.push("Min Salary")
      
      const subtitle = activeFilters.length > 0 ? activeFilters.join(", ") : "No filters enabled"
      
      return {
        title: description || "Hard Filter",
        subtitle
      }
    }
  }
})
