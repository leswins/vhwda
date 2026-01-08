import React from "react"
import type { CareerForCompare } from "../../../../sanity/queries/careers"
import { getLocalizedString, getLocalizedText } from "../../../../sanity/queries/careers"
import type { Language } from "../../../../utils/i18n"
import { t } from "../../../../utils/i18n"
import { formatMoney } from "../utils/formatMoney"
import { PortableTextPlain } from "./PortableTextPlain"
import { BulletList } from "./BulletList"

type RowType = "dayToDay" | "overview" | "salary" | "academic" | "outlook" | "responsibilities" | "workEnvironments" | "specializations"

interface CompareTableRowProps {
  category: string
  selectedCareers: CareerForCompare[]
  language: Language
  type: RowType
  canAddCareer?: boolean
  isLast?: boolean
}

export function CompareTableRow({
  category,
  selectedCareers,
  language,
  type,
  canAddCareer = false,
  isLast = false,
}: CompareTableRowProps) {
  const gridCols = `200px repeat(${selectedCareers.length}, 1fr)${canAddCareer ? " 200px" : ""}`

  const renderCellContent = (career: CareerForCompare) => {
    switch (type) {
      case "dayToDay":
        return (
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
        )

      case "overview": {
        const summary = getLocalizedText(language, career.summary)
        return summary ? (
          <p className="text-foreground text-sm leading-relaxed">{summary}</p>
        ) : (
          <p className="text-foreground/60 text-sm">{t(language, "common.missing")}</p>
        )
      }

      case "salary": {
        const rangeMin = career.salary?.rangeMin
        const rangeMax = career.salary?.rangeMax
        const salaryRange = rangeMin && rangeMax ? `${formatMoney(rangeMin)} - ${formatMoney(rangeMax)}` : undefined
        return (
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
              <p className="text-foreground/60 text-sm">{t(language, "common.missing")}</p>
            )}
          </div>
        )
      }

      case "academic": {
        const highlight = getLocalizedString(language, career.academicRequirementsHighlight)
        const programLength = getLocalizedString(language, career.programLengthHighlight)
        return (
          <div className="space-y-1.5">
            {highlight && <div className="font-semibold text-foreground">{highlight}</div>}
            {programLength && <div className="text-foreground">{programLength}</div>}
            {!highlight && !programLength && (
              <p className="text-foreground/60 text-sm">{t(language, "common.missing")}</p>
            )}
          </div>
        )
      }

      case "outlook": {
        const outlookValue = career.outlook?.value
        const outlookText = outlookValue !== undefined ? `${outlookValue}%` : null
        return outlookText ? (
          <div className="space-y-1">
            <div className="text-lg font-semibold">{outlookText}</div>
            <div className="text-sm text-foreground/60">{t(language, "compare.projectedGrowth")}</div>
          </div>
        ) : (
          <p className="text-foreground/60 text-sm">{t(language, "common.missing")}</p>
        )
      }

      case "responsibilities": {
        const responsibilities = language === "es"
          ? career.responsibilities?.es ?? career.responsibilities?.en
          : career.responsibilities?.en
        return responsibilities?.length ? (
          <BulletList items={responsibilities.slice(0, 4)} />
        ) : (
          <p className="text-foreground/60 text-sm">{t(language, "common.missing")}</p>
        )
      }

      case "workEnvironments": {
        const workEnvironments = language === "es"
          ? career.workEnvironment?.es ?? career.workEnvironment?.en
          : career.workEnvironment?.en
        return workEnvironments?.length ? (
          <BulletList items={workEnvironments.slice(0, 4)} />
        ) : (
          <p className="text-foreground/60 text-sm">{t(language, "common.missing")}</p>
        )
      }

      case "specializations": {
        const specializations = language === "es"
          ? career.specializations?.es ?? career.specializations?.en
          : career.specializations?.en
        return specializations?.length ? (
          <BulletList items={specializations.slice(0, 4)} />
        ) : (
          <p className="text-foreground/60 text-sm">{t(language, "common.missing")}</p>
        )
      }

      default:
        return null
    }
  }

  return (
    <div className={`grid ${isLast ? "" : "border-b border-foreground"}`} style={{ gridTemplateColumns: gridCols }}>
      <div className="flex items-start border-r border-foreground bg-surface1 p-4 font-semibold">
        {category}
      </div>
      {selectedCareers.map(career => (
        <div key={career._id} className="flex items-start border-r border-foreground p-4 last:border-r-0">
          <div className="w-full">
            {renderCellContent(career)}
          </div>
        </div>
      ))}
      {canAddCareer && (
        <div className="flex items-start border-l border-foreground p-4">
          <div className="text-foreground/40 text-sm">—</div>
        </div>
      )}
    </div>
  )
}

