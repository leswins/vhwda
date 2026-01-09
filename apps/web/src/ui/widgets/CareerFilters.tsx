import React, { useState } from "react"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"
import type { CareerSummaryCard } from "../../sanity/queries/careers"

type FilterState = {
  searchQuery: string
  selectedCategories: string[]
  selectedEducation: string[]
  salaryRange: { min?: number; max?: number }
  selectedOutlook: string[]
  selectedWorkEnvironments: string[]
  patientFacing: "yes" | "no" | null
  selectedSpecializations: string[]
}

type Props = {
  language: Language
  careers: CareerSummaryCard[]
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

const EDUCATION_LEVELS = [
  { value: "FF", label: { en: "FastForward / <6 months", es: "FastForward / <6 meses" } },
  { value: "CSC", label: { en: "Career Studies Certificate (~12-18 credits)", es: "Certificado de Estudios Profesionales (~12-18 créditos)" } },
  { value: "CERT", label: { en: "Certificate", es: "Certificado" } },
  { value: "AAS", label: { en: "Associate (AAS/2 years)", es: "Asociado (AAS/2 años)" } },
  { value: "BACH", label: { en: "Bachelor's (≈4 years)", es: "Licenciatura (≈4 años)" } },
  { value: "GRAD", label: { en: "Graduate degree", es: "Grado de posgrado" } }
]

const OUTLOOK_LABELS = {
  High: { en: "High", es: "Alto" },
  Medium: { en: "Medium", es: "Medio" },
  Low: { en: "Low", es: "Bajo" }
}

const WORK_ENVIRONMENTS = [
  { value: "hospital", label: { en: "Hospital", es: "Hospital" }, vectorKey: "w_env_hospital" },
  { value: "clinic", label: { en: "Clinic", es: "Clínica" }, vectorKey: "w_env_clinic" },
  { value: "community", label: { en: "Community", es: "Comunidad" }, vectorKey: "w_env_community" },
  { value: "school", label: { en: "School", es: "Escuela" }, vectorKey: "w_env_school" },
  { value: "lab", label: { en: "Lab", es: "Laboratorio" }, vectorKey: "w_env_lab" },
  { value: "office", label: { en: "Office", es: "Oficina" }, vectorKey: "w_env_office" }
]

export function CareerFilters({ language, careers, filters, onFiltersChange }: Props) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    careerGroup: true,
    education: false,
    salary: false,
    outlook: false,
    workEnvironment: false,
    patientInteraction: false,
    specializations: false
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const categories = Array.from(
    new Set(
      careers
        .flatMap(c => c.categories?.map(cat => cat.title) || [])
        .filter(Boolean)
    )
  ).sort()

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter(c => c !== category)
      : [...filters.selectedCategories, category]
    onFiltersChange({ ...filters, selectedCategories: newCategories })
  }

  const handleEducationToggle = (education: string) => {
    const newEducation = filters.selectedEducation.includes(education)
      ? filters.selectedEducation.filter(e => e !== education)
      : [...filters.selectedEducation, education]
    onFiltersChange({ ...filters, selectedEducation: newEducation })
  }

  const handleOutlookToggle = (outlook: string) => {
    const newOutlook = filters.selectedOutlook.includes(outlook)
      ? filters.selectedOutlook.filter(o => o !== outlook)
      : [...filters.selectedOutlook, outlook]
    onFiltersChange({ ...filters, selectedOutlook: newOutlook })
  }

  const handleWorkEnvironmentToggle = (env: string) => {
    const newEnvs = filters.selectedWorkEnvironments.includes(env)
      ? filters.selectedWorkEnvironments.filter(e => e !== env)
      : [...filters.selectedWorkEnvironments, env]
    onFiltersChange({ ...filters, selectedWorkEnvironments: newEnvs })
  }

  const handlePatientFacingChange = (value: "yes" | "no" | null) => {
    onFiltersChange({ ...filters, patientFacing: value === filters.patientFacing ? null : value })
  }

  const handleSearchChange = (query: string) => {
    onFiltersChange({ ...filters, searchQuery: query })
  }

  const getCategoryCount = (category: string) => {
    return careers.filter(c => c.categories?.some(cat => cat.title === category)).length
  }

  return (
    <aside className="w-full space-y-6 lg:w-64">
      <div className="space-y-2">
        <div className="flex gap-4 text-sm">
          <button className="font-semibold text-foreground">Filter</button>
          <button className="text-muted">Sort</button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder={t(language, "search.placeholder")}
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        <div className="border-b border-foreground/20 pb-4">
          <button
            onClick={() => toggleSection("careerGroup")}
            className="flex w-full items-center justify-between text-sm font-medium"
          >
            <span>{t(language, "filters.careerGroup")}</span>
            <span className="text-lg leading-none">{expandedSections.careerGroup ? "−" : "+"}</span>
          </button>
          {expandedSections.careerGroup && (
            <div className="mt-3 space-y-2">
              {categories.map(category => (
                <label key={category} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <span>
                    {category} ({getCategoryCount(category)})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="border-b border-foreground/20 pb-4">
          <button
            onClick={() => toggleSection("education")}
            className="flex w-full items-center justify-between text-sm font-medium"
          >
            <span>{t(language, "filters.requiredEducation")}</span>
            <span className="text-lg leading-none">{expandedSections.education ? "−" : "+"}</span>
          </button>
          {expandedSections.education && (
            <div className="mt-3 space-y-2">
              {EDUCATION_LEVELS.map(level => (
                <label key={level.value} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.selectedEducation.includes(level.value)}
                    onChange={() => handleEducationToggle(level.value)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <span>{language === "es" ? level.label.es : level.label.en}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="border-b border-foreground/20 pb-4">
          <button
            onClick={() => toggleSection("salary")}
            className="flex w-full items-center justify-between text-sm font-medium"
          >
            <span>{t(language, "filters.salaryRange")}</span>
            <span className="text-lg leading-none">{expandedSections.salary ? "−" : "+"}</span>
          </button>
          {expandedSections.salary && (
            <div className="mt-3 space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={t(language, "filters.minSalary")}
                  value={filters.salaryRange.min || ""}
                  onChange={(e) => {
                    const min = e.target.value ? Number(e.target.value) : undefined
                    onFiltersChange({
                      ...filters,
                      salaryRange: { ...filters.salaryRange, min }
                    })
                  }}
                  className="w-full rounded border border-border bg-surface px-2 py-1 text-sm"
                />
                <input
                  type="number"
                  placeholder={t(language, "filters.maxSalary")}
                  value={filters.salaryRange.max || ""}
                  onChange={(e) => {
                    const max = e.target.value ? Number(e.target.value) : undefined
                    onFiltersChange({
                      ...filters,
                      salaryRange: { ...filters.salaryRange, max }
                    })
                  }}
                  className="w-full rounded border border-border bg-surface px-2 py-1 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        <div className="border-b border-foreground/20 pb-4">
          <button
            onClick={() => toggleSection("outlook")}
            className="flex w-full items-center justify-between text-sm font-medium"
          >
            <span>{t(language, "filters.jobOutlook")}</span>
            <span className="text-lg leading-none">{expandedSections.outlook ? "−" : "+"}</span>
          </button>
          {expandedSections.outlook && (
            <div className="mt-3 space-y-2">
              {Object.entries(OUTLOOK_LABELS).map(([key, label]) => (
                <label key={key} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.selectedOutlook.includes(key)}
                    onChange={() => handleOutlookToggle(key)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <span>{language === "es" ? label.es : label.en}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="border-b border-foreground/20 pb-4">
          <button
            onClick={() => toggleSection("workEnvironment")}
            className="flex w-full items-center justify-between text-sm font-medium"
          >
            <span>{t(language, "filters.workEnvironment")}</span>
            <span className="text-lg leading-none">{expandedSections.workEnvironment ? "−" : "+"}</span>
          </button>
          {expandedSections.workEnvironment && (
            <div className="mt-3 space-y-2">
              {WORK_ENVIRONMENTS.map(env => (
                <label key={env.value} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.selectedWorkEnvironments.includes(env.value)}
                    onChange={() => handleWorkEnvironmentToggle(env.value)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <span>{language === "es" ? env.label.es : env.label.en}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="border-b border-foreground/20 pb-4">
          <button
            onClick={() => toggleSection("patientInteraction")}
            className="flex w-full items-center justify-between text-sm font-medium"
          >
            <span>{t(language, "filters.patientInteraction")}</span>
            <span className="text-lg leading-none">{expandedSections.patientInteraction ? "−" : "+"}</span>
          </button>
          {expandedSections.patientInteraction && (
            <div className="mt-3 space-y-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="patientFacing"
                  checked={filters.patientFacing === "yes"}
                  onChange={() => handlePatientFacingChange("yes")}
                  className="h-4 w-4 rounded border-border"
                />
                <span>{t(language, "filters.yes")}</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="patientFacing"
                  checked={filters.patientFacing === "no"}
                  onChange={() => handlePatientFacingChange("no")}
                  className="h-4 w-4 rounded border-border"
                />
                <span>{t(language, "filters.no")}</span>
              </label>
            </div>
          )}
        </div>

        <div className="border-b border-foreground/20 pb-4">
          <button
            onClick={() => toggleSection("specializations")}
            className="flex w-full items-center justify-between text-sm font-medium"
          >
            <span>{t(language, "filters.areasOfSpecialization")}</span>
            <span className="text-lg leading-none">{expandedSections.specializations ? "−" : "+"}</span>
          </button>
          {expandedSections.specializations && (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-foreground/60">{t(language, "filters.comingSoon")}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

