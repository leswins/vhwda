import React from "react"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"
import { getLocalizedString } from "../../sanity/queries/careers"
import type { GlobalSearchResult } from "../../sanity/queries/globalSearch"
import scaleIcon from "../../assets/icons/Scale.svg"
import doctorIcon from "../../assets/icons/Doctor.svg"
import moneyIcon from "../../assets/icons/Money.svg"
import errorIcon from "../../assets/icons/error.svg"

type GlobalSearchDropdownProps = {
  searchQuery: string
  results: GlobalSearchResult[]
  language: Language
  isLoading?: boolean
  onResultClick: (result: GlobalSearchResult) => void
}

const getResultTypeLabel = (language: Language, result: GlobalSearchResult) => {
  switch (result._type) {
    case "career":
      return t(language, "header.searchTypeCareer")
    case "scholarship":
      return t(language, "header.searchTypeScholarship")
    case "professionalOrganization":
      return t(language, "header.searchTypeOrganization")
    default:
      return ""
  }
}

const getResultTitle = (language: Language, result: GlobalSearchResult) => {
  if (result._type === "career") {
    return getLocalizedString(language, result.title) || ""
  }

  return result.name || ""
}

const getResultIcon = (result: GlobalSearchResult) => {
  switch (result._type) {
    case "career":
      return {
        src: scaleIcon,
        containerClass: "bg-accentBlue"
      }
    case "professionalOrganization":
      return {
        src: doctorIcon,
        containerClass: "bg-accentPink"
      }
    case "scholarship":
      return {
        src: moneyIcon,
        containerClass: "bg-accentGreen"
      }
    default:
      return {
        src: "",
        containerClass: "bg-surface"
      }
  }
}

/**
 * Dropdown list used by the NavHeader global search.
 * Displays a mixed list of results and supports keyboard-friendly buttons.
 */
export function GlobalSearchDropdown({
  searchQuery,
  results,
  language,
  isLoading = false,
  onResultClick
}: GlobalSearchDropdownProps) {
  return (
    <div className="absolute left-0 right-0 top-full z-[2000] max-h-[320px] overflow-y-auto border border-foreground bg-surface shadow-2xl">
      {isLoading ? (
        <div className="px-5 py-4 text-body-sm text-muted">
          {t(language, "header.searchLoading")}
        </div>
      ) : results.length > 0 ? (
        results.map((result, index) => {
          const iconMeta = getResultIcon(result)
          return (
            <React.Fragment key={`${result._type}-${result._id}`}>
              <button
                type="button"
                onClick={() => onResultClick(result)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-200 ease-out hover:bg-surface1 focus:bg-surface1 focus:outline-none"
              >
                <div
                  className={`flex h-[50px] w-[50px] shrink-0 items-center justify-center ${iconMeta.containerClass}`}
                  aria-hidden="true"
                >
                  {iconMeta.src ? (
                    <img src={iconMeta.src} alt="" className="h-[32px] w-[32px]" />
                  ) : null}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-body-base font-medium text-foreground">
                    {getResultTitle(language, result)}
                  </span>
                  <span className="text-body-sm font-medium uppercase tracking-[0.08em] text-muted">
                    {getResultTypeLabel(language, result)}
                  </span>
                </div>
              </button>
              {index < results.length - 1 ? (
                <div className="px-5">
                  <div className="h-[0.5px] w-full bg-foreground" />
                </div>
              ) : null}
            </React.Fragment>
          )
        })
      ) : (
        <div className="flex items-center gap-[15px] px-5 py-4 text-body-base font-medium text-foreground">
          <div className="flex h-[50px] w-[50px] items-center justify-center bg-[rgb(var(--color-accent-orange)/0.1)]">
            <img src={errorIcon} alt="" className="h-[20px] w-[6px]" aria-hidden="true" />
          </div>
          <span>{t(language, "header.noResults")}</span>
        </div>
      )}
    </div>
  )
}

