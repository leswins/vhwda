import { defineArrayMember, defineField, defineType } from "sanity"
import { ThLargeIcon } from "@sanity/icons"
import { careerHardFilter } from "../objects/careerHardFilter"

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
      title: "Academic Pathway",
      description: "Use Normal + Small only (no headings). Keep this text as the source/fallback while a visual pathway is drafted.",
      type: "localizedPortableTextSmall"
    }),
    defineField({
      name: "academicPathway",
      title: "Visual Academic Pathway",
      description:
        "Structured steps rendered as a diagram on the Career Detail page. Copy from the Academic Pathway text above — do not invent missing degrees or credentials. Only Verified pathways replace the text on the website.",
      type: "academicPathway"
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
      title: "Hard Filter Requirements",
      type: "object",
      description: "Hard requirements that exclude this career if user's quiz answers don't match. Enable toggles to activate specific filters.",
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
          name: "requiresAcuteStress",
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
      description:
        "Add institutions related to this career. One item per institution. Set Program URL to the school’s page for this career’s program (not the school homepage).",
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
              description:
                "Deep link to this career’s program at this school. If empty, the site falls back to the institution website.",
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
            select: {
              label: "label",
              institutionName: "institution.name",
              programUrl: "programUrl"
            },
            prepare: ({ label, institutionName, programUrl }) => ({
              title: label || institutionName || "Institution",
              subtitle: programUrl ? "Program URL set" : "Using institution website (no program URL)"
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
    defineField({
      name: "videoClosedCaptions",
      title: "Video Closed Captions",
      description: "Add one caption chunk per line. These rotate in the caption banner on the career video.",
      type: "localizedBulletList"
    }),
    defineField({
      name: "videoCaptionCycleSeconds",
      title: "Video Caption Cycle Seconds",
      description: "How long each caption chunk stays visible before cycling to the next one.",
      type: "number",
      initialValue: () => 4,
      validation: (r) => r.min(1).max(30)
    }),

    defineField({ name: "lastReviewedAt", title: "Last Reviewed", type: "datetime" }),
    defineField({ name: "lastUpdatedAt", title: "Last Updated", type: "datetime" })
  ],
  preview: {
    select: { title: "title.en", subtitle: "slug.current" }
  }
})


