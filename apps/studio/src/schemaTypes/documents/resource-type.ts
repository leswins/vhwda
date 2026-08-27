import { defineField, defineType } from "sanity"
import { TagIcon } from "@sanity/icons"

export const resourceType = defineType({
  name: "resourceType",
  title: "Resource Type",
  type: "document",
  icon: TagIcon,
  description:
    "Defines a section on the public Resources Hub and/or the teacher library. Add a new type here to create a new section on the site without a code change.",
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
      type: "string",
      description: "URL-safe id used in the hub and submission form (e.g. internships, grants).",
      validation: (r) =>
        r
          .required()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
            name: "slug",
            invert: false
          })
          .error("Use lowercase letters, numbers, and hyphens only")
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localizedString",
      description: "Short copy shown on the Resources Hub shortcut card."
    }),
    defineField({
      name: "accent",
      title: "Accent color",
      type: "string",
      initialValue: "green",
      options: {
        list: [
          { title: "Green", value: "green" },
          { title: "Pink", value: "pink" },
          { title: "Blue", value: "blue" },
          { title: "Yellow", value: "yellow" },
          { title: "Orange", value: "orange" }
        ],
        layout: "radio"
      },
      validation: (r) => r.required()
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      initialValue: "document",
      options: {
        list: [
          { title: "Help / aid", value: "help" },
          { title: "Professional / clinician", value: "doctor" },
          { title: "Education / schools", value: "education" },
          { title: "Internship / briefcase", value: "briefcase" },
          { title: "Grant / funding", value: "grant" },
          { title: "Document / download", value: "document" }
        ]
      },
      validation: (r) => r.required()
    }),
    defineField({
      name: "iconImage",
      title: "Custom icon (optional)",
      type: "image",
      description: "If set, replaces the built-in icon on the hub."
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      type: "number",
      initialValue: 100,
      validation: (r) => r.required().integer()
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string",
      initialValue: "publicHub",
      options: {
        list: [
          { title: "Public Resources Hub", value: "publicHub" },
          { title: "Teacher portal only", value: "teacherPortal" },
          { title: "Both", value: "both" }
        ],
        layout: "radio"
      },
      validation: (r) => r.required()
    }),
    defineField({
      name: "sourceKind",
      title: "Content source",
      type: "string",
      initialValue: "generic",
      description:
        "Use a specialized source for existing scholarship, organization, or school content. Use Generic for any new type you add.",
      options: {
        list: [
          { title: "Generic hub resources", value: "generic" },
          { title: "Scholarships (existing documents)", value: "scholarship" },
          { title: "Professional organizations (existing documents)", value: "professionalOrganization" },
          { title: "Educational institutions (existing documents)", value: "educationalInstitution" }
        ]
      },
      validation: (r) => r.required()
    }),
    defineField({
      name: "showInSubmissionForm",
      title: "Show in external submission form",
      type: "boolean",
      initialValue: true
    }),
    defineField({
      name: "allowFileAttachment",
      title: "Allow downloadable file / teacher repository",
      type: "boolean",
      initialValue: false,
      description: "When enabled, submissions and CMS entries can include a file for the teacher library."
    }),
    defineField({
      name: "enabled",
      title: "Enabled",
      type: "boolean",
      initialValue: true
    })
  ],
  preview: {
    select: {
      title: "title.en",
      slug: "slug",
      audience: "audience",
      enabled: "enabled"
    },
    prepare({ title, slug, audience, enabled }) {
      const parts = [slug, audience, enabled === false ? "disabled" : undefined].filter(Boolean)
      return {
        title: title || "Untitled resource type",
        subtitle: parts.join(" · ")
      }
    }
  },
  orderings: [
    {
      title: "Sort order",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }]
    }
  ]
})
