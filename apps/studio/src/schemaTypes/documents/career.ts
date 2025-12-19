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
    defineField({ name: "educationRequirements", title: "Education Requirements", type: "localizedPortableText" }),
    defineField({ name: "prerequisites", title: "Prerequisites", type: "localizedPortableText" }),
    defineField({
      name: "licensureAndCerts",
      title: "Licensure & Certifications",
      description: "Enter one bullet per item (do not include the section title).",
      type: "localizedBulletList"
    }),

    defineField({ name: "salary", title: "Salary", type: "salary" }),
    defineField({ name: "outlook", title: "Outlook", type: "outlook" }),

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


