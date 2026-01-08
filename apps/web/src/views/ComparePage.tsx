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
    : availableCareers.slice(0, 20) // Show first 20 if no search

  const getTitle = () => {
    const count = selectedCareers.length
    if (count === 0) {
      return t(language, "compare.title")
    } else if (count === 1) {
      return t(language, "compare.title.comparing").replace("{count}", "1")
    }
    return t(language, "compare.title.comparingPlural").replace("{count}", count.toString())
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

      {/* Career Selection Header - Tabular Layout */}
      {selectedCareers.length > 0 && (
        <div className="overflow-x-auto overflow-y-visible">
          <div className="min-w-full border-b-2 border-foreground">
            <div className="grid gap-0" style={{ gridTemplateColumns: `200px repeat(${selectedCareers.length}, 1fr) ${selectedCareers.length < 4 ? "200px" : ""}` }}>
              {/* Category Column Header */}
              <div className="border-r border-foreground bg-surface1 p-4 font-semibold">
                Category
              </div>
              
              {/* Career Column Headers */}
              {selectedCareers.map(career => {
                const title = getLocalizedString(language, career.title) || ""
                return (
                  <div
                    key={career._id}
                    className="flex items-center justify-between border-r border-foreground bg-surface1 p-4 last:border-r-0"
                  >
                    <span className="font-semibold">{title}</span>
                    <button
                      onClick={() => removeCareer(career._id)}
                      className="hover:bg-foreground/10 ml-2 rounded p-1"
                      aria-label={`Remove ${title}`}
                    >
                      <span className="text-lg leading-none" aria-hidden="true">×</span>
                    </button>
                  </div>
                )
              })}

              {/* Add Career Column */}
              {selectedCareers.length < 4 && (
                <div className="relative border-l border-foreground bg-surface1 p-4" style={{ minWidth: "200px" }}>
                  {!showSearch ? (
                    <button
                      onClick={() => setShowSearch(true)}
                      className="flex w-full items-center justify-center gap-1 rounded border border-foreground bg-primary px-3 py-2 text-sm font-medium text-onPrimary hover:bg-primary/90"
                    >
                      <span className="text-lg leading-none" aria-hidden="true">+</span>
                      {t(language, "compare.addCareer")}
                    </button>
                  ) : (
                    <div className="relative w-full">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={t(language, "compare.searchPlaceholder")}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") {
                              setShowSearch(false)
                              setSearchQuery("")
                            }
                          }}
                          className="flex-1 rounded border border-foreground bg-surface2 px-3 py-2 text-sm focus:border-foreground focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            setShowSearch(false)
                            setSearchQuery("")
                          }}
                          className="rounded p-1 hover:bg-foreground/10"
                          aria-label="Close search"
                        >
                          <span className="text-lg leading-none" aria-hidden="true">×</span>
                        </button>
                      </div>
                      {showSearch && (
                        <div className="absolute left-0 right-0 top-full z-[9999] mt-2 max-h-64 overflow-y-auto rounded-md border border-foreground bg-surface1 shadow-2xl">
                          {filteredCareers.length > 0 ? (
                            <>
                              {filteredCareers.map(career => {
                                const title = getLocalizedString(language, career.title) || ""
                                return (
                                  <button
                                    key={career._id}
                                    onClick={() => handleAddCareer(career._id)}
                                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-surface2 focus:bg-surface2 focus:outline-none"
                                    type="button"
                                  >
                                    <span className="text-sm font-medium">{title}</span>
                                    <span className="ml-2 text-lg leading-none text-primary" aria-hidden="true">+</span>
                                  </button>
                                )
                              })}
                            </>
                          ) : searchQuery ? (
                            <div className="px-4 py-3 text-sm text-foreground/60">
                              {t(language, "compare.noCareersFound")}
                            </div>
                          ) : (
                            <div className="px-4 py-3 text-sm text-foreground/60">
                              {t(language, "compare.startTyping")}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedCareers.length === 0 && !loadingSelected && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border-2 border-dashed border-foreground/30">
          <p className="mb-4 text-xl text-foreground/60">{t(language, "compare.addCareerToCompare")}</p>
          <div className="relative w-96">
            {!showSearch ? (
              <button
                onClick={() => setShowSearch(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-foreground bg-primary px-4 py-2 text-sm font-medium text-onPrimary hover:bg-primary/90"
              >
                <span className="text-lg leading-none" aria-hidden="true">+</span>
                {t(language, "compare.addCareer")}
              </button>
            ) : (
              <div className="relative w-full">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={t(language, "compare.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setShowSearch(false)
                        setSearchQuery("")
                      }
                    }}
                    className="flex-1 rounded border border-foreground bg-surface2 px-3 py-2 text-sm focus:border-foreground focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setShowSearch(false)
                      setSearchQuery("")
                    }}
                    className="rounded p-1 hover:bg-foreground/10"
                    aria-label="Close search"
                  >
                    <span className="text-lg leading-none" aria-hidden="true">×</span>
                  </button>
                </div>
                {showSearch && (
                  <div className="absolute left-0 right-0 top-full z-[9999] mt-2 max-h-64 overflow-y-auto rounded-md border border-foreground bg-surface1 shadow-2xl">
                    {filteredCareers.length > 0 ? (
                      filteredCareers.map(career => {
                        const title = getLocalizedString(language, career.title) || ""
                        return (
                          <button
                            key={career._id}
                            onClick={() => handleAddCareer(career._id)}
                            className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-surface2 focus:bg-surface2 focus:outline-none"
                            type="button"
                          >
                            <span className="text-sm font-medium">{title}</span>
                            <span className="ml-2 text-lg leading-none text-primary" aria-hidden="true">+</span>
                          </button>
                        )
                      })
                    ) : searchQuery ? (
                      <div className="px-4 py-3 text-sm text-foreground/60">
                        {t(language, "compare.noCareersFound")}
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-sm text-foreground/60">
                        {t(language, "compare.startTyping")}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comparison Content - Tabular Layout */}
      {loadingSelected ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-foreground/60">Loading careers...</p>
        </div>
      ) : selectedCareers.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-md border-2 border-dashed border-foreground/30">
          <p className="text-xl text-foreground/60">{t(language, "compare.addCareerToCompare")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto overflow-y-visible">
          <div className="min-w-full border border-foreground">
            {/* Day-to-Day Row */}
            <div className="grid border-b border-foreground" style={{ gridTemplateColumns: `200px repeat(${selectedCareers.length}, 1fr) ${selectedCareers.length < 4 ? "200px" : ""}` }}>
              <div className="border-r border-foreground bg-surface1 p-4 font-semibold">
                {t(language, "compare.sections.dayToDay")}
              </div>
              {selectedCareers.map(career => (
                <div key={career._id} className="border-r border-foreground p-4 last:border-r-0">
                  <div className="overflow-hidden rounded bg-surface1">
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
                </div>
              ))}
              {selectedCareers.length < 4 && (
                <div className="border-l border-foreground p-4">
                  <div className="text-foreground/40 text-xs">—</div>
                </div>
              )}
            </div>

            {/* Overview Row */}
            <div className="grid border-b border-foreground" style={{ gridTemplateColumns: `200px repeat(${selectedCareers.length}, 1fr) ${selectedCareers.length < 4 ? "200px" : ""}` }}>
              <div className="border-r border-foreground bg-surface1 p-4 font-semibold">
                {t(language, "compare.sections.overview")}
              </div>
              {selectedCareers.map(career => {
                const summary = getLocalizedText(language, career.summary)
                return (
                  <div key={career._id} className="border-r border-foreground p-4 last:border-r-0">
                    {summary ? (
                      <p className="text-foreground">{summary}</p>
                    ) : (
                      <p className="text-foreground/60">{t(language, "common.missing")}</p>
                    )}
                  </div>
                )
              })}
              {selectedCareers.length < 4 && <div className="border-l border-foreground" />}
            </div>

            {/* Salary Details Row */}
            <div className="grid border-b border-foreground" style={{ gridTemplateColumns: `200px repeat(${selectedCareers.length}, 1fr) ${selectedCareers.length < 4 ? "200px" : ""}` }}>
              <div className="border-r border-foreground bg-surface1 p-4 font-semibold">
                {t(language, "compare.sections.salaryDetails")}
              </div>
              {selectedCareers.map(career => {
                const rangeMin = career.salary?.rangeMin
                const rangeMax = career.salary?.rangeMax
                const salaryRange = rangeMin && rangeMax ? `${formatMoney(rangeMin)} - ${formatMoney(rangeMax)}` : undefined
                return (
                  <div key={career._id} className="border-r border-foreground p-4 last:border-r-0">
                    <div className="space-y-2">
                      {career.salary?.median !== undefined && (
                        <>
                          <div className="text-lg font-semibold">{formatMoney(career.salary.median)}</div>
                          <div className="text-sm text-foreground/60">{t(language, "compare.medianSalary")}</div>
                        </>
                      )}
                      {salaryRange && (
                        <>
                          <div className="text-lg font-semibold">{salaryRange}</div>
                          <div className="text-sm text-foreground/60">{t(language, "compare.salaryRange")}</div>
                        </>
                      )}
                      {!career.salary?.median && !salaryRange && (
                        <p className="text-foreground/60">{t(language, "common.missing")}</p>
                      )}
                    </div>
                  </div>
                )
              })}
              {selectedCareers.length < 4 && <div className="border-l border-foreground" />}
            </div>

            {/* Academic Requirements Row */}
            <div className="grid border-b border-foreground" style={{ gridTemplateColumns: `200px repeat(${selectedCareers.length}, 1fr) ${selectedCareers.length < 4 ? "200px" : ""}` }}>
              <div className="border-r border-foreground bg-surface1 p-4 font-semibold">
                {t(language, "compare.sections.academicRequirements")}
              </div>
              {selectedCareers.map(career => {
                const highlight = getLocalizedString(language, career.academicRequirementsHighlight)
                const programLength = getLocalizedString(language, career.programLengthHighlight)
                return (
                  <div key={career._id} className="border-r border-foreground p-4 last:border-r-0">
                    <div className="space-y-2">
                      {highlight && <div className="font-semibold">{highlight}</div>}
                      {programLength && <div>{programLength}</div>}
                      {!highlight && !programLength && (
                        <p className="text-foreground/60">{t(language, "common.missing")}</p>
                      )}
                    </div>
                  </div>
                )
              })}
              {selectedCareers.length < 4 && <div className="border-l border-foreground" />}
            </div>

            {/* Job Outlook Row */}
            <div className="grid border-b border-foreground" style={{ gridTemplateColumns: `200px repeat(${selectedCareers.length}, 1fr) ${selectedCareers.length < 4 ? "200px" : ""}` }}>
              <div className="border-r border-foreground bg-surface1 p-4 font-semibold">
                {t(language, "compare.sections.jobOutlook")}
              </div>
              {selectedCareers.map(career => {
                const outlookValue = career.outlook?.value
                const outlookText = outlookValue !== undefined 
                  ? `${outlookValue}%`
                  : null
                return (
                  <div key={career._id} className="border-r border-foreground p-4 last:border-r-0">
                    {outlookText ? (
                      <div className="space-y-1">
                        <div className="text-lg font-semibold">{outlookText}</div>
                        <div className="text-sm text-foreground/60">{t(language, "compare.projectedGrowth")}</div>
                      </div>
                    ) : (
                      <p className="text-foreground/60">{t(language, "common.missing")}</p>
                    )}
                  </div>
                )
              })}
              {selectedCareers.length < 4 && <div className="border-l border-foreground" />}
            </div>

            {/* Responsibilities Row */}
            <div className="grid border-b border-foreground" style={{ gridTemplateColumns: `200px repeat(${selectedCareers.length}, 1fr) ${selectedCareers.length < 4 ? "200px" : ""}` }}>
              <div className="border-r border-foreground bg-surface1 p-4 font-semibold">
                {t(language, "compare.sections.responsibilities")}
              </div>
              {selectedCareers.map(career => {
                const responsibilities = language === "es"
                  ? career.responsibilities?.es ?? career.responsibilities?.en
                  : career.responsibilities?.en
                return (
                  <div key={career._id} className="border-r border-foreground p-4 last:border-r-0">
                    {responsibilities?.length ? (
                      <BulletList items={responsibilities.slice(0, 4)} />
                    ) : (
                      <p className="text-foreground/60">{t(language, "common.missing")}</p>
                    )}
                  </div>
                )
              })}
              {selectedCareers.length < 4 && <div className="border-l border-foreground" />}
            </div>

            {/* Work Environments Row */}
            <div className="grid border-b border-foreground" style={{ gridTemplateColumns: `200px repeat(${selectedCareers.length}, 1fr) ${selectedCareers.length < 4 ? "200px" : ""}` }}>
              <div className="border-r border-foreground bg-surface1 p-4 font-semibold">
                {t(language, "compare.sections.workEnvironments")}
              </div>
              {selectedCareers.map(career => {
                const workEnvironments = language === "es"
                  ? career.workEnvironment?.es ?? career.workEnvironment?.en
                  : career.workEnvironment?.en
                return (
                  <div key={career._id} className="border-r border-foreground p-4 last:border-r-0">
                    {workEnvironments?.length ? (
                      <BulletList items={workEnvironments.slice(0, 4)} />
                    ) : (
                      <p className="text-foreground/60">{t(language, "common.missing")}</p>
                    )}
                  </div>
                )
              })}
              {selectedCareers.length < 4 && <div className="border-l border-foreground" />}
            </div>

            {/* Areas of Specialization Row */}
            <div className="grid" style={{ gridTemplateColumns: `200px repeat(${selectedCareers.length}, 1fr) ${selectedCareers.length < 4 ? "120px" : ""}` }}>
              <div className="border-r border-foreground bg-surface1 p-4 font-semibold">
                {t(language, "compare.sections.areasOfSpecialization")}
              </div>
              {selectedCareers.map(career => {
                const specializations = language === "es"
                  ? career.specializations?.es ?? career.specializations?.en
                  : career.specializations?.en
                return (
                  <div key={career._id} className="border-r border-foreground p-4 last:border-r-0">
                    {specializations?.length ? (
                      <BulletList items={specializations.slice(0, 4)} />
                    ) : (
                      <p className="text-foreground/60">{t(language, "common.missing")}</p>
                    )}
                  </div>
                )
              })}
              {selectedCareers.length < 4 && <div className="border-l border-foreground" />}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
