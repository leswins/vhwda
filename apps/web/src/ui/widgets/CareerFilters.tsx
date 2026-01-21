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
    education: false,
    salary: false,
    outlook: false,
    workEnvironment: false,
    patientInteraction: false,
    specializations: false
  })
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
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

  return (
    <aside className="w-full flex flex-col gap-[20px]">
      <div className="flex flex-col gap-[20px]">
        <button
          onClick={() => toggleSection("education")}
          className="flex w-full items-center justify-between"
        >
          <span className="text-h5 font-bold text-foreground">{t(language, "filters.requiredEducation")}</span>
          {expandedSections.education ? (
            <svg width="15" height="2" viewBox="0 0 15 2" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 1H7.5H15" stroke="#09090B" strokeWidth="2"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 0V7.5M7.5 7.5V15M7.5 7.5H0M7.5 7.5H15" stroke="#09090B" strokeWidth="2"/>
            </svg>
          )}
        </button>
          {expandedSections.education && (
            <div className="flex flex-col gap-[15px]">
              {EDUCATION_LEVELS.map(level => (
                <label key={level.value} className="flex cursor-pointer items-center gap-[15px]">
                  <div className="relative h-5 w-5 shrink-0">
                    <input
                      type="checkbox"
                      checked={filters.selectedEducation.includes(level.value)}
                      onChange={() => handleEducationToggle(level.value)}
                      className="peer h-5 w-5 appearance-none border-[0.5px] border-foreground bg-surface1 checked:bg-surface1"
                    />
                    {filters.selectedEducation.includes(level.value) && (
                      <svg className="pointer-events-none absolute inset-0 h-5 w-5 text-foreground" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 10L8 14L16 6" />
                      </svg>
                    )}
                  </div>
                  <span className="text-body-base font-medium text-muted">{language === "es" ? level.label.es : level.label.en}</span>
                </label>
              ))}
            </div>
          )}
      </div>

      <div className="h-[0.5px] w-full bg-foreground shrink-0" />

      <div className="flex flex-col gap-[20px]">
        <button
          onClick={() => toggleSection("salary")}
          className="flex w-full items-center justify-between"
        >
          <span className="text-h5 font-bold text-foreground">{t(language, "filters.salaryRange")}</span>
          {expandedSections.salary ? (
            <svg width="15" height="2" viewBox="0 0 15 2" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 1H7.5H15" stroke="#09090B" strokeWidth="2"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 0V7.5M7.5 7.5V15M7.5 7.5H0M7.5 7.5H15" stroke="#09090B" strokeWidth="2"/>
            </svg>
          )}
        </button>
          {expandedSections.salary && (
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
                className="w-full border-[0.5px] border-foreground bg-surface px-2 py-1 text-sm"
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
                className="w-full border-[0.5px] border-foreground bg-surface px-2 py-1 text-sm"
              />
            </div>
          )}
      </div>

      <div className="h-[0.5px] w-full bg-foreground shrink-0" />

      <div className="flex flex-col gap-[20px]">
        <button
          onClick={() => toggleSection("outlook")}
          className="flex w-full items-center justify-between"
        >
          <span className="text-h5 font-bold text-foreground">{t(language, "filters.jobOutlook")}</span>
          {expandedSections.outlook ? (
            <svg width="15" height="2" viewBox="0 0 15 2" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 1H7.5H15" stroke="#09090B" strokeWidth="2"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 0V7.5M7.5 7.5V15M7.5 7.5H0M7.5 7.5H15" stroke="#09090B" strokeWidth="2"/>
            </svg>
          )}
        </button>
          {expandedSections.outlook && (
            <div className="flex flex-col gap-[15px]">
              {Object.entries(OUTLOOK_LABELS).map(([key, label]) => (
                <label key={key} className="flex cursor-pointer items-center gap-[15px]">
                  <div className="relative h-5 w-5 shrink-0">
                    <input
                      type="checkbox"
                      checked={filters.selectedOutlook.includes(key)}
                      onChange={() => handleOutlookToggle(key)}
                      className="peer h-5 w-5 appearance-none border-[0.5px] border-foreground bg-surface1 checked:bg-surface1"
                    />
                    {filters.selectedOutlook.includes(key) && (
                      <svg className="pointer-events-none absolute inset-0 h-5 w-5 text-foreground" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 10L8 14L16 6" />
                      </svg>
                    )}
                  </div>
                  <span className="text-body-base font-medium text-muted">{language === "es" ? label.es : label.en}</span>
                </label>
              ))}
            </div>
          )}
      </div>

      <div className="h-[0.5px] w-full bg-foreground shrink-0" />

      <div className="flex flex-col gap-[20px]">
        <button
          onClick={() => toggleSection("workEnvironment")}
          className="flex w-full items-center justify-between"
        >
          <span className="text-h5 font-bold text-foreground">{t(language, "filters.workEnvironment")}</span>
          {expandedSections.workEnvironment ? (
            <svg width="15" height="2" viewBox="0 0 15 2" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 1H7.5H15" stroke="#09090B" strokeWidth="2"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 0V7.5M7.5 7.5V15M7.5 7.5H0M7.5 7.5H15" stroke="#09090B" strokeWidth="2"/>
            </svg>
          )}
        </button>
          {expandedSections.workEnvironment && (
            <div className="flex flex-col gap-[15px]">
              {WORK_ENVIRONMENTS.map(env => (
                <label key={env.value} className="flex cursor-pointer items-center gap-[15px]">
                  <div className="relative h-5 w-5 shrink-0">
                    <input
                      type="checkbox"
                      checked={filters.selectedWorkEnvironments.includes(env.value)}
                      onChange={() => handleWorkEnvironmentToggle(env.value)}
                      className="peer h-5 w-5 appearance-none border-[0.5px] border-foreground bg-surface1 checked:bg-surface1"
                    />
                    {filters.selectedWorkEnvironments.includes(env.value) && (
                      <svg className="pointer-events-none absolute inset-0 h-5 w-5 text-foreground" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 10L8 14L16 6" />
                      </svg>
                    )}
                  </div>
                  <span className="text-body-base font-medium text-muted">{language === "es" ? env.label.es : env.label.en}</span>
                </label>
              ))}
            </div>
          )}
      </div>

      <div className="h-[0.5px] w-full bg-foreground shrink-0" />

      <div className="flex flex-col gap-[20px]">
        <button
          onClick={() => toggleSection("patientInteraction")}
          className="flex w-full items-center justify-between"
        >
          <span className="text-h5 font-bold text-foreground">{t(language, "filters.patientInteraction")}</span>
          {expandedSections.patientInteraction ? (
            <svg width="15" height="2" viewBox="0 0 15 2" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 1H7.5H15" stroke="#09090B" strokeWidth="2"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 0V7.5M7.5 7.5V15M7.5 7.5H0M7.5 7.5H15" stroke="#09090B" strokeWidth="2"/>
            </svg>
          )}
        </button>
          {expandedSections.patientInteraction && (
            <div className="flex flex-col gap-[15px]">
              <label className="flex cursor-pointer items-center gap-[15px]">
                <div className="relative h-5 w-5 shrink-0">
                  <input
                    type="radio"
                    name="patientFacing"
                    checked={filters.patientFacing === "yes"}
                    onChange={() => handlePatientFacingChange("yes")}
                    className="peer h-5 w-5 appearance-none rounded-full border-[0.5px] border-foreground bg-surface1 checked:bg-surface1"
                  />
                  {filters.patientFacing === "yes" && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-foreground" />
                    </div>
                  )}
                </div>
                <span className="text-body-base font-medium text-muted">{t(language, "filters.yes")}</span>
              </label>
              <label className="flex cursor-pointer items-center gap-[15px]">
                <div className="relative h-5 w-5 shrink-0">
                  <input
                    type="radio"
                    name="patientFacing"
                    checked={filters.patientFacing === "no"}
                    onChange={() => handlePatientFacingChange("no")}
                    className="peer h-5 w-5 appearance-none rounded-full border-[0.5px] border-foreground bg-surface1 checked:bg-surface1"
                  />
                  {filters.patientFacing === "no" && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-foreground" />
                    </div>
                  )}
                </div>
                <span className="text-body-base font-medium text-muted">{t(language, "filters.no")}</span>
              </label>
            </div>
          )}
      </div>

      <div className="h-[0.5px] w-full bg-foreground shrink-0" />

      <div className="flex flex-col gap-[20px]">
        <button
          onClick={() => toggleSection("specializations")}
          className="flex w-full items-center justify-between"
        >
          <span className="text-h5 font-bold text-foreground">{t(language, "filters.areasOfSpecialization")}</span>
          {expandedSections.specializations ? (
            <svg width="15" height="2" viewBox="0 0 15 2" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 1H7.5H15" stroke="#09090B" strokeWidth="2"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 0V7.5M7.5 7.5V15M7.5 7.5H0M7.5 7.5H15" stroke="#09090B" strokeWidth="2"/>
            </svg>
          )}
        </button>
        {expandedSections.specializations && (
          <p className="text-body-base text-muted">{t(language, "filters.comingSoon")}</p>
        )}
      </div>
    </aside>
  )
}

