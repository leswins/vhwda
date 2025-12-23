import { defineArrayMember, defineField, defineType } from "sanity"
import { ThLargeIcon } from "@sanity/icons"

export const career = defineType({
  name: "career",
  title: "Career",
  type: "document",
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      validation: (r) => r.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: (doc: any) => doc?.title?.en }
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "localizedText"
    }),

    defineField({
      name: "responsibilities",
      title: "Responsibilities",
      description: "Enter one bullet per item (do not include the section title).",
      type: "localizedBulletList"
    }),
    defineField({
      name: "workEnvironment",
      title: "Work Environment",
      description: "Enter one item per environment (do not include the section title).",
      type: "localizedBulletList"
    }),
    defineField({
      name: "specializations",
      title: "Areas of Specialization",
      description: "Enter one item per specialization (do not include the section title).",
      type: "localizedBulletList"
    }),
    defineField({
      name: "specializationsNote",
      title: "Areas of Specialization (note)",
      description: "Optional text shown beneath the specialization bullets.",
      type: "localizedPortableTextSmall"
    }),
    defineField({
      name: "educationRequirements",
      title: "Education Requirements",
      description: "Use Normal + Small only (no headings).",
      type: "localizedPortableTextSmall"
    }),
    defineField({ name: "prerequisites", title: "Prerequisites", type: "localizedPortableText" }),
    defineField({
      name: "licensureAndCerts",
      title: "Licensure & Certifications",
      description: "Enter one bullet per item (do not include the section title).",
      type: "localizedBulletList"
    }),

    defineField({
      name: "academicRequirementsHighlight",
      title: "Academic Requirements (highlight)",
      description: "Short highlight shown in the top-right widget (e.g., “Associate/Bachelors”).",
      type: "localizedString"
    }),
    defineField({
      name: "programLengthHighlight",
      title: "Program Length (highlight)",
      description: "Short highlight shown in the top-right widget (e.g., “2–4 Years”).",
      type: "localizedString"
    }),

    defineField({ name: "salary", title: "Salary", type: "salary" }),
    defineField({ name: "outlook", title: "Outlook", type: "outlook" }),

    // Quiz fields
    defineField({
      name: "educationMin",
      title: "Minimum Education Required",
      type: "string",
      description: "Minimum education level needed for this career",
      options: {
        list: [
          { title: "Free Form (FF)", value: "FF" },
          { title: "College Success Course (CSC)", value: "CSC" },
          { title: "Certificate (CERT)", value: "CERT" },
          { title: "Associate (AAS)", value: "AAS" },
          { title: "Bachelor (BACH)", value: "BACH" },
          { title: "Graduate (GRAD)", value: "GRAD" }
        ]
      }
    }),
    defineField({
      name: "licensureRequired",
      title: "Licensure Required",
      type: "boolean",
      description: "Does this career require a license or certification?"
    }),
    defineField({
      name: "quizVector",
      title: "Quiz Vector (Matching Weights)",
      type: "object",
      description: "Weights for career matching algorithm. Values range from -2 to +2. Higher values = stronger alignment.",
      fields: [
        // Interest dimensions
        defineField({ name: "w_patient_facing", title: "Patient Facing", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_tech_equipment", title: "Tech/Equipment", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_lab_research", title: "Lab/Research", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_counseling_education", title: "Counseling/Education", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_pediatrics", title: "Pediatrics", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_geriatrics", title: "Geriatrics", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_exposure_tolerance", title: "Exposure Tolerance", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_analytical", title: "Analytical", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_admin", title: "Administrative", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_procedural_dexterity", title: "Procedural Dexterity", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_collaboration", title: "Collaboration", type: "number", validation: (r) => r.min(-2).max(2) }),
        
        // Pace & Schedule dimensions
        defineField({ name: "w_pace_routine", title: "Pace: Routine", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_pace_fast", title: "Pace: Fast", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_schedule_flex", title: "Schedule Flexibility", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_stress_tolerance", title: "Stress Tolerance", type: "number", validation: (r) => r.min(-2).max(2) }),
        
        // Physical dimensions
        defineField({ name: "w_physical_light", title: "Physical: Light", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_physical_on_feet", title: "Physical: On Feet", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_physical_lifting", title: "Physical: Lifting", type: "number", validation: (r) => r.min(-2).max(2) }),
        
        // Environment dimensions
        defineField({ name: "w_env_hospital", title: "Environment: Hospital", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_env_clinic", title: "Environment: Clinic", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_env_community", title: "Environment: Community", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_env_school", title: "Environment: School", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_env_lab", title: "Environment: Lab", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_env_office", title: "Environment: Office", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_multi_env", title: "Multiple Environments", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_outlook_importance", title: "Outlook Importance", type: "number", validation: (r) => r.min(-2).max(2) }),
        defineField({ name: "w_short_path", title: "Short Path Preference", type: "number", validation: (r) => r.min(-2).max(2) })
      ]
    }),
    defineField({
      name: "hardRequirements",
      title: "Hard Requirements (Dealbreakers)",
      type: "object",
      description: "Requirements that will exclude this career if user refuses them",
      fields: [
        defineField({
          name: "requiresLicensure",
          title: "Requires Licensure",
          type: "boolean",
          description: "If true, users who refuse licensure will not see this career"
        }),
        defineField({
          name: "requiresLifting",
          title: "Requires Lifting",
          type: "boolean",
          description: "If true, users who refuse lifting will not see this career"
        }),
        defineField({
          name: "requiresNightsWeekends",
          title: "Requires Nights/Weekends",
          type: "boolean",
          description: "If true, users who refuse nights/weekends will not see this career"
        }),
        defineField({
          name: "requiresBloodNeedles",
          title: "Requires Blood/Needles Exposure",
          type: "boolean",
          description: "If true, users who refuse blood/needles will not see this career"
        }),
        defineField({
          name: "requiresAcuteStress",
          title: "Requires Acute/High Stress",
          type: "boolean",
          description: "If true, users who refuse high stress will not see this career"
        })
      ]
    }),

    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "careerCategory" }] })]
    }),

    defineField({
      name: "similarCareers",
      title: "Similar Careers",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "career" }] })]
    }),

    defineField({
      name: "programs",
      title: "Programs",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "program" }] })]
    }),
    defineField({
      name: "educationInstitutions",
      title: "Educational Institutions",
      description: "Add institutions related to this career. One item per institution/program link.",
      type: "array",
      of: [
        defineArrayMember({
          name: "educationInstitutionItem",
          title: "Institution",
          type: "object",
          fields: [
            defineField({
              name: "institution",
              title: "Institution",
              type: "reference",
              to: [{ type: "educationalInstitution" }],
              validation: (r) => r.required()
            }),
            defineField({
              name: "programUrl",
              title: "Program URL",
              type: "url",
              validation: (r) => r.uri({ scheme: ["http", "https"] })
            }),
            defineField({
              name: "label",
              title: "Label (optional override)",
              type: "string",
              description: "If set, this label will be shown instead of the institution name."
            })
          ],
          preview: {
            select: { title: "label" },
            prepare: ({ title }) => ({
              title: title || "Institution"
            })
          }
        })
      ]
    }),
    defineField({
      name: "scholarships",
      title: "Scholarships",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "scholarship" }] })]
    }),
    defineField({
      name: "professionalOrgs",
      title: "Professional Organizations",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "professionalOrganization" }] })]
    }),
    defineField({
      name: "resources",
      title: "Resources",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "resource" }] })]
    }),

    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })]
    }),
    defineField({ name: "videoUrl", title: "Video URL", type: "url" }),

    defineField({ name: "lastReviewedAt", title: "Last Reviewed", type: "datetime" }),
    defineField({ name: "lastUpdatedAt", title: "Last Updated", type: "datetime" })
  ],
  preview: {
    select: { title: "title.en", subtitle: "slug.current" }
  }
})


