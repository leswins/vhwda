import { defineField, defineType } from "sanity"

export const careerHardFilter = defineType({
  name: "careerHardFilter",
  title: "Hard Filter Requirement",
  type: "object",
  description: "A requirement that will exclude this career if user's quiz answers don't match. Enable toggles to activate specific filters.",
  fields: [
    defineField({
      name: "requiresLicensure",
      title: "Requires Licensure",
      type: "boolean",
      description: "If true, users who refuse licensure will not see this career",
      initialValue: () => false
    }),
    defineField({
      name: "requiresLifting",
      title: "Requires Heavy Lifting",
      type: "boolean",
      description: "If true, users who refuse lifting will not see this career",
      initialValue: () => false
    }),
    defineField({
      name: "requiresNightsWeekends",
      title: "Requires Nights/Weekends/Holidays",
      type: "boolean",
      description: "If true, users who refuse nights/weekends will not see this career",
      initialValue: () => false
    }),
    defineField({
      name: "requiresBloodNeedles",
      title: "Requires Blood/Needles Exposure",
      type: "boolean",
      description: "If true, users who refuse blood/needles will not see this career",
      initialValue: () => false
    }),
    defineField({
      name: "requiresAcuteHighStress",
      title: "Requires High Stress/Emergencies",
      type: "boolean",
      description: "If true, users who refuse high stress will not see this career",
      initialValue: () => false
    }),
    defineField({
      name: "hasMinimumEducation",
      title: "Minimum Education Required",
      type: "boolean",
      description: "If true, users who select education below the required level will not see this career",
      initialValue: () => false
    }),
    defineField({
      name: "educationLevel",
      title: "Education Level",
      type: "string",
      description: "Minimum education level required (only shown when 'Minimum Education Required' is enabled)",
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
      hidden: ({ parent }) => {
        const hasEducation = (parent as any)?.hasMinimumEducation === true
        return !hasEducation
      },
      validation: (r) => 
        r.custom((value, context) => {
          const parent = context.parent as { hasMinimumEducation?: boolean }
          if (parent?.hasMinimumEducation && !value) {
            return "Education level is required when 'Minimum Education Required' is enabled"
          }
          return true
        })
    }),
    defineField({
      name: "hasMinimumSalary",
      title: "Minimum Starting Salary",
      type: "boolean",
      description: "If true, uses the career's entry level salary (salary.rangeMin) as the minimum requirement. Users who select a lower minimum salary will not see this career.",
      initialValue: () => false
    }),
    defineField({
      name: "region",
      title: "Region",
      type: "string",
      description: "Geographic region filter (optional)"
    }),
    defineField({
      name: "note",
      title: "Internal Note (Optional)",
      type: "string",
      description: "Optional note for internal reference (not shown to users)",
      placeholder: "e.g., 'This is a critical requirement'"
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
      region: "region",
      note: "note"
    },
    prepare({ requiresLicensure, requiresLifting, requiresNightsWeekends, requiresBloodNeedles, requiresAcuteHighStress, hasMinimumEducation, educationLevel, hasMinimumSalary, region, note }) {
      const activeFilters: string[] = []
      
      if (requiresLicensure) activeFilters.push("Requires Licensure")
      if (requiresLifting) activeFilters.push("Requires Heavy Lifting")
      if (requiresNightsWeekends) activeFilters.push("Requires Nights/Weekends")
      if (requiresBloodNeedles) activeFilters.push("Requires Blood/Needles")
      if (requiresAcuteHighStress) activeFilters.push("Requires High Stress")
      if (hasMinimumEducation) {
        const eduLabel = educationLevel ? ` (${educationLevel})` : ""
        activeFilters.push(`Min Education${eduLabel}`)
      }
      if (hasMinimumSalary) activeFilters.push("Min Salary")
      if (region) activeFilters.push(`Region: ${region}`)
      
      const subtitle = activeFilters.length > 0 ? activeFilters.join(", ") : "No filters enabled"
      
      return {
        title: note || "Hard Filter Requirement",
        subtitle
      }
    }
  }
})
