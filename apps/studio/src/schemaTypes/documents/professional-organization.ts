import { defineArrayMember, defineField, defineType } from "sanity"
import { UsersIcon } from "@sanity/icons"

export const professionalOrganization = defineType({
    name: "professionalOrganization",
    title: "Professional Organization",
    type: "document",
    icon: UsersIcon,
    fields: [
        defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
        defineField({ 
            name: "institution", 
            title: "Institution/Organization Name", 
            type: "string",
            description: "Full name of the organization (e.g., 'VETERANS HEALTH ADMINISTRATION')"
        }),
        defineField({ name: "link", title: "Link", type: "url" }),
        defineField({ 
            name: "description", 
            title: "Description", 
            type: "localizedText",
            description: "Detailed description shown in the listing"
        }),
        
        // Filter fields
        defineField({
            name: "membershipType",
            title: "Membership Type",
            type: "array",
            description: "Types of memberships available",
            of: [
                defineArrayMember({
                    type: "string",
                    options: {
                        list: [
                            { title: "Student", value: "student" },
                            { title: "Professional", value: "professional" },
                            { title: "Employer", value: "employer" }
                        ]
                    }
                })
            ]
        }),
        defineField({
            name: "geographicFocus",
            title: "Geographic Focus",
            type: "string",
            description: "Geographic scope of the organization",
            options: {
                list: [
                    { title: "Virginia Statewide", value: "virginia_statewide" },
                    { title: "Regional", value: "regional" },
                    { title: "National", value: "national" },
                    { title: "International", value: "international" },
                    { title: "Local", value: "local" }
                ]
            }
        }),
        defineField({
            name: "careerAreas",
            title: "Career Areas",
            type: "array",
            description: "Career areas this organization supports",
            of: [
                defineArrayMember({
                    type: "reference",
                    to: [{ type: "careerCategory" }]
                })
            ]
        })
    ],
    preview: {
        select: { 
            title: "name",
            institution: "institution",
            geographicFocus: "geographicFocus"
        },
        prepare({ title, institution, geographicFocus }) {
            // Show institution if available, otherwise show geographic focus, otherwise nothing
            const subtitle = institution || (geographicFocus ? `Geographic: ${geographicFocus}` : undefined)
            return {
                title: title || "Untitled Organization",
                subtitle: subtitle
            }
        }
    }
})


