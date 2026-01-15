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
    <div className="space-y-[25px]">
      {blocks.map((b) => {
        const text = (b.children ?? []).map((c: any) => c?.text ?? "").join("")
        if (!text.trim()) return null
        const style = b?.style ?? "normal"
        const className =
          style === "small" ? "text-body-lg text-muted" : "text-sub1 text-foreground"
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
    <div className="grid gap-x-[50px] gap-y-[50px] md:grid-cols-2">
      {items.map((item, idx) => (
        <div key={`${idx}-${item}`} className="flex items-start gap-6">
          <div className="mt-2 h-[10px] w-[10px] shrink-0 bg-accentOrange" aria-hidden="true" />
          <div className="text-sub1 text-foreground">{item}</div>
        </div>
      ))}
    </div>
  )
}

function InlineDividerList({ items }: { items?: string[] }) {
  if (!items?.length) return null
  return (
    <div className="flex flex-wrap items-center gap-y-[50px]">
      {items.map((item, idx) => (
        <React.Fragment key={`${idx}-${item}`}>
          <span className="text-sub1 text-foreground">{item}</span>
          {idx !== items.length - 1 ? <span className="mx-[25px] h-7 w-[0.5px] bg-foreground" aria-hidden="true" /> : null}
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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-x-0 gap-y-0 lg:grid-cols-[1fr_1fr]">
        <div className="overflow-hidden bg-surface1 flex items-center justify-center">
          {data?.videoUrl ? (
            <video className="aspect-square w-full object-cover" autoPlay muted loop playsInline>
              <source src={data.videoUrl} />
            </video>
          ) : data?.images?.[0]?.asset?.url ? (
            <img src={data.images[0].asset.url} alt="" className="aspect-square w-full object-cover" />
          ) : (
            <div className="aspect-square w-full bg-surface2" />
          )}
        </div>

        <div className="flex flex-col h-full p-5 border-l border-foreground">
          <div className="flex-1">
            <h1 className="text-h2">{title ?? t(language, "career.title")}</h1>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between text-body-base">
              <Link to="/careers" className="inline-flex items-center gap-2 group">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M15 8.44697L15 6.55303L3.63636 6.55303L8.8447 1.3447L7.5 -3.27835e-07L3.27835e-07 7.5L7.5 15L8.8447 13.6553L3.63636 8.44697L15 8.44697Z" fill="currentColor" />
                </svg>
                <span className="underline group-hover:no-underline">{t(language, "career.back")}</span>
              </Link>
              <Link to="/compare" className="underline hover:no-underline">
                {t(language, "career.compare")}
              </Link>
            </div>

            <Divider className="mt-4 mb-5" />

            <div className="flex flex-col">
              <div className="group flex cursor-pointer items-center justify-between" onClick={() => scrollToSection("academic")}>
                <div className="flex aspect-square h-[70px] items-center justify-center bg-accentBlue" aria-hidden="true">
                  <svg width="35" height="29" viewBox="0 0 35 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.36364 16.1955V22.5591L17.5 28.6364L28.6364 22.5591V16.1955L17.5 22.2727L6.36364 16.1955ZM17.5 0L0 9.54545L17.5 19.0909L31.8182 11.2795V22.2727H35V9.54545L17.5 0Z" fill="#0F0F0F" />
                  </svg>
                </div>
                <div className="mx-5 w-[0.5px] self-stretch bg-foreground" />
                <div className="flex-1 px-5 flex flex-col gap-[10px]">
                  <div className="text-h5">{data?.academicRequirementsHighlight ? getLocalizedString(language, data.academicRequirementsHighlight) : "—"}</div>
                  <div className="text-body-base text-foreground/70">{t(language, "career.sections.academicRequirements")}</div>
                </div>
                <div className="relative flex aspect-square h-[70px] items-center justify-center overflow-hidden" aria-hidden="true">
                  <div className="absolute top-0 bottom-0 right-0 left-[-5px] translate-x-[-100%] bg-foreground transition-transform duration-300 ease-out group-hover:translate-x-0" />
                  <svg className="relative z-10 text-foreground transition-colors duration-300 group-hover:text-surface" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-4.92305e-07 11.2626L-3.81923e-07 8.73737L15.1515 8.73737L8.20707 1.79293L10 -4.37114e-07L20 10L10 20L8.20707 18.2071L15.1515 11.2626L-4.92305e-07 11.2626Z" fill="currentColor" />
                  </svg>
                </div>
              </div>

              <Divider className="my-5" />

              <div className="group flex cursor-pointer items-center justify-between" onClick={() => scrollToSection("education")}>
                <div className="flex aspect-square h-[70px] items-center justify-center bg-accentYellow" aria-hidden="true">
                  <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5 35C12.8587 35 8.40752 33.1563 5.12563 29.8744C1.84374 26.5925 0 22.1413 0 17.5C0 12.8587 1.84374 8.40752 5.12563 5.12563C8.40752 1.84374 12.8587 0 17.5 0C22.1413 0 26.5925 1.84374 29.8744 5.12563C33.1563 8.40752 35 12.8587 35 17.5C35 22.1413 33.1563 26.5925 29.8744 29.8744C26.5925 33.1563 22.1413 35 17.5 35ZM17.5 31.5C21.213 31.5 24.774 30.025 27.3995 27.3995C30.025 24.774 31.5 21.213 31.5 17.5C31.5 13.787 30.025 10.226 27.3995 7.60051C24.774 4.975 21.213 3.5 17.5 3.5C13.787 3.5 10.226 4.975 7.60051 7.60051C4.975 10.226 3.5 13.787 3.5 17.5C3.5 21.213 4.975 24.774 7.60051 27.3995C10.226 30.025 13.787 31.5 17.5 31.5ZM15.75 18.2175V7H19.25V16.7825L26.1625 23.695L23.695 26.1625L15.75 18.2175Z" fill="#09090B" />
                  </svg>
                </div>
                <div className="mx-5 w-[0.5px] self-stretch bg-foreground" />
                <div className="flex-1 px-5 flex flex-col gap-[10px]">
                  <div className="text-h5">{data?.programLengthHighlight ? getLocalizedString(language, data.programLengthHighlight) : "—"}</div>
                  <div className="text-body-base text-foreground/70">{t(language, "careerHighlight.programLength")}</div>
                </div>
                <div className="relative flex aspect-square h-[70px] items-center justify-center overflow-hidden" aria-hidden="true">
                  <div className="absolute top-0 bottom-0 right-0 left-[-5px] translate-x-[-100%] bg-foreground transition-transform duration-300 ease-out group-hover:translate-x-0" />
                  <svg className="relative z-10 text-foreground transition-colors duration-300 group-hover:text-surface" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-4.92305e-07 11.2626L-3.81923e-07 8.73737L15.1515 8.73737L8.20707 1.79293L10 -4.37114e-07L20 10L10 20L8.20707 18.2071L15.1515 11.2626L-4.92305e-07 11.2626Z" fill="currentColor" />
                  </svg>
                </div>
              </div>

              <Divider className="my-5" />

              <div className="group flex cursor-pointer items-center justify-between" onClick={() => scrollToSection("salary")}>
                <div className="flex aspect-square h-[70px] items-center justify-center bg-accentGreen" aria-hidden="true">
                  <svg width="35" height="24" viewBox="0 0 35 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0H35V23.3333H0V0ZM17.5 5.83333C19.0471 5.83333 20.5308 6.44791 21.6248 7.54188C22.7188 8.63584 23.3333 10.1196 23.3333 11.6667C23.3333 13.2138 22.7188 14.6975 21.6248 15.7915C20.5308 16.8854 19.0471 17.5 17.5 17.5C15.9529 17.5 14.4692 16.8854 13.3752 15.7915C12.2812 14.6975 11.6667 13.2138 11.6667 11.6667C11.6667 10.1196 12.2812 8.63584 13.3752 7.54188C14.4692 6.44791 15.9529 5.83333 17.5 5.83333ZM7.77778 3.88889C7.77778 4.92029 7.36806 5.90944 6.63875 6.63875C5.90944 7.36806 4.92029 7.77778 3.88889 7.77778V15.5556C4.92029 15.5556 5.90944 15.9653 6.63875 16.6946C7.36806 17.4239 7.77778 18.413 7.77778 19.4444H27.2222C27.2222 18.413 27.6319 17.4239 28.3613 16.6946C29.0906 15.9653 30.0797 15.5556 31.1111 15.5556V7.77778C30.0797 7.77778 29.0906 7.36806 28.3613 6.63875C27.6319 5.90944 27.2222 4.92029 27.2222 3.88889H7.77778Z" fill="#09090B" />
                  </svg>
                </div>
                <div className="mx-5 w-[0.5px] self-stretch bg-foreground" />
                <div className="flex-1 px-5 flex flex-col gap-[10px]">
                  <div className="text-h5">{data?.salary?.median !== undefined ? formatMoney(data.salary.median) : "—"}</div>
                  <div className="text-body-base text-foreground/70">{t(language, "careerHighlight.typicalSalary")}</div>
                </div>
                <div className="relative flex aspect-square h-[70px] items-center justify-center overflow-hidden" aria-hidden="true">
                  <div className="absolute top-0 bottom-0 right-0 left-[-5px] translate-x-[-100%] bg-foreground transition-transform duration-300 ease-out group-hover:translate-x-0" />
                  <svg className="relative z-10 text-foreground transition-colors duration-300 group-hover:text-surface" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-4.92305e-07 11.2626L-3.81923e-07 8.73737L15.1515 8.73737L8.20707 1.79293L10 -4.37114e-07L20 10L10 20L8.20707 18.2071L15.1515 11.2626L-4.92305e-07 11.2626Z" fill="currentColor" />
                  </svg>
                </div>
              </div>

              <Divider className="my-5" />

              <div className="group flex cursor-pointer items-center justify-between" onClick={() => scrollToSection("salary")}>
                <div className="flex aspect-square h-[70px] items-center justify-center bg-accentPink" aria-hidden="true">
                  <svg width="35" height="21" viewBox="0 0 35 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M26.25 0V3.5H29.05L19.25 13.3L12.25 6.3L0 18.55L2.45 21L12.25 11.2L19.25 18.2L31.5 5.95V8.75H35V0H26.25Z" fill="#09090B" />
                  </svg>
                </div>
                <div className="mx-5 w-[0.5px] self-stretch bg-foreground" />
                <div className="flex-1 px-5 flex flex-col gap-[10px]">
                  <div className="text-h5">{data?.outlook?.value !== undefined ? `${data.outlook.value}%` : "—"}</div>
                  <div className="text-body-base text-foreground/70">
                    {data?.outlook?.label || t(language, "careerHighlight.projectedGrowth")}
                  </div>
                </div>
                <div className="relative flex aspect-square h-[70px] items-center justify-center overflow-hidden" aria-hidden="true">
                  <div className="absolute top-0 bottom-0 right-0 left-[-5px] translate-x-[-100%] bg-foreground transition-transform duration-300 ease-out group-hover:translate-x-0" />
                  <svg className="relative z-10 text-foreground transition-colors duration-300 group-hover:text-surface" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-4.92305e-07 11.2626L-3.81923e-07 8.73737L15.1515 8.73737L8.20707 1.79293L10 -4.37114e-07L20 10L10 20L8.20707 18.2071L15.1515 11.2626L-4.92305e-07 11.2626Z" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectionNav items={sections} offsetTopPx={0} ariaLabel={t(language, "career.sectionNavA11y")} />

      {status === "loading" ? <p className="p-[50px] text-muted">{t(language, "career.loading")}</p> : null}
      {status === "notFound" ? <p className="p-[50px] text-muted">{t(language, "career.notFound")}</p> : null}
      {status === "error" ? <p className="p-[50px] text-muted">{t(language, "career.error")}</p> : null}

      {status === "ready" && data ? (
        <>
          <section id="overview" className="border-b border-foreground p-[50px]">
            <h2 className="sr-only">{t(language, "career.sections.overview")}</h2>
            <p className="text-balance text-h2">{summary}</p>
          </section>

          <section id="responsibilities" className="border-b border-foreground p-[50px]">
            <h2 className="mb-[50px] text-h3">{t(language, "career.sections.responsibilities")}</h2>
            <BulletGrid items={language === "es" ? data.responsibilities?.es ?? data.responsibilities?.en : data.responsibilities?.en} />
          </section>

          <section id="academic" className="border-b border-foreground p-[50px]">
            <div className="mb-[50px] flex items-center justify-between gap-4">
              <h2 className="text-h3">{t(language, "career.sections.academicRequirements")}</h2>
              <Button variant="dark">{t(language, "career.cta.exploreEducationalPrograms")}</Button>
            </div>
            <PortableTextPlain value={language === "es" ? data.educationRequirements?.es ?? data.educationRequirements?.en : data.educationRequirements?.en} />
          </section>

          <section id="work" className="border-b border-foreground p-[50px]">
            <h2 className="mb-[50px] text-h3">{t(language, "career.sections.workEnvironments")}</h2>
            <InlineDividerList items={language === "es" ? data.workEnvironment?.es ?? data.workEnvironment?.en : data.workEnvironment?.en} />
          </section>

          <section id="specializations" className="border-b border-foreground p-[50px]">
            <h2 className="mb-[50px] text-h3">{t(language, "career.sections.areasOfSpecialization")}</h2>
            <InlineDividerList items={language === "es" ? data.specializations?.es ?? data.specializations?.en : data.specializations?.en} />
            <div className="mt-[50px]">
              <PortableTextPlain
                value={
                  language === "es" ? data.specializationsNote?.es ?? data.specializationsNote?.en : data.specializationsNote?.en
                }
              />
            </div>
          </section>

          <section id="salary" className="border-b border-foreground p-[50px]">
            <h2 className="mb-[50px] text-h3">{t(language, "career.sections.salaryRange")}</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-3">
                <div className="text-sub1">{t(language, "career.salary.entryLevel")}</div>
                <div className="text-h2">{formatMoney(data.salary?.rangeMin)}</div>
              </div>
              <div className="space-y-3 border-l border-r border-foreground px-8">
                <div className="text-sub1">{t(language, "career.salary.median")}</div>
                <div className="text-h2">{formatMoney(data.salary?.median)}</div>
              </div>
              <div className="space-y-3">
                <div className="text-sub1">{t(language, "career.salary.experienced")}</div>
                <div className="text-h2">{formatMoney(data.salary?.rangeMax)}</div>
              </div>
            </div>
          </section>

          <section id="education" className="border-b border-foreground">
            <EducationProgramsSection
              language={language}
              items={data.educationInstitutions ?? []}
              title={t(language, "career.sections.educationalPrograms")}
            />
          </section>

          <section id="orgs" className="border-b border-foreground p-[50px]">
            <h2 className="mb-[50px] text-h3">{t(language, "career.sections.professionalAssociations")}</h2>
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-x-[50px] gap-y-8">
              <div className="space-y-8">
                {(data.professionalOrgs ?? []).filter((_, i) => i % 2 === 0).map((org) => (
                  <a key={org._id} href={org.link} className="flex items-center justify-between py-2 hover:opacity-70">
                    <span className="text-sub1">{org.name}</span>
                    <span aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M-4.92305e-07 11.2626L-3.81923e-07 8.73737L15.1515 8.73737L8.20707 1.79293L10 -4.37114e-07L20 10L10 20L8.20707 18.2071L15.1515 11.2626L-4.92305e-07 11.2626Z" fill="currentColor" />
                      </svg>
                    </span>
                  </a>
                ))}
              </div>
              <div className="hidden md:block w-[0.5px] bg-foreground" />
              <div className="space-y-8">
                {(data.professionalOrgs ?? []).filter((_, i) => i % 2 === 1).map((org) => (
                  <a key={org._id} href={org.link} className="flex items-center justify-between py-2 hover:opacity-70">
                    <span className="text-sub1">{org.name}</span>
                    <span aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M-4.92305e-07 11.2626L-3.81923e-07 8.73737L15.1515 8.73737L8.20707 1.79293L10 -4.37114e-07L20 10L10 20L8.20707 18.2071L15.1515 11.2626L-4.92305e-07 11.2626Z" fill="currentColor" />
                      </svg>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {(data.similarCareers ?? []).length > 0 ? (
            <section id="similar" className="p-[50px] pb-0">
              <div className="mb-[50px] flex items-center justify-between">
                <h2 className="text-h3">{t(language, "career.sections.similarCareers")}</h2>
                <Button variant="dark">{t(language, "career.cta.searchForCareer")}</Button>
              </div>
              <div className="-mx-[50px] flex overflow-x-auto scrollbar-hide border-t border-foreground bg-surface1">
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
                        <div className="shrink-0 border-l-[0.5px] border-foreground" aria-hidden="true" />
                      ) : null}
                    </React.Fragment>
                  )
                })}
              </div>
            </section>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
