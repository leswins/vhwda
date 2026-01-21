import { defineArrayMember, defineField, defineType } from "sanity"
import { HomeIcon } from "@sanity/icons"

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "heroVideoUrl",
      title: "Hero Video URL",
      description: "Optional video URL for the home page hero.",
      type: "url"
    }),
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

