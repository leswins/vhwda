import React, { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import type { CareerDetail } from "../sanity/queries/careers"
import { fetchCareerDetailBySlug, getLocalizedString, getLocalizedText } from "../sanity/queries/careers"
import { Button } from "../ui/components/Button"
import { Divider } from "../ui/components/Divider"
import { SectionNav } from "../ui/widgets/SectionNav"
import { EducationProgramsSection } from "../ui/widgets/EducationProgramsSection"
import { CareerCard } from "../ui/widgets/CareerCard"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"

function formatMoney(value?: number): string | undefined {
  if (value === undefined || value === null) return undefined
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
  } catch {
    return `$${value}`
  }
}

function pickTypicalSalary(salary?: { median?: number; rangeMin?: number; rangeMax?: number }): string | undefined {
  return formatMoney(salary?.median ?? salary?.rangeMin ?? salary?.rangeMax)
}

function PortableTextPlain({ value }: { value?: Array<Record<string, any>> }) {
  if (!value?.length) return null

  const blocks = value.filter((b) => b?._type === "block" && Array.isArray(b?.children))
  return (
    <div className="space-y-3">
      {blocks.map((b) => {
        const text = (b.children ?? []).map((c: any) => c?.text ?? "").join("")
        if (!text.trim()) return null
        const style = b?.style ?? "normal"
        const className =
          style === "small" ? "text-sm text-foreground/70" : "text-xl text-foreground"
        return (
          <p key={b._key ?? text} className={className}>
            {text}
          </p>
        )
      })}
    </div>
  )
}

function BulletGrid({ items }: { items?: string[] }) {
  if (!items?.length) return null
  return (
    <div className="grid gap-x-6 gap-y-6 md:grid-cols-2">
      {items.map((item, idx) => (
        <div key={`${idx}-${item}`} className="flex items-center gap-6">
          <div className="h-2.5 w-2.5 bg-accentOrange" aria-hidden="true" />
          <div className="text-xl text-foreground">{item}</div>
        </div>
      ))}
    </div>
  )
}

function InlineDividerList({ items }: { items?: string[] }) {
  if (!items?.length) return null
  return (
    <div className="flex flex-wrap items-center gap-y-3">
      {items.map((item, idx) => (
        <React.Fragment key={`${idx}-${item}`}>
          <span className="text-xl text-foreground">{item}</span>
          {idx !== items.length - 1 ? <span className="mx-4 h-7 w-px bg-foreground/20" aria-hidden="true" /> : null}
        </React.Fragment>
      ))}
    </div>
  )
}

