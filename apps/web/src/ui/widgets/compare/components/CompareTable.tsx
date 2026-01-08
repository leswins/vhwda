import React from "react"
import type { CareerForCompare } from "../../../../sanity/queries/careers"
import type { Language } from "../../../../utils/i18n"
import { t } from "../../../../utils/i18n"
import { CompareTableRow } from "./CompareTableRow"

interface CompareTableProps {
  selectedCareers: CareerForCompare[]
  language: Language
  canAddCareer?: boolean
}

type RowType = "dayToDay" | "overview" | "salary" | "academic" | "outlook" | "responsibilities" | "workEnvironments" | "specializations"

interface SectionConfig {
  key: RowType
  translationKey: string
}

export function CompareTable({ selectedCareers, language, canAddCareer = false }: CompareTableProps) {
  const sections: SectionConfig[] = [
    { key: "dayToDay", translationKey: "compare.sections.dayToDay" },
    { key: "overview", translationKey: "compare.sections.overview" },
    { key: "salary", translationKey: "compare.sections.salaryDetails" },
    { key: "academic", translationKey: "compare.sections.academicRequirements" },
    { key: "outlook", translationKey: "compare.sections.jobOutlook" },
    { key: "responsibilities", translationKey: "compare.sections.responsibilities" },
    { key: "workEnvironments", translationKey: "compare.sections.workEnvironments" },
    { key: "specializations", translationKey: "compare.sections.areasOfSpecialization" },
  ]

  return (
    <div className="overflow-x-auto overflow-y-visible">
      <div className="min-w-full border border-foreground">
        {sections.map((section, idx) => {
          const isLast = idx === sections.length - 1
          return (
            <CompareTableRow
              key={section.key}
              category={t(language, section.translationKey as any)}
              selectedCareers={selectedCareers}
              language={language}
              type={section.key}
              canAddCareer={canAddCareer && isLast}
              isLast={isLast}
            />
          )
        })}
      </div>
    </div>
  )
}

