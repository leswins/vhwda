import { sanityClient } from "../client"
import type { LocalizedString, LocalizedText } from "./careers"

export type HubResource = {
  _id: string
  title: LocalizedString
  summary?: LocalizedString
  description?: LocalizedText
  institution?: string
  eligibility?: LocalizedText
  region?: string
  deadline?: string
  link?: string
  tags?: string[]
  hasFile?: boolean
  fileLabel?: string
  fileUrl?: string
  resourceType?: {
    _id: string
    slug?: string
    title?: LocalizedString
  }
}

export const HUB_RESOURCES_QUERY = /* groq */ `
*[_type == "resource" && published != false && resourceType->slug == $slug] | order(title.en asc) {
  _id,
  title,
  summary,
  description,
  institution,
  eligibility,
  region,
  deadline,
  link,
  tags,
  fileLabel,
  "hasFile": defined(file.asset) || defined(fileUrl),
  resourceType->{
    _id,
    slug,
    title
  }
}
`

export const TEACHER_RESOURCES_QUERY = /* groq */ `
*[_type == "resource" && published != false && resourceType->audience in ["teacherPortal", "both"]] | order(title.en asc) {
  _id,
  title,
  summary,
  description,
  institution,
  eligibility,
  region,
  deadline,
  link,
  tags,
  fileLabel,
  "hasFile": defined(file.asset) || defined(fileUrl),
  resourceType->{
    _id,
    slug,
    title
  }
}
`

export const TEACHER_RESOURCE_FILE_QUERY = /* groq */ `
*[_type == "resource" && _id == $id && published != false][0]{
  _id,
  title,
  fileLabel,
  fileUrl,
  "file": file.asset->{
    url,
    originalFilename,
    mimeType,
    size
  },
  resourceType->{
    _id,
    slug,
    title,
    audience
  }
}
`

export async function fetchHubResources(slug: string): Promise<HubResource[]> {
  if (!slug) return []
  return await sanityClient.fetch<HubResource[]>(HUB_RESOURCES_QUERY, { slug })
}

export async function fetchTeacherResources(): Promise<HubResource[]> {
  return await sanityClient.fetch<HubResource[]>(TEACHER_RESOURCES_QUERY)
}

export type TeacherResourceFile = {
  _id: string
  title?: LocalizedString
  fileLabel?: string
  fileUrl?: string
  file?: {
    url?: string
    originalFilename?: string
    mimeType?: string
    size?: number
  }
  resourceType?: {
    _id: string
    slug?: string
    title?: LocalizedString
    audience?: string
  }
}

export async function fetchTeacherResourceFile(id: string): Promise<TeacherResourceFile | null> {
  return await sanityClient.fetch<TeacherResourceFile | null>(TEACHER_RESOURCE_FILE_QUERY, { id })
}
