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
          { title: "FastForward / <6 months", value: "FF" },
          { title: "Career Studies Certificate (~12-18 credits)", value: "CSC" },
          { title: "Certificate", value: "CERT" },
          { title: "Associate (AAS/2 years)", value: "AAS" },
          { title: "Bachelor's (≈4 years)", value: "BACH" },
          { title: "Graduate degree", value: "GRAD" }
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
    }),
    defineField({
      name: "_salaryInfo",
      title: "💡 Salary Information",
      type: "string",
      description: "When 'Minimum Starting Salary' is selected, the system will automatically use the 'Entry Level' salary value from the Salary section above (salary.rangeMin). Make sure that field is populated.",
      readOnly: true,
      hidden: ({ parent }) => parent?.type !== "min_start_salary",
      initialValue: "This filter uses salary.rangeMin from the Salary section"
    })
  ],
  preview: {
    select: {
      type: "type",
      educationLevel: "educationLevel",
      region: "region"
    },
    prepare({ type, educationLevel, region }) {
      let subtitle = ""
      
      if (type === "education_ceiling") {
        subtitle = `Education: ${educationLevel || "Not set"}`
      } else if (type === "min_start_salary") {
        subtitle = "Uses Entry Level salary from Salary section"
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
