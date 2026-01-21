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

const SECTIONS: SectionConfig[] = [
  { key: "dayToDay", translationKey: "compare.sections.dayToDay" },
  { key: "overview", translationKey: "compare.sections.overview" },
  { key: "salary", translationKey: "compare.sections.salaryDetails" },
  { key: "academic", translationKey: "compare.sections.academicRequirements" },
  { key: "outlook", translationKey: "compare.sections.jobOutlook" },
  { key: "responsibilities", translationKey: "compare.sections.responsibilities" },
  { key: "workEnvironments", translationKey: "compare.sections.workEnvironments" },
  { key: "specializations", translationKey: "compare.sections.areasOfSpecialization" },
] as const

export function CompareTable({ selectedCareers, language, canAddCareer = false }: CompareTableProps) {

  return (
    <div className="flex flex-col">
      {SECTIONS.map((section, idx) => {
        const isLast = idx === SECTIONS.length - 1
        return (
          <React.Fragment key={section.key}>
            <div className="flex">
              {/* Fixed left: category label */}
              <div className="sticky left-0 z-10 flex w-[250px] shrink-0 items-start bg-surface px-[50px] py-[50px]">
                <span className="text-[length:var(--text-h5)] font-bold leading-[var(--leading-h5)] tracking-[var(--tracking-h5)]">
                  {t(language, section.translationKey)}
                </span>
              </div>

              {/* Vertical divider */}
              <div className="sticky left-[250px] z-10 w-[0.5px] shrink-0 bg-foreground" />

              {/* Content area: career data */}
              <div className="flex-1">
                <CompareTableRow
                  category={t(language, section.translationKey)}
                  selectedCareers={selectedCareers}
                  language={language}
                  type={section.key}
                  canAddCareer={canAddCareer}
                  isLast={false}
                />
              </div>
            </div>
            {!isLast && (
              <div className="flex">
                <div className="sticky left-0 z-10 w-[250px] shrink-0 bg-surface px-[50px]">
                  <div className="h-[0.5px] w-full bg-foreground" />
                </div>
                <div className="sticky left-[250px] z-10 w-[0.5px] shrink-0 bg-foreground" />
                <div className="flex-1">
                  <div className="px-[50px]">
                    <div className="h-[0.5px] w-full bg-foreground" />
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

