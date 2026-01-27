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
  const renderCellContent = (career: CareerForCompare) => {
    switch (type) {
      case "dayToDay":
        return (
          <div className="overflow-hidden">
            {career.videoUrl ? (
              <video 
                className="aspect-square w-full max-w-[260px] mx-auto object-cover [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden" 
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
              >
                <source src={career.videoUrl} />
              </video>
            ) : career.images?.[0]?.asset?.url ? (
              <img
                src={career.images[0].asset.url}
                alt={getLocalizedString(language, career.title) || ""}
                className="aspect-square w-full max-w-[260px] mx-auto object-cover"
              />
            ) : (
              <div className="aspect-square w-full bg-surface2" />
            )}
          </div>
        )

      case "overview": {
        const summary = getLocalizedText(language, career.summary)
        return summary ? (
          <p className="text-[length:var(--text-body-base)] lg:text-[length:var(--text-body-lg)] font-medium leading-[var(--leading-body-base)] lg:leading-[var(--leading-body-lg)] tracking-[var(--tracking-body-base)] lg:tracking-[var(--tracking-body-lg)]">
            {summary}
          </p>
        ) : (
          <p className="text-foreground/60 text-[length:var(--text-body-base)]">—</p>
        )
      }

      case "salary": {
        const { median, rangeMin, rangeMax } = career.salary ?? {}
        const hasSalaryData = median !== undefined || (rangeMin !== undefined && rangeMax !== undefined)

        if (!hasSalaryData) {
          return <p className="text-foreground/60 text-[length:var(--text-body-base)]">—</p>
        }

        const salaryRange =
          rangeMin !== undefined && rangeMax !== undefined
            ? `${formatMoney(rangeMin)} - ${formatMoney(rangeMax)}`
            : undefined

        return (
          <div className="flex flex-col gap-fluid-15 lg:gap-[30px]">
            {median !== undefined && (
              <div className="flex flex-col gap-[5px]">
                <div className="text-[length:var(--text-body-base)] lg:text-[length:var(--text-body-lg)] font-medium leading-[var(--leading-body-base)] lg:leading-[var(--leading-body-lg)] tracking-[var(--tracking-body-base)] lg:tracking-[var(--tracking-body-lg)]">
                  {formatMoney(median)}
                </div>
                <div className="text-[length:var(--text-body-sm)] lg:text-[length:var(--text-body-base)] font-medium leading-[var(--leading-body-base)] tracking-[var(--tracking-body-base)]">
                  {t(language, "compare.medianSalary")}
                </div>
              </div>
            )}
            {salaryRange && (
              <div className="flex flex-col gap-[5px]">
                <div className="text-[length:var(--text-body-base)] lg:text-[length:var(--text-body-lg)] font-medium leading-[var(--leading-body-base)] lg:leading-[var(--leading-body-lg)] tracking-[var(--tracking-body-base)] lg:tracking-[var(--tracking-body-lg)]">
                  {salaryRange}
                </div>
                <div className="text-[length:var(--text-body-base)] font-medium leading-[var(--leading-body-base)] tracking-[var(--tracking-body-base)]">
                  {t(language, "compare.salaryRange")}
                </div>
              </div>
            )}
          </div>
        )
      }

      case "academic": {
        const highlight = getLocalizedString(language, career.academicRequirementsHighlight)
        const programLength = getLocalizedString(language, career.programLengthHighlight)
        return (
          <div className="flex flex-col gap-[5px]">
            {highlight && (
              <div className="text-[length:var(--text-body-lg)] font-medium leading-[var(--leading-body-lg)] tracking-[var(--tracking-body-lg)]">
                {highlight}
              </div>
            )}
            {programLength && (
              <div className="text-[length:var(--text-body-base)] font-medium leading-[var(--leading-body-base)] tracking-[var(--tracking-body-base)]">
                {programLength}
              </div>
            )}
            {!highlight && !programLength && (
              <p className="text-foreground/60 text-[length:var(--text-body-base)]">—</p>
            )}
          </div>
        )
      }

      case "outlook": {
        const outlookValue = career.outlook?.value
        if (outlookValue === undefined) {
          return <p className="text-foreground/60 text-[length:var(--text-body-base)]">—</p>
        }
        return (
          <div className="flex flex-col gap-[5px]">
            <div className="text-[length:var(--text-body-base)] lg:text-[length:var(--text-body-lg)] font-medium leading-[var(--leading-body-base)] lg:leading-[var(--leading-body-lg)] tracking-[var(--tracking-body-base)] lg:tracking-[var(--tracking-body-lg)]">
              {outlookValue}%
            </div>
            <div className="text-[length:var(--text-body-base)] font-medium leading-[var(--leading-body-base)] tracking-[var(--tracking-body-base)]">
              {t(language, "compare.projectedGrowth")}
            </div>
          </div>
        )
      }

      case "responsibilities": {
        const items = getLocalizedBulletList(career, "responsibilities", language)
        return items?.length ? (
          <BulletList items={items.slice(0, 4)} />
        ) : (
          <p className="text-foreground/60 text-[length:var(--text-body-base)]">—</p>
        )
      }

      case "workEnvironments": {
        const items = getLocalizedBulletList(career, "workEnvironment", language)
        return items?.length ? (
          <BulletList items={items.slice(0, 4)} />
        ) : (
          <p className="text-foreground/60 text-[length:var(--text-body-base)]">—</p>
        )
      }

      case "specializations": {
        const items = getLocalizedBulletList(career, "specializations", language)
        return items?.length ? (
          <BulletList items={items.slice(0, 4)} />
        ) : (
          <p className="text-foreground/60 text-[length:var(--text-body-base)]">—</p>
        )
      }

      default:
        return null
    }
  }

  return (
    <div className="flex gap-fluid-20 lg:gap-[50px] py-fluid-25 lg:py-[50px] pl-fluid-20 lg:pl-[50px] pr-fluid-20 lg:pr-[50px]" style={{ minWidth: "min-content" }}>
      {selectedCareers.map((career, idx) => {
        const isLast = idx === selectedCareers.length - 1
        return (
          <React.Fragment key={career._id}>
            <div className="flex w-[220px] lg:w-[300px] shrink-0 items-start">
              {renderCellContent(career)}
            </div>
            {!isLast && <div className="h-full w-[0.5px] shrink-0 bg-foreground" />}
          </React.Fragment>
        )
      })}

      {canAddCareer && (
        <>
          <div className="h-full w-[0.5px] shrink-0 bg-foreground" />
          <div className="flex w-[220px] lg:w-[300px] shrink-0 items-start">
            <div className="text-foreground/40 text-[length:var(--text-body-base)]">—</div>
          </div>
        </>
      )}
    </div>
  )
}

