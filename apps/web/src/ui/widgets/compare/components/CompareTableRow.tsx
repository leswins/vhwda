import React from "react"
import type { CareerForCompare } from "../../../../sanity/queries/careers"
import { getLocalizedString, getLocalizedText } from "../../../../sanity/queries/careers"
import type { Language } from "../../../../utils/i18n"
import { t } from "../../../../utils/i18n"
import { formatMoney } from "../utils/formatMoney"
import { BulletList } from "./BulletList"

function getLocalizedBulletList(
  career: CareerForCompare,
  field: "responsibilities" | "workEnvironment" | "specializations",
  language: Language
): string[] | undefined {
  const value = career[field]
  if (!value) return undefined
  return language === "es" ? value.es ?? value.en : value.en
}

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
        const { median, rangeMin, rangeMax } = career.salary ?? {}
        const hasSalaryData = median !== undefined || (rangeMin !== undefined && rangeMax !== undefined)

        if (!hasSalaryData) {
          return <p className="text-foreground/60 text-sm">{t(language, "common.missing")}</p>
        }

        const salaryRange =
          rangeMin !== undefined && rangeMax !== undefined
            ? `${formatMoney(rangeMin)} - ${formatMoney(rangeMax)}`
            : undefined

        return (
          <div className="space-y-2">
            {median !== undefined && (
              <>
                <div className="text-lg font-semibold">{formatMoney(median)}</div>
                <div className="text-sm text-foreground/60">{t(language, "compare.medianSalary")}</div>
              </>
            )}
            {salaryRange && (
              <>
                <div className="text-lg font-semibold">{salaryRange}</div>
                <div className="text-sm text-foreground/60">{t(language, "compare.salaryRange")}</div>
              </>
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
        if (outlookValue === undefined) {
          return <p className="text-foreground/60 text-sm">{t(language, "common.missing")}</p>
        }
        return (
          <div className="space-y-1">
            <div className="text-lg font-semibold">{outlookValue}%</div>
            <div className="text-sm text-foreground/60">{t(language, "compare.projectedGrowth")}</div>
          </div>
        )
      }

      case "responsibilities": {
        const items = getLocalizedBulletList(career, "responsibilities", language)
        return items?.length ? (
          <BulletList items={items.slice(0, 4)} />
        ) : (
          <p className="text-foreground/60 text-sm">{t(language, "common.missing")}</p>
        )
      }

      case "workEnvironments": {
        const items = getLocalizedBulletList(career, "workEnvironment", language)
        return items?.length ? (
          <BulletList items={items.slice(0, 4)} />
        ) : (
          <p className="text-foreground/60 text-sm">{t(language, "common.missing")}</p>
        )
      }

      case "specializations": {
        const items = getLocalizedBulletList(career, "specializations", language)
        return items?.length ? (
          <BulletList items={items.slice(0, 4)} />
        ) : (
          <p className="text-foreground/60 text-sm">{t(language, "common.missing")}</p>
        )
      }

      default:
        return null
    }
  }

  const borderClass = isLast ? "" : "border-b border-foreground"

  return (
    <div className={`grid ${borderClass}`} style={{ gridTemplateColumns: gridCols }}>
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

