import { defineArrayMember, defineField, defineType } from "sanity"
import { SparklesIcon } from "@sanity/icons"

export const scholarship = defineType({
  name: "scholarship",
  title: "Scholarship",
  type: "document",
  icon: SparklesIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "summary", title: "Summary", type: "localizedString" }),
    defineField({ 
      name: "description", 
      title: "Description", 
      type: "localizedText",
      description: "Detailed description shown in the listing (e.g., 'Provides last-dollar funding for high-demand programs...')"
    }),
    defineField({ 
      name: "institution", 
      title: "Institution", 
      type: "string",
      description: "Name of the institution offering the scholarship (e.g., 'VIRGINIA COMMUNITY COLLEGE SYSTEM')"
    }),
    defineField({ name: "eligibility", title: "Eligibility", type: "localizedPortableText" }),
    defineField({ name: "region", title: "Region", type: "string" }),
    defineField({ name: "deadline", title: "Deadline", type: "date" }),
    defineField({ name: "link", title: "Link", type: "url", validation: (r) => r.required() }),
    defineField({
      name: "currentStage",
      title: "Current Stage",
      type: "array",
      description: "Select all applicable stages for this scholarship",
      of: [
        defineArrayMember({
          type: "string",
          options: {
            list: [
              { title: "High School Student", value: "high_school" },
              { title: "College Student", value: "college" },
              { title: "Graduate Student", value: "graduate" },
              { title: "Working Professional", value: "working_professional" },
              { title: "Veteran, Military", value: "veteran_military" },
              { title: "Adult Returning to School", value: "adult_returning" }
            ]
          }
        })
      ]
    }),
    defineField({
      name: "fundingType",
      title: "Funding Type",
      type: "string",
      description: "Type of funding (e.g., 'Federal', 'State', 'Institutional', 'Private')",
      options: {
        list: [
          { title: "Federal", value: "federal" },
          { title: "State", value: "state" },
          { title: "Institutional", value: "institutional" },
          { title: "Private", value: "private" },
          { title: "Foundation", value: "foundation" },
          { title: "Other", value: "other" }
        ]
      }
    }),
    defineField({
      name: "locationScope",
      title: "Location & Scope",
      type: "string",
      description: "Geographic scope of the scholarship",
      options: {
        list: [
          { title: "Virginia Statewide", value: "virginia_statewide" },
          { title: "Regional", value: "regional" },
          { title: "National", value: "national" },
          { title: "Local", value: "local" },
          { title: "International", value: "international" }
        ]
      }
    }),
    defineField({
      name: "careerAreas",
      title: "Career Areas",
      type: "array",
      description: "Career areas this scholarship supports",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "careerCategory" }]
        })
      ]
    }),
    defineField({
      name: "badges",
      title: "Badges/Tags",
      type: "array",
      description: "Tags displayed as badges (e.g., 'Undergraduate', 'Graduate', 'Multiple cohorts available', 'Health-related fields')",
      of: [
        defineArrayMember({
          type: "string",
          options: {
            list: [
              { title: "Undergraduate", value: "undergraduate" },
              { title: "Graduate", value: "graduate" },
              { title: "Undergraduate and Graduate", value: "undergraduate_graduate" },
              { title: "Multiple cohorts available", value: "multiple_cohorts" },
              { title: "Health-related fields", value: "health_related" }
            ]
          }
        })
      ]
    })
  ],
  preview: {
    select: { 
      title: "name", 
      institution: "institution",
      region: "region",
      fundingType: "fundingType"
    },
    prepare({ title, institution, region, fundingType }) {
      // Show institution if available, otherwise show region or funding type, otherwise nothing
      const subtitle = institution || region || (fundingType ? `Funding: ${fundingType}` : undefined)
      return {
        title: title || "Untitled Scholarship",
        subtitle: subtitle
      }
    }
  }
})


