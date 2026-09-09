import { defineArrayMember, defineField, defineType } from "sanity"
import { LinkIcon } from "@sanity/icons"
import { isResourceType, RESOURCE_TYPE_IDS } from "./resourceTypeIds"

function requiredForType(typeId: string, message: string) {
  return (value: unknown, context: { document?: unknown }) => {
    if (!isResourceType(context.document, typeId)) return true
    if (Array.isArray(value)) return value.length > 0 ? true : message
    return value ? true : message
  }
}

export const resource = defineType({
  name: "resource",
  title: "Hub Resource",
  type: "document",
  icon: LinkIcon,
  description:
    "Generic listing for internships, grants, educational resources, and any later hub type. Scholarships, organizations, and schools stay in their own folders.",
  fields: [
    defineField({
      name: "resourceType",
      title: "Resource type",
      type: "reference",
      to: [{ type: "resourceType" }],
      description: "Places this item in a hub or teacher-library section and shows the matching fields below.",
      validation: (r) => r.required()
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      validation: (r) => r.required()
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "localizedString",
      description: "Short line shown in the listing."
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localizedText"
    }),
    defineField({
      name: "institution",
      title: "Host / sponsor",
      type: "string",
      description: "Organization offering the experience, funding, or material."
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "url",
      description: "Apply, learn more, or open the material on the web.",
      validation: (r) =>
        r.custom((value, context) => {
          const doc = context.document
          if (isResourceType(doc, RESOURCE_TYPE_IDS.internships) || isResourceType(doc, RESOURCE_TYPE_IDS.grants)) {
            return value ? true : "A link is required for internships and grants"
          }
          return true
        })
    }),
    defineField({
      name: "experienceKind",
      title: "Experience type",
      type: "string",
      hidden: ({ document }) => !isResourceType(document, RESOURCE_TYPE_IDS.internships),
      options: {
        list: [
          { title: "Internship", value: "internship" },
          { title: "Shadowing", value: "shadowing" },
          { title: "Volunteer", value: "volunteer" },
          { title: "Clinical rotation", value: "clinical_rotation" },
          { title: "Research", value: "research" },
          { title: "Apprenticeship", value: "apprenticeship" }
        ]
      },
      validation: (r) => r.custom(requiredForType(RESOURCE_TYPE_IDS.internships, "Select an experience type"))
    }),
    defineField({
      name: "compensation",
      title: "Compensation",
      type: "string",
      hidden: ({ document }) => !isResourceType(document, RESOURCE_TYPE_IDS.internships),
      options: {
        list: [
          { title: "Paid", value: "paid" },
          { title: "Stipend", value: "stipend" },
          { title: "Unpaid", value: "unpaid" }
        ]
      },
      validation: (r) => r.custom(requiredForType(RESOURCE_TYPE_IDS.internships, "Select compensation"))
    }),
    defineField({
      name: "audienceLevel",
      title: "Who it is for",
      type: "array",
      hidden: ({ document }) => !isResourceType(document, RESOURCE_TYPE_IDS.internships),
      of: [
        defineArrayMember({
          type: "string",
          options: {
            list: [
              { title: "High school", value: "high_school" },
              { title: "Undergraduate", value: "undergraduate" },
              { title: "Graduate", value: "graduate" },
              { title: "Career changer", value: "career_changer" }
            ]
          }
        })
      ]
    }),
    defineField({
      name: "setting",
      title: "Setting",
      type: "string",
      hidden: ({ document }) => !isResourceType(document, RESOURCE_TYPE_IDS.internships),
      options: {
        list: [
          { title: "Hospital", value: "hospital" },
          { title: "Clinic", value: "clinic" },
          { title: "Public health", value: "public_health" },
          { title: "Community", value: "community" },
          { title: "Lab / research", value: "lab" },
          { title: "Other", value: "other" }
        ]
      }
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      hidden: ({ document }) => !isResourceType(document, RESOURCE_TYPE_IDS.internships),
      description: "e.g. Summer, 8 weeks, semester."
    }),
    defineField({
      name: "opportunityKind",
      title: "Opportunity type",
      type: "string",
      hidden: ({ document }) => !isResourceType(document, RESOURCE_TYPE_IDS.grants),
      options: {
        list: [
          { title: "Last-dollar / remaining tuition", value: "last_dollar" },
          { title: "Workforce grant", value: "workforce_grant" },
          { title: "Credential funding", value: "credential_funding" },
          { title: "Employer-sponsored", value: "employer_sponsored" },
          { title: "Other", value: "other" }
        ]
      },
      validation: (r) => r.custom(requiredForType(RESOURCE_TYPE_IDS.grants, "Select an opportunity type"))
    }),
    defineField({
      name: "applicantType",
      title: "Who can apply",
      type: "array",
      hidden: ({ document }) => !isResourceType(document, RESOURCE_TYPE_IDS.grants),
      of: [
        defineArrayMember({
          type: "string",
          options: {
            list: [
              { title: "Student", value: "student" },
              { title: "Worker / incumbent", value: "worker" },
              { title: "Adult learner", value: "adult_learner" },
              { title: "Employer", value: "employer" },
              { title: "School / program", value: "school" }
            ]
          }
        })
      ],
      validation: (r) => r.custom(requiredForType(RESOURCE_TYPE_IDS.grants, "Select at least one applicant type"))
    }),
    defineField({
      name: "fundingAmount",
      title: "Funding amount",
      type: "string",
      hidden: ({ document }) => !isResourceType(document, RESOURCE_TYPE_IDS.grants),
      description: "Optional. e.g. Up to $3,000, last-dollar, varies."
    }),
    defineField({
      name: "materialKind",
      title: "Material type",
      type: "string",
      hidden: ({ document }) => !isResourceType(document, RESOURCE_TYPE_IDS.educational),
      options: {
        list: [
          { title: "Lesson plan", value: "lesson_plan" },
          { title: "Curriculum", value: "curriculum" },
          { title: "Activity", value: "activity" },
          { title: "Facilitator guide", value: "facilitator_guide" },
          { title: "Video", value: "video" },
          { title: "Slide deck", value: "slide_deck" },
          { title: "Career profile", value: "career_profile" }
        ]
      },
      validation: (r) => r.custom(requiredForType(RESOURCE_TYPE_IDS.educational, "Select a material type"))
    }),
    defineField({
      name: "gradeBands",
      title: "Grade / audience",
      type: "array",
      hidden: ({ document }) => !isResourceType(document, RESOURCE_TYPE_IDS.educational),
      of: [
        defineArrayMember({
          type: "string",
          options: {
            list: [
              { title: "Elementary", value: "elementary" },
              { title: "Middle school", value: "middle" },
              { title: "High school", value: "high_school" },
              { title: "CTE", value: "cte" },
              { title: "Counselor / advisor", value: "counselor" }
            ]
          }
        })
      ]
    }),
    defineField({
      name: "topicFocus",
      title: "Topic",
      type: "string",
      hidden: ({ document }) => !isResourceType(document, RESOURCE_TYPE_IDS.educational),
      options: {
        list: [
          { title: "Career exploration", value: "career_exploration" },
          { title: "Workplace safety", value: "workplace_safety" },
          { title: "Public health", value: "public_health" },
          { title: "Clinical skills", value: "clinical_skills" },
          { title: "Pathway planning", value: "pathway_planning" }
        ]
      }
    }),
    defineField({
      name: "format",
      title: "Format",
      type: "string",
      hidden: ({ document }) => !isResourceType(document, RESOURCE_TYPE_IDS.educational),
      options: {
        list: [
          { title: "PDF", value: "pdf" },
          { title: "Web page", value: "web" },
          { title: "Video", value: "video" },
          { title: "Slides", value: "slides" }
        ]
      }
    }),
    defineField({
      name: "file",
      title: "Downloadable file",
      type: "file",
      hidden: ({ document }) => !isResourceType(document, RESOURCE_TYPE_IDS.educational),
      description: "Used by the educator portal. Public hub listings do not expose this file."
    }),
    defineField({
      name: "fileUrl",
      title: "External file URL",
      type: "url",
      hidden: ({ document }) => !isResourceType(document, RESOURCE_TYPE_IDS.educational),
      description: "Optional alternative to an uploaded file."
    }),
    defineField({
      name: "fileLabel",
      title: "File label",
      type: "string",
      hidden: ({ document }) => !isResourceType(document, RESOURCE_TYPE_IDS.educational),
      description: "Optional download button label (e.g. Lesson plan PDF)."
    }),
    defineField({
      name: "locationScope",
      title: "Location & scope",
      type: "string",
      hidden: ({ document }) =>
        !isResourceType(document, RESOURCE_TYPE_IDS.internships) &&
        !isResourceType(document, RESOURCE_TYPE_IDS.grants),
      options: {
        list: [
          { title: "Virginia statewide", value: "virginia_statewide" },
          { title: "Regional", value: "regional" },
          { title: "Local", value: "local" },
          { title: "Remote", value: "remote" },
          { title: "National", value: "national" }
        ]
      }
    }),
    defineField({
      name: "region",
      title: "Region (free text)",
      type: "string",
      description: "Optional extra place name, e.g. Southwest Virginia."
    }),
    defineField({
      name: "deadline",
      title: "Deadline",
      type: "date",
      hidden: ({ document }) => isResourceType(document, RESOURCE_TYPE_IDS.educational)
    }),
    defineField({
      name: "eligibility",
      title: "Eligibility",
      type: "localizedText",
      hidden: ({ document }) => isResourceType(document, RESOURCE_TYPE_IDS.educational)
    }),
    defineField({
      name: "careerAreas",
      title: "Career areas",
      type: "array",
      description: "Used to filter this listing by career group.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "careerCategory" }]
        })
      ]
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" }
    }),
    defineField({
      name: "category",
      title: "Legacy category",
      type: "string",
      hidden: true
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true
    })
  ],
  validation: (r) =>
    r.custom((document) => {
      if (!isResourceType(document, RESOURCE_TYPE_IDS.educational)) return true
      const hasFile = Boolean((document as { file?: { asset?: unknown } } | undefined)?.file?.asset)
      const hasFileUrl = Boolean((document as { fileUrl?: string } | undefined)?.fileUrl)
      const hasLink = Boolean((document as { link?: string } | undefined)?.link)
      return hasFile || hasFileUrl || hasLink
        ? true
        : "Add a downloadable file, file URL, or web link for educational resources"
    }),
  preview: {
    select: {
      title: "title.en",
      typeTitle: "resourceType.title.en",
      institution: "institution"
    },
    prepare({ title, typeTitle, institution }) {
      return {
        title: title || "Untitled resource",
        subtitle: [typeTitle, institution].filter(Boolean).join(" · ")
      }
    }
  }
})
