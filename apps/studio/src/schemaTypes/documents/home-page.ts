import { defineArrayMember, defineField, defineType } from "sanity"
import { HomeIcon } from "@sanity/icons"

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "featuredCareers",
      title: "Featured Careers",
      description: "Select careers to display in the homepage carousel.",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "career" }]
        })
      ]
    })
  ]
})