export function CareerDetailPage() {
  const { slug } = useParams()
  const { language } = useLanguageStore()
  const [data, setData] = useState<CareerDetail | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "notFound" | "error">("idle")

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setStatus("loading")
    fetchCareerDetailBySlug(slug)
      .then((res) => {
        if (cancelled) return
        setData(res)
        setStatus(res ? "ready" : "notFound")
      })
      .catch((err) => {
        if (cancelled) return
        // Surface in console for debugging (CORS/auth/query errors, etc.)
        // eslint-disable-next-line no-console
        console.error("Failed to load career", { slug, err })
        setStatus("error")
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  const sections = useMemo(
    () => [
      { id: "overview", label: t(language, "career.sections.overview") },
      { id: "responsibilities", label: t(language, "career.sections.responsibilities") },
      { id: "academic", label: t(language, "career.sections.academicRequirements") },
      { id: "work", label: t(language, "career.sections.workEnvironments") },
      { id: "specializations", label: t(language, "career.sections.areasOfSpecialization") },
      { id: "salary", label: t(language, "career.sections.salaryRange") },
      { id: "education", label: t(language, "career.sections.educationalPrograms") },
      { id: "orgs", label: t(language, "career.sections.professionalAssociations") },
      { id: "similar", label: t(language, "career.sections.similarCareers") }
    ],
    [language]
  )

  const title = data ? getLocalizedString(language, data.title) : undefined
  const summary = data ? getLocalizedText(language, data.summary) : undefined

  return (
    <div className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="overflow-hidden border border-foreground bg-surface1">
          {data?.videoUrl ? (
            <video className="aspect-video w-full object-cover" controls>
              <source src={data.videoUrl} />
            </video>
          ) : data?.images?.[0]?.asset?.url ? (
            <img src={data.images[0].asset.url} alt="" className="aspect-video w-full object-cover" />
          ) : (
            <div className="aspect-video w-full bg-surface2" />
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold leading-tight tracking-tight">{title ?? t(language, "career.title")}</h1>

          <div className="flex items-center justify-between text-sm">
            <Link to="/careers" className="inline-flex items-center gap-2 underline">
              <span aria-hidden="true">←</span>
              {t(language, "career.back")}
            </Link>
            <Link to="/compare" className="underline">
              {t(language, "career.compare")}
            </Link>
          </div>

          <Divider className="bg-foreground/20" />

          <div className="space-y-3">
            {data?.academicRequirementsHighlight ? (
              <div className="flex items-center justify-between border border-foreground bg-surface1">
                <div className="w-16 self-stretch bg-accentBlue" aria-hidden="true" />
                <div className="flex-1 px-5 py-4">
                  <div className="text-xl font-bold">{getLocalizedString(language, data.academicRequirementsHighlight)}</div>
                  <div className="text-sm text-foreground/70">{t(language, "career.sections.academicRequirements")}</div>
                </div>
                <div className="px-5" aria-hidden="true">
                  →
                </div>
              </div>
            ) : null}

            {data?.programLengthHighlight ? (
              <div className="flex items-center justify-between border border-foreground bg-surface1">
                <div className="w-16 self-stretch bg-accentYellow" aria-hidden="true" />
                <div className="flex-1 px-5 py-4">
                  <div className="text-xl font-bold">{getLocalizedString(language, data.programLengthHighlight)}</div>
                  <div className="text-sm text-foreground/70">{t(language, "careerHighlight.programLength")}</div>
                </div>
                <div className="px-5" aria-hidden="true">
                  →
                </div>
              </div>
            ) : null}

            {data?.salary?.median !== undefined ? (
              <div className="flex items-center justify-between border border-foreground bg-surface1">
                <div className="w-16 self-stretch bg-accentGreen" aria-hidden="true" />
                <div className="flex-1 px-5 py-4">
                  <div className="text-xl font-bold">{formatMoney(data.salary.median)}</div>
                  <div className="text-sm text-foreground/70">{t(language, "careerHighlight.typicalSalary")}</div>
                </div>
                <div className="px-5" aria-hidden="true">
                  →
                </div>
              </div>
            ) : null}

            {data?.outlook?.value !== undefined ? (
              <div className="flex items-center justify-between border border-foreground bg-surface1">
                <div className="w-16 self-stretch bg-accentPink" aria-hidden="true" />
                <div className="flex-1 px-5 py-4">
                  <div className="text-xl font-bold">{`${data.outlook.value}%`}</div>
                  <div className="text-sm text-foreground/70">
                    {data.outlook.label || t(language, "careerHighlight.projectedGrowth")}
                  </div>
                </div>
                <div className="px-5" aria-hidden="true">
                  →
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <SectionNav items={sections} offsetTopPx={0} ariaLabel={t(language, "career.sectionNavA11y")} />

      {status === "loading" ? <p className="text-muted">{t(language, "career.loading")}</p> : null}
      {status === "notFound" ? <p className="text-muted">{t(language, "career.notFound")}</p> : null}
      {status === "error" ? <p className="text-muted">{t(language, "career.error")}</p> : null}

      {status === "ready" && data ? (
        <div className="space-y-16">
          <section id="overview" className="border-b border-foreground pb-12 pt-10">
            <h2 className="sr-only">{t(language, "career.sections.overview")}</h2>
            <p className="text-balance text-5xl font-bold leading-tight">{summary}</p>
          </section>

          <section id="responsibilities" className="border-b border-foreground pb-12 pt-10">
            <h2 className="mb-8 text-4xl font-bold">{t(language, "career.sections.responsibilities")}</h2>
            <BulletGrid items={language === "es" ? data.responsibilities?.es ?? data.responsibilities?.en : data.responsibilities?.en} />
          </section>

          <section id="academic" className="border-b border-foreground pb-12 pt-10">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="text-4xl font-bold">{t(language, "career.sections.academicRequirements")}</h2>
              <Button variant="dark">{t(language, "career.cta.exploreEducationalPrograms")}</Button>
            </div>
            <PortableTextPlain value={language === "es" ? data.educationRequirements?.es ?? data.educationRequirements?.en : data.educationRequirements?.en} />
          </section>

          <section id="work" className="border-b border-foreground pb-12 pt-10">
            <h2 className="mb-8 text-4xl font-bold">{t(language, "career.sections.workEnvironments")}</h2>
            <InlineDividerList items={language === "es" ? data.workEnvironment?.es ?? data.workEnvironment?.en : data.workEnvironment?.en} />
          </section>

          <section id="specializations" className="border-b border-foreground pb-12 pt-10">
            <h2 className="mb-8 text-4xl font-bold">{t(language, "career.sections.areasOfSpecialization")}</h2>
            <InlineDividerList items={language === "es" ? data.specializations?.es ?? data.specializations?.en : data.specializations?.en} />
            <div className="mt-8">
              <PortableTextPlain
                value={
                  language === "es" ? data.specializationsNote?.es ?? data.specializationsNote?.en : data.specializationsNote?.en
                }
              />
            </div>
          </section>

          <section id="salary" className="border-b border-foreground pb-12 pt-10">
            <h2 className="mb-8 text-4xl font-bold">{t(language, "career.sections.salaryRange")}</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-3">
                <div className="text-xl">{t(language, "career.salary.entryLevel")}</div>
                <div className="text-5xl font-bold">{formatMoney(data.salary?.rangeMin)}</div>
              </div>
              <div className="space-y-3 border-l border-r border-foreground px-8">
                <div className="text-xl">{t(language, "career.salary.median")}</div>
                <div className="text-5xl font-bold">{formatMoney(data.salary?.median)}</div>
              </div>
              <div className="space-y-3">
                <div className="text-xl">{t(language, "career.salary.experienced")}</div>
                <div className="text-5xl font-bold">{formatMoney(data.salary?.rangeMax)}</div>
              </div>
            </div>
          </section>

          <section id="education" className="border-b border-foreground pb-12 pt-10">
            <h2 className="mb-8 text-4xl font-bold">{t(language, "career.sections.educationalPrograms")}</h2>
            <EducationProgramsSection language={language} items={data.educationInstitutions ?? []} />
          </section>

          <section id="orgs" className="border-b border-foreground pb-12 pt-10">
            <h2 className="mb-8 text-4xl font-bold">{t(language, "career.sections.professionalAssociations")}</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {(data.professionalOrgs ?? []).map((org) => (
                <a key={org._id} href={org.link} className="flex items-center justify-between border border-foreground p-5 hover:bg-surface1">
                  <span className="text-xl">{org.name}</span>
                  <span aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          </section>

          <section id="similar" className="pt-10">
            <h2 className="mb-8 text-4xl font-bold">{t(language, "career.sections.similarCareers")}</h2>
            <div className="flex overflow-x-auto border-t border-foreground bg-surface1">
              {(data.similarCareers ?? []).map((c, idx) => {
                const card = (
                  <CareerCard
                    key={c._id}
                    language={language}
                    title={getLocalizedString(language, c.title) ?? t(language, "common.missing")}
                    salary={pickTypicalSalary(c.salary)}
                    to={c.slug ? `/careers/${c.slug}` : "/careers"}
                    imageUrl={c.imageUrl}
                    showMatch={false}
                  />
                )

                return (
                  <React.Fragment key={c._id}>
                    {card}
                    {idx !== (data.similarCareers?.length ?? 0) - 1 ? (
                      <div className="w-px shrink-0 bg-foreground" aria-hidden="true" />
                    ) : null}
                  </React.Fragment>
                )
              })}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}


