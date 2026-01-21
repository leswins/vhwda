import React, { useState } from "react"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"
import { useLanguageStore } from "../../zustand/useLanguageStore"
import { OrganizationFilters as OrganizationFiltersComponent } from "./OrganizationFilters"
import { ScholarshipList } from "./ScholarshipList"
import { ProfessionalOrganizationList } from "./ProfessionalOrganizationList"
import { EducationalInstitutionsList } from "./EducationalInstitutionsList"
import { SectionHeader } from "./SectionHeader"
import type { ScholarshipFilters } from "./filters/scholarshipFilters"
import type { OrganizationFilters } from "./filters/organizationFilters"
import helpIcon from "../../assets/icons/Help.svg"
import doctorIcon from "../../assets/icons/Doctor.svg"
import educationIcon from "../../assets/icons/Education.svg"

type FiltersPanelProps = {
  language: Language
  searchPlaceholderKey: string
  searchQuery: string
  onSearchChange: (query: string) => void
  children?: React.ReactNode
}

function FiltersPanel({
  language,
  searchPlaceholderKey,
  searchQuery,
  onSearchChange,
  children
}: FiltersPanelProps) {
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [activeTab, setActiveTab] = useState<"filter" | "sort">("filter")

  return (
    <div className="flex h-full flex-col border-r-[0.5px] border-foreground">
      <div className="sticky top-0 z-10 bg-surface border-b-[0.5px] border-foreground shrink-0">
        <div className="relative flex items-center gap-[20px] p-[25px] h-[72px]">
          <div
            className={`flex items-center gap-[20px] transition-opacity duration-300 ${isSearchActive ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            <button
              onClick={() => setActiveTab("filter")}
              className={`text-body-base font-medium hover:underline hover:underline-offset-4 ${activeTab === "filter" ? "text-foreground hover:decoration-foreground" : "text-muted hover:decoration-muted"}`}
            >
              {t(language, "filters.filter")}
            </button>
            <div className="h-[20px] w-[0.5px] bg-foreground" />
            <button
              onClick={() => setActiveTab("sort")}
              className={`text-body-base font-medium hover:underline hover:underline-offset-4 ${activeTab === "sort" ? "text-foreground hover:decoration-foreground" : "text-muted hover:decoration-muted"}`}
            >
              {t(language, "filters.sort")}
            </button>
          </div>

          <button
            onClick={() => setIsSearchActive(true)}
            className={`ml-auto transition-opacity duration-300 ${isSearchActive ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            aria-label={t(language, "filters.search")}
          >
            <svg className="h-5 w-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <div
            className={`absolute inset-0 flex items-center gap-3 px-[25px] transition-opacity duration-300 ${isSearchActive ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <input
              type="text"
              placeholder={t(language, searchPlaceholderKey)}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus={isSearchActive}
              className="flex-1 border-0 bg-transparent py-1 text-body-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-0"
            />
            <button
              onClick={() => setIsSearchActive(false)}
              className="shrink-0"
              aria-label={t(language, "filters.search")}
            >
              <svg width="15" height="15" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.79541 0.795532L15.7954 15.7955M0.79541 15.7955L15.7954 0.795532" stroke="rgb(var(--color-accent-orange))" strokeWidth="2.25" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[25px] p-[25px] overflow-y-auto flex-1 scrollbar-hide">
        {activeTab === "filter" ? children : null}
      </div>
    </div>
  )
}

export function PlanYourNextStepsSection() {
  const { language } = useLanguageStore()
  const [scholarshipCount, setScholarshipCount] = useState(0)
  const [organizationCount, setOrganizationCount] = useState(0)
  const [institutionCount, setInstitutionCount] = useState(0)
  
  const [scholarshipFilters, setScholarshipFilters] = useState<ScholarshipFilters>({
    searchQuery: ""
  })

  const [organizationFilters, setOrganizationFilters] = useState<OrganizationFilters>({
    searchQuery: "",
    selectedMembershipTypes: [],
    selectedGeographicFocus: [],
    selectedCareerAreas: []
  })

  const handleScholarshipSearchChange = (query: string) => {
    setScholarshipFilters({ searchQuery: query })
  }

  const handleOrganizationSearchChange = (query: string) => {
    setOrganizationFilters((prev) => ({ ...prev, searchQuery: query }))
  }

  return (
    <div className="space-y-0">
      <section id="scholarships" className="scroll-mt-8">
        <SectionHeader
          language={language}
          titleKey="planNextSteps.card.scholarships.title"
          count={scholarshipCount}
          iconBgColor="bg-[rgb(var(--color-accent-green))]"
          iconSrc={helpIcon}
          iconAlt={t(language, "planNextSteps.card.scholarships.title")}
        />
        <div className="grid grid-cols-1 lg:grid-cols-[30%_1fr] h-[800px] min-h-[calc(95vh-75px)] border-b-[0.5px] border-foreground">
          <div className="sticky top-0 h-full">
            <FiltersPanel
              language={language}
              searchPlaceholderKey="filters.search"
              searchQuery={scholarshipFilters.searchQuery}
              onSearchChange={handleScholarshipSearchChange}
            />
          </div>
          <div className="h-full overflow-y-auto scrollbar-hide p-[50px]">
            <ScholarshipList
              language={language}
              filters={scholarshipFilters}
              onCountChange={setScholarshipCount}
            />
          </div>
        </div>
      </section>

      <section id="organizations" className="scroll-mt-8">
        <SectionHeader
          language={language}
          titleKey="planNextSteps.card.professionalOrganizations.title"
          count={organizationCount}
          iconBgColor="bg-[rgb(var(--color-accent-pink))]"
          iconSrc={doctorIcon}
          iconAlt={t(language, "planNextSteps.card.professionalOrganizations.title")}
        />
        <div className="grid grid-cols-1 lg:grid-cols-[30%_1fr] h-[800px] min-h-[calc(95vh-75px)] border-b-[0.5px] border-foreground">
          <div className="sticky top-0 h-full">
            <FiltersPanel
              language={language}
              searchPlaceholderKey="filters.search"
              searchQuery={organizationFilters.searchQuery}
              onSearchChange={handleOrganizationSearchChange}
            >
              <OrganizationFiltersComponent
                language={language}
                filters={organizationFilters}
                onFiltersChange={setOrganizationFilters}
              />
            </FiltersPanel>
          </div>
          <div className="h-full overflow-y-auto scrollbar-hide p-[50px]">
            <ProfessionalOrganizationList
              language={language}
              filters={organizationFilters}
              onCountChange={setOrganizationCount}
            />
          </div>
        </div>
      </section>

      <section id="schools" className="scroll-mt-8">
        <SectionHeader
          language={language}
          titleKey="planNextSteps.card.schoolsPrerequisites.title"
          count={institutionCount}
          iconBgColor="bg-[rgb(var(--color-accent-blue))]"
          iconSrc={educationIcon}
          iconAlt={t(language, "planNextSteps.card.schoolsPrerequisites.title")}
        />
        <EducationalInstitutionsList language={language} onCountChange={setInstitutionCount} />
      </section>
    </div>
  )
}

