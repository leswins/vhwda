import React, { useState, useEffect } from "react"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { useCompareStore } from "../zustand/useCompareStore"
import { t } from "../utils/i18n"
import type { CareerForCompare } from "../sanity/queries/careers"
import { fetchCareersByIds, fetchCareersForCompare, getLocalizedString, getLocalizedText } from "../sanity/queries/careers"

function formatMoney(value?: number): string | undefined {
  if (value === undefined || value === null) return undefined
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
  } catch {
    return `$${value}`
  }
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
          style === "small" ? "text-sm text-foreground/70" : "text-lg text-foreground"
        return (
          <p key={b._key ?? text} className={className}>
            {text}
          </p>
        )
      })}
    </div>
  )
}

function BulletList({ items }: { items?: string[] }) {
  if (!items?.length) return null
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-start gap-3">
          <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accentOrange" aria-hidden="true" />
          <span className="text-lg">{item}</span>
        </div>
      ))}
    </div>
  )
}

export function ComparePage() {
  const { language } = useLanguageStore()
  const { careerIds, addCareer, removeCareer } = useCompareStore()
  const [selectedCareers, setSelectedCareers] = useState<CareerForCompare[]>([])
  const [allCareers, setAllCareers] = useState<CareerForCompare[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingSelected, setLoadingSelected] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Load all careers for search
  useEffect(() => {
    async function loadAllCareers() {
      try {
        const careers = await fetchCareersForCompare()
        setAllCareers(careers)
      } catch (error) {
        console.error("Error loading careers for compare:", error)
      } finally {
        setLoading(false)
      }
    }
    loadAllCareers()
  }, [])

  // Load selected careers when careerIds change
  useEffect(() => {
    async function loadSelectedCareers() {
      if (!careerIds.length) {
        setSelectedCareers([])
        return
      }
      setLoadingSelected(true)
      try {
        const careers = await fetchCareersByIds(careerIds)
        // Preserve order based on careerIds
        const ordered = careerIds
          .map(id => careers.find(c => c._id === id))
          .filter((c): c is CareerForCompare => c !== undefined)
        setSelectedCareers(ordered)
      } catch (error) {
        console.error("Error loading selected careers:", error)
      } finally {
        setLoadingSelected(false)
      }
    }
    loadSelectedCareers()
  }, [careerIds])

  const handleAddCareer = (id: string) => {
    addCareer(id)
    setShowSearch(false)
    setSearchQuery("")
  }

  const availableCareers = allCareers.filter(c => !careerIds.includes(c._id))
  const filteredCareers = searchQuery
    ? availableCareers.filter(c => {
        const title = getLocalizedString(language, c.title)?.toLowerCase() || ""
        return title.includes(searchQuery.toLowerCase())
      })
    : availableCareers.slice(0, 10) // Show first 10 if no search

  const getTitle = () => {
    const count = selectedCareers.length
    if (count === 0) {
      return t(language, "compare.title")
    } else if (count === 1) {
      return t(language, "compare.title.comparing").replace("{count}", "1")
    }
    return t(language, "compare.title.comparingPlural").replace("{count}", count.toString())
  }

  const getGridCols = () => {
    const count = selectedCareers.length
    if (count === 1) return "grid-cols-1"
    if (count === 2) return "grid-cols-1 md:grid-cols-2"
    if (count === 3) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">{t(language, "compare.title")}</h1>
        <p className="text-foreground/60">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">{getTitle()}</h1>
      </div>

      {/* Career Selection */}
      <div className="flex flex-wrap items-center gap-3">
        {selectedCareers.map(career => {
          const title = getLocalizedString(language, career.title) || ""
          return (
            <div
              key={career._id}
              className="inline-flex items-center gap-2 rounded-md border border-foreground bg-surface1 px-4 py-2"
            >
              <span className="text-sm font-medium">{title}</span>
              <button
                onClick={() => removeCareer(career._id)}
                className="hover:bg-foreground/10 rounded p-1"
                aria-label={`Remove ${title}`}
              >
                <span className="text-lg leading-none" aria-hidden="true">×</span>
              </button>
            </div>
          )
        })}

        {selectedCareers.length < 4 && (
          <div className="relative z-[10]">
            {!showSearch ? (
              <button
                onClick={() => setShowSearch(true)}
                className="inline-flex items-center gap-2 rounded-md border border-foreground bg-primary px-4 py-2 text-sm font-medium text-onPrimary hover:bg-primary/90"
              >
                <span className="text-lg leading-none" aria-hidden="true">+</span>
                {t(language, "compare.addCareer")}
              </button>
            ) : (
              <div className="absolute top-0 z-[10] w-80 rounded-md border border-foreground bg-surface1 shadow-lg">
                <div className="p-3">
                  <input
                    type="text"
                    placeholder={t(language, "compare.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded border border-foreground/20 bg-surface2 px-3 py-2 text-sm focus:border-foreground focus:outline-none"
                    autoFocus
                  />
                </div>
                {filteredCareers.length > 0 && (
                  <div className="max-h-64 overflow-y-auto border-t border-foreground/20">
                    {filteredCareers.map(career => {
                      const title = getLocalizedString(language, career.title) || ""
                      return (
                        <button
                          key={career._id}
                          onClick={() => handleAddCareer(career._id)}
                          className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-surface2"
                        >
                          <span className="text-sm font-medium">{title}</span>
                          <span className="text-lg leading-none text-primary" aria-hidden="true">+</span>
                        </button>
                      )
                    })}
                  </div>
                )}
                {searchQuery && filteredCareers.length === 0 && (
                  <div className="border-t border-foreground/20 px-4 py-3 text-sm text-foreground/60">
                    {t(language, "compare.noCareersFound")}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comparison Content */}
      {loadingSelected ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-foreground/60">Loading careers...</p>
        </div>
      ) : selectedCareers.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-md border-2 border-dashed border-foreground/30">
          <p className="text-xl text-foreground/60">{t(language, "compare.addCareerToCompare")}</p>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Day-to-Day Section */}
          <section className="border-b border-foreground pb-12">
            <h2 className="mb-8 text-4xl font-bold">{t(language, "compare.sections.dayToDay")}</h2>
            <div className={`grid gap-8 ${getGridCols()}`}>
              {selectedCareers.map(career => (
                <div key={career._id} className="overflow-hidden rounded border border-foreground bg-surface1">
                  {career.videoUrl ? (
                    <video className="aspect-video w-full object-cover" controls>
                      <source src={career.videoUrl} />
                    </video>
                  ) : career.images?.[0]?.asset?.url ? (
                    <img
                      src={career.images[0].asset.url}
                      alt={getLocalizedString(language, career.title) || ""}
                      className="aspect-video w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-video w-full bg-surface2" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Overview Section */}
          <section className="border-b border-foreground pb-12">
            <h2 className="mb-8 text-4xl font-bold">{t(language, "compare.sections.overview")}</h2>
            <div className={`grid gap-8 ${getGridCols()}`}>
              {selectedCareers.map(career => {
                const title = getLocalizedString(language, career.title) || ""
                const summary = getLocalizedText(language, career.summary)
                return (
                  <div key={career._id} className="space-y-4">
                    <h3 className="text-2xl font-semibold">{title}</h3>
                    {summary && <p className="text-lg text-foreground/80">{summary}</p>}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Salary Details Section */}
          <section className="border-b border-foreground pb-12">
            <h2 className="mb-8 text-4xl font-bold">{t(language, "compare.sections.salaryDetails")}</h2>
            <div className={`grid gap-8 ${getGridCols()}`}>
              {selectedCareers.map(career => {
                const rangeMin = career.salary?.rangeMin
                const rangeMax = career.salary?.rangeMax
                const salaryRange = rangeMin && rangeMax ? `${formatMoney(rangeMin)} - ${formatMoney(rangeMax)}` : undefined
                return (
                  <div key={career._id} className="space-y-4">
                    {career.salary?.median !== undefined && (
                      <div className="space-y-2">
                        <div className="text-lg text-foreground/70">{formatMoney(career.salary.median)}</div>
                        <div className="text-sm text-foreground/60">{t(language, "compare.medianSalary")}</div>
                      </div>
                    )}
                    {salaryRange && (
                      <div className="space-y-2">
                        <div className="text-lg font-semibold">{salaryRange}</div>
                        <div className="text-sm text-foreground/60">{t(language, "compare.salaryRange")}</div>
                      </div>
                    )}
                    {!career.salary?.median && !salaryRange && (
                      <p className="text-foreground/60">{t(language, "common.missing")}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Academic Requirements Section */}
          <section className="border-b border-foreground pb-12">
            <h2 className="mb-8 text-4xl font-bold">{t(language, "compare.sections.academicRequirements")}</h2>
            <div className={`grid gap-8 ${getGridCols()}`}>
              {selectedCareers.map(career => {
                const highlight = getLocalizedString(language, career.academicRequirementsHighlight)
                const requirements = language === "es" 
                  ? career.educationRequirements?.es ?? career.educationRequirements?.en 
                  : career.educationRequirements?.en
                return (
                  <div key={career._id} className="space-y-4">
                    {highlight && <div className="text-lg font-semibold">{highlight}</div>}
                    {requirements && (
                      <PortableTextPlain value={requirements} />
                    )}
                    {!highlight && !requirements && (
                      <p className="text-foreground/60">{t(language, "common.missing")}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Job Outlook Section */}
          <section className="border-b border-foreground pb-12">
            <h2 className="mb-8 text-4xl font-bold">{t(language, "compare.sections.jobOutlook")}</h2>
            <div className={`grid gap-8 ${getGridCols()}`}>
              {selectedCareers.map(career => {
                const outlookValue = career.outlook?.value
                const outlookLabel = career.outlook?.label
                const outlookText = outlookValue !== undefined 
                  ? `${outlookValue}% ${outlookLabel || t(language, "compare.projectedGrowth")}`
                  : outlookLabel
                return (
                  <div key={career._id}>
                    {outlookText ? (
                      <div className="text-lg font-semibold">{outlookText}</div>
                    ) : (
                      <p className="text-foreground/60">{t(language, "common.missing")}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Responsibilities Section */}
          <section className="border-b border-foreground pb-12">
            <h2 className="mb-8 text-4xl font-bold">{t(language, "compare.sections.responsibilities")}</h2>
            <div className={`grid gap-8 ${getGridCols()}`}>
              {selectedCareers.map(career => {
                const responsibilities = language === "es"
                  ? career.responsibilities?.es ?? career.responsibilities?.en
                  : career.responsibilities?.en
                return (
                  <div key={career._id}>
                    {responsibilities?.length ? (
                      <BulletList items={responsibilities} />
                    ) : (
                      <p className="text-foreground/60">{t(language, "common.missing")}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Work Environments Section */}
          <section className="border-b border-foreground pb-12">
            <h2 className="mb-8 text-4xl font-bold">{t(language, "compare.sections.workEnvironments")}</h2>
            <div className={`grid gap-8 ${getGridCols()}`}>
              {selectedCareers.map(career => {
                const workEnvironments = language === "es"
                  ? career.workEnvironment?.es ?? career.workEnvironment?.en
                  : career.workEnvironment?.en
                return (
                  <div key={career._id}>
                    {workEnvironments?.length ? (
                      <BulletList items={workEnvironments} />
                    ) : (
                      <p className="text-foreground/60">{t(language, "common.missing")}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Areas of Specialization Section */}
          <section className="pb-12">
            <h2 className="mb-8 text-4xl font-bold">{t(language, "compare.sections.areasOfSpecialization")}</h2>
            <div className={`grid gap-8 ${getGridCols()}`}>
              {selectedCareers.map(career => {
                const specializations = language === "es"
                  ? career.specializations?.es ?? career.specializations?.en
                  : career.specializations?.en
                return (
                  <div key={career._id}>
                    {specializations?.length ? (
                      <BulletList items={specializations} />
                    ) : (
                      <p className="text-foreground/60">{t(language, "common.missing")}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      )}

      {/* Click outside to close search */}
      {showSearch && (
        <div
          className="fixed inset-0 z-[5]"
          onClick={() => {
            setShowSearch(false)
            setSearchQuery("")
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
