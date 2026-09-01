import { defineArrayMember, defineField, defineType } from "sanity"
import { CogIcon } from "@sanity/icons"

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "navLinks",
      title: "Navigation Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "localizedString", validation: (r) => r.required() }),
            defineField({ name: "href", title: "Href", type: "string", validation: (r) => r.required() })
          ]
        })
      ]
    }),
    defineField({
      name: "footerLinks",
      title: "Footer Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "localizedString", validation: (r) => r.required() }),
            defineField({ name: "href", title: "Href", type: "string", validation: (r) => r.required() })
          ]
        })
      ]
    }),
    defineField({ name: "announcements", title: "Announcements", type: "localizedText" }),
    defineField({
      name: "featureFlags",
      title: "Feature Flags",
      type: "object",
      fields: [
        defineField({ name: "aiChatEnabled", title: "AI Chat Enabled", type: "boolean" }),
        defineField({
          name: "scholarshipsEnabled",
          title: "Scholarships Enabled",
          type: "boolean",
          description: "Controls whether the Scholarships & Financial Aid section is live on the website."
        }),
        defineField({
          name: "demoResourcesEnabled",
          title: "Demo sample resources",
          type: "boolean",
          description:
            "When on, the live site fills empty internships, grants, and teacher-library sections with sample listings. Turn off after the client demo. Does not publish documents to the CMS. A URL of ?demo=1 or ?demo=0 overrides this for the current browser tab."
        })
      ]
    }),
    defineField({
      name: "seoDefaults",
      title: "SEO Defaults",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "localizedString" }),
        defineField({ name: "description", title: "Description", type: "localizedText" })
      ]
    })
  ]
})


