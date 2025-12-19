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

    defineField({ name: "responsibilities", title: "Responsibilities", type: "localizedPortableText" }),
    defineField({ name: "workEnvironment", title: "Work Environment", type: "localizedPortableText" }),
    defineField({ name: "educationRequirements", title: "Education Requirements", type: "localizedPortableText" }),
    defineField({ name: "prerequisites", title: "Prerequisites", type: "localizedPortableText" }),
    defineField({ name: "licensureAndCerts", title: "Licensure & Certifications", type: "localizedPortableText" }),

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


