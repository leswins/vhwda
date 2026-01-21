import { defineField, defineType } from "sanity"
import { BookIcon } from "@sanity/icons"

export const educationalInstitution = defineType({
  name: "educationalInstitution",
  title: "Educational Institution",
  type: "document",
  icon: BookIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" }
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "geopoint",
      validation: (r) => r.required()
    }),
    defineField({ name: "address", title: "Address", type: "string" }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
      validation: (r) => r.uri({ scheme: ["http", "https"] })
    }),
    defineField({
      name: "region",
      title: "Region",
      type: "string",
      options: {
        list: [
          { title: "Northern VA", value: "Northern VA" },
          { title: "Blue Ridge", value: "Blue Ridge" },
          { title: "Rappahannock", value: "Rappahannock" },
          { title: "Central", value: "Central" },
          { title: "Southside", value: "Southside" },
          { title: "Eastern VA", value: "Eastern VA" },
          { title: "South Central", value: "South Central" },
          { title: "Southwest", value: "Southwest" }
        ]
      }
    })
  ],
  preview: {
    select: { title: "name", subtitle: "region" }
  }
})

