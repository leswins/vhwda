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
      fields: [defineField({ name: "aiChatEnabled", title: "AI Chat Enabled", type: "boolean" })]
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


