import React, { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import { PageHead } from "../ui/PageHead"
import { PlanYourNextStepsSection } from "../ui/widgets/PlanYourNextStepsSection"
import { ResourceTypeIcon } from "../ui/widgets/ResourceTypeIcon"
import { trackEvent } from "../utils/analytics"
import arrowIcon from "../assets/icons/arrow.svg"
import {
  fetchResourceTypes,
  getResourceTypeDescription,
  getResourceTypeLabel,
  isPublicHubType,
  type ResourceType
} from "../sanity/queries/resourceTypes"
import { accentBg } from "../lib/resourceTypePresentation"

const ArrowIndicator = () => (
  <div
    className="relative flex h-full aspect-square items-center justify-center overflow-hidden self-stretch"
    aria-hidden="true"
  >
    <div className="absolute inset-0 left-[-5px] -translate-x-full bg-foreground transition-transform duration-300 ease-out group-hover:translate-x-0" />
    <img
      src={arrowIcon}
      alt=""
      className="relative z-10 h-[20px] w-[20px] transition-all duration-300 group-hover:invert"
    />
  </div>
)

const PlusIcon = () => (
  <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
    <path d="M7.5 0V7.5M7.5 7.5V15M7.5 7.5H0M7.5 7.5H15" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const MinusIcon = () => (
  <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
    <path d="M0 7.5H15" stroke="currentColor" strokeWidth="2" />
  </svg>
)

function TypeGlyph({ type }: { type: ResourceType }) {
  if (type.iconUrl) {
    return <img src={type.iconUrl} alt="" className="h-full w-full object-contain" />
  }
  return <ResourceTypeIcon icon={type.icon} />
}

export function ResourcesPage() {
  const { language } = useLanguageStore()
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([])
  const [openSections, setOpenSections] = useState<string[]>([])

  const publicTypes = useMemo(() => resourceTypes.filter(isPublicHubType), [resourceTypes])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      const types = await fetchResourceTypes()
      if (cancelled) return
      const visible = types.filter(isPublicHubType)
      setResourceTypes(types)
      setOpenSections((prev) => {
        if (prev.length > 0) return prev
        const schools = visible.find((type) => type.sourceKind === "educationalInstitution")
        return [schools?.slug ?? visible[0]?.slug].filter(Boolean) as string[]
      })
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const stickySlug =
    publicTypes.find((type) => type.sourceKind === "educationalInstitution")?.slug ?? publicTypes[0]?.slug

  const scrollToSection = (sectionId: string) => {
    const candidates = Array.from(document.querySelectorAll<HTMLElement>(`[id="${sectionId}"]`))
    const visible = candidates.find((el) => el.getClientRects().length > 0)
    const target = visible ?? candidates[0]
    target?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleToggleSection = (sectionId: string) => {
    setOpenSections((prev) => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        scrollToSection(sectionId)
        trackEvent("resource_section_jump", {
          section_id: sectionId,
          language
        })
        return prev
      }

      if (sectionId === stickySlug) {
        return prev.includes(sectionId) ? prev : [...prev, sectionId]
      }
      const isOpen = prev.includes(sectionId)
      const next = isOpen ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]

      trackEvent("resource_section_jump", {
        section_id: sectionId,
        language
      })

      return next
    })
  }

  return (
    <div className="space-y-0">
      <PageHead
        title={t(language, "page.title.resources")}
        description={t(language, "resources.metaDescription")}
        path="/resources"
      />
      <section className="bg-surface pt-fluid-30 pb-0 lg:p-fluid-50">
        <div className="grid w-full gap-fluid-30 lg:grid-cols-[48fr_52fr]">
          <div className="flex flex-col gap-fluid-15 px-fluid-20 lg:px-0 lg:self-start">
            <span className="text-sub2 font-bold uppercase tracking-[0.15em] text-onSurfaceSecondary">
              {t(language, "resources.kicker")}
            </span>
            <h2 className="text-h2 text-foreground">{t(language, "planNextSteps.title")}</h2>
            <p className="text-body-base lg:text-body-lg text-muted max-w-[520px]">
              {t(language, "planNextSteps.description")}
            </p>
            <Link
              to="/teachers"
              className="mt-2 inline-flex w-fit items-center gap-2 border-[0.5px] border-foreground px-4 py-2 text-body-sm font-semibold text-foreground hover:bg-surface1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
            >
              {t(language, "resources.teacherCta")}
            </Link>
          </div>
          <div className="flex flex-col gap-0 lg:gap-fluid-20 border-t border-foreground lg:border-0">
            {publicTypes.map((type, index, array) => {
              const isOpen = openSections.includes(type.slug)
              return (
                <React.Fragment key={type._id}>
                  <button
                    type="button"
                    onClick={() => handleToggleSection(type.slug)}
                    className="group flex w-full items-center text-left p-5 lg:px-0 lg:py-fluid-15"
                  >
                    <div
                      className={`mr-fluid-20 flex h-[50px] w-[50px] lg:h-[60px] lg:w-[60px] items-center justify-center ${accentBg(type.accent)}`}
                    >
                      <div className="flex h-[30px] w-[30px] lg:h-fluid-35 lg:w-fluid-35 items-center justify-center text-foreground">
                        <TypeGlyph type={type} />
                      </div>
                    </div>
                    <div className="h-[50px] lg:h-[60px] w-[0.5px] bg-foreground" />
                    <div className="flex flex-1 flex-col justify-center gap-fluid-7 pl-fluid-20 pr-0 lg:px-fluid-20">
                      <h3 className="text-h4 lg:text-h4 font-bold text-foreground leading-tight">
                        {getResourceTypeLabel(language, type)}
                      </h3>
                      <p className="text-body-sm lg:text-body-base text-onSurfaceSecondary leading-snug">
                        {getResourceTypeDescription(language, type)}
                      </p>
                    </div>
                    <div className="hidden lg:flex h-[60px] w-[60px] items-center justify-center">
                      <ArrowIndicator />
                    </div>
                    {type.slug !== stickySlug ? (
                      <div className="inline-flex items-center justify-center bg-transparent text-foreground lg:hidden" aria-hidden="true">
                        <div className="h-[15px] w-[15px]">{isOpen ? <MinusIcon /> : <PlusIcon />}</div>
                      </div>
                    ) : null}
                  </button>
                  {index < array.length - 1 && (
                    <div className="h-[0.5px] w-full bg-foreground" aria-hidden="true" />
                  )}
                  {isOpen && (
                    <div className="lg:hidden">
                      <PlanYourNextStepsSection resourceTypes={publicTypes} activeSections={[type.slug]} />
                    </div>
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </section>
      <div className="hidden lg:block">
        <PlanYourNextStepsSection
          resourceTypes={publicTypes}
          activeSections={publicTypes.map((type) => type.slug)}
        />
      </div>
    </div>
  )
}
