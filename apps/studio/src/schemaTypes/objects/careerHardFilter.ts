import { defineField, defineType } from "sanity"

export const careerHardFilter = defineType({
  name: "careerHardFilter",
  title: "Hard Filter Requirement",
  type: "object",
  description: "A requirement that will exclude this career if user's quiz answers don't match",
  fields: [
    defineField({
      name: "type",
      title: "Filter Type",
      type: "string",
      description: "Type of requirement",
      validation: (r) => r.required(),
      options: {
        list: [
          { 
            title: "✓ Minimum Education Required", 
            value: "education_ceiling"
          },
          { 
            title: "✓ Requires Licensure/Certification", 
            value: "licensure_required"
          },
          { 
            title: "✓ Minimum Starting Salary", 
            value: "min_start_salary"
          },
          { 
            title: "✓ Requires Heavy Lifting", 
            value: "dealbreaker_lifting"
          },
          { 
            title: "✓ Requires Nights/Weekends/Holidays", 
            value: "dealbreaker_nights_weekends"
          },
          { 
            title: "✓ Requires Blood/Needles Exposure", 
            value: "dealbreaker_blood_needles"
          },
          { 
            title: "✓ Requires High Stress/Emergencies", 
            value: "dealbreaker_high_stress"
          },
          { 
            title: "Region Specific", 
            value: "region"
          }
        ]
      }
    }),
    defineField({
      name: "educationLevel",
      title: "Education Level",
      type: "string",
      description: "Minimum education level required (only for education_ceiling type)",
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
      hidden: ({ parent }) => parent?.type !== "education_ceiling",
      validation: (r) => 
        r.custom((value, context) => {
          const parent = context.parent as { type?: string }
          if (parent?.type === "education_ceiling" && !value) {
            return "Education level is required when filter type is 'Minimum Education Required'"
          }
          return true
        })
    }),
    defineField({
      name: "minSalary",
      title: "Minimum Starting Salary ($)",
      type: "number",
      description: "Minimum starting salary in USD (only for min_start_salary type). This should match or be higher than salary.rangeMin.",
      hidden: ({ parent }) => parent?.type !== "min_start_salary",
      validation: (r) => 
        r.custom((value, context) => {
          const parent = context.parent as { type?: string }
          if (parent?.type === "min_start_salary") {
            if (!value || value <= 0) {
              return "Minimum salary is required and must be greater than 0 when filter type is 'Minimum Starting Salary'"
            }
          }
          return true
        })
    }),
    defineField({
      name: "region",
      title: "Region",
      type: "string",
      description: "Specific region where this career is available (only for region type)",
      hidden: ({ parent }) => parent?.type !== "region"
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
      type: "type",
      educationLevel: "educationLevel",
      minSalary: "minSalary",
      region: "region"
    },
    prepare({ type, educationLevel, minSalary, region }) {
      let subtitle = ""
      
      if (type === "education_ceiling") {
        subtitle = `Education: ${educationLevel || "Not set"}`
      } else if (type === "min_start_salary") {
        subtitle = minSalary ? `Min Salary: $${minSalary.toLocaleString()}` : "Min Salary: Not set"
      } else if (type === "licensure_required") {
        subtitle = "Requires licensure/certification"
      } else if (type?.startsWith("dealbreaker_")) {
        const labels: Record<string, string> = {
          "dealbreaker_lifting": "Requires heavy lifting",
          "dealbreaker_nights_weekends": "Requires nights/weekends/holidays",
          "dealbreaker_blood_needles": "Requires blood/needles exposure",
          "dealbreaker_high_stress": "Requires high stress/emergencies"
        }
        subtitle = labels[type] || "Deal-breaker requirement"
      } else if (type === "region") {
        subtitle = region ? `Region: ${region}` : "Region: Not set"
      }
      
      const titles: Record<string, string> = {
        "education_ceiling": "Minimum Education",
        "licensure_required": "Requires Licensure",
        "min_start_salary": "Minimum Salary",
        "dealbreaker_lifting": "Heavy Lifting",
        "dealbreaker_nights_weekends": "Nights/Weekends",
        "dealbreaker_blood_needles": "Blood/Needles",
        "dealbreaker_high_stress": "High Stress",
        "region": "Region"
      }
      
      return {
        title: titles[type || ""] || type || "Hard Filter",
        subtitle
      }
    }
  }
})

