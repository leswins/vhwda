import { Helmet } from "react-helmet-async"

interface PageHeadProps {
  title: string
  description: string
  path?: string
  image?: string
  type?: "website" | "article"
}

const SITE_URL = "https://vahealthcareers.org"
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

export function PageHead({
  title,
  description,
  path = "",
  image = DEFAULT_IMAGE,
  type = "website"
}: PageHeadProps) {
  const fullTitle = title.includes("VHWDA")
    ? title
    : `${title} | VHWDA Health Careers Catalog`
  const url = `${SITE_URL}${path}`

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  )
}
