import { defineArrayMember, defineField, defineType } from "sanity"
import { LinkIcon } from "@sanity/icons"

export const resource = defineType({
  name: "resource",
  title: "Hub Resource",
  type: "document",
  icon: LinkIcon,
  description:
    "Generic resource used for new hub types (internships, grants, teacher materials, and any type added later). Scholarships, organizations, and schools keep their dedicated document types.",
  fields: [
    defineField({
      name: "resourceType",
      title: "Resource type",
      type: "reference",
      to: [{ type: "resourceType" }],
      description: "Required. This is what places the item in a hub or teacher-library section.",
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
      type: "localizedString"
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localizedText"
    }),
    defineField({
      name: "institution",
      title: "Institution / organization",
      type: "string"
    }),
    defineField({
      name: "eligibility",
      title: "Eligibility",
      type: "localizedText"
    }),
    defineField({
      name: "region",
      title: "Region",
      type: "string"
    }),
    defineField({
      name: "deadline",
      title: "Deadline",
      type: "date"
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "url",
      description: "Outbound URL. Optional when a downloadable file is provided for teachers."
    }),
    defineField({
      name: "file",
      title: "Downloadable file",
      type: "file",
      description: "Used by the teacher portal. Public hub listings do not expose this file."
    }),
    defineField({
      name: "fileUrl",
      title: "External file URL",
      type: "url",
      description: "Optional alternative to an uploaded file (e.g. a private Supabase Storage URL)."
    }),
    defineField({
      name: "fileLabel",
      title: "File label",
      type: "string",
      description: "Optional download button label (e.g. Lesson plan PDF)."
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
