import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import type { CareerForCompare } from "../../../../sanity/queries/careers"
import { getLocalizedString } from "../../../../sanity/queries/careers"
import { t } from "../../../../utils/i18n"
import type { Language } from "../../../../utils/i18n"
import { SearchIcon } from "../../../icons/SearchIcon"
import { PlusIcon } from "../../../icons/PlusIcon"

interface CareerSearchInputProps {
  searchQuery: string
  filteredCareers: CareerForCompare[]
  showSearch: boolean
  language: Language
  onSearchChange: (query: string) => void
  onSearchFocus: () => void
  onAddCareer: (id: string) => void
  onClear: () => void
  onEscape: () => void
  placeholder?: string
  showIcon?: boolean
}

export function CareerSearchInput({
  searchQuery,
  filteredCareers,
  showSearch,
  language,
  onSearchChange,
  onSearchFocus,
  onAddCareer,
  onClear,
  onEscape,
  placeholder,
  showIcon = false,
}: CareerSearchInputProps) {
  // Limit to 4 careers
  const displayedCareers = filteredCareers.slice(0, 4)
  const hasResults = displayedCareers.length > 0
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null)

  useEffect(() => {
    if (!showSearch) {
      setDropdownPosition(null)
      return
    }

    const updatePosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDropdownPosition({
          top: rect.bottom - 25,
          left: rect.left,
        })
      }
    }

    updatePosition()

    // Update position on scroll and resize
    window.addEventListener("scroll", updatePosition, true)
    window.addEventListener("resize", updatePosition)

    return () => {
      window.removeEventListener("scroll", updatePosition, true)
      window.removeEventListener("resize", updatePosition)
    }
  }, [showSearch])

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showSearch) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      // Check if click is outside both container and dropdown
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        onEscape()
      }
    }

    // Use capture phase to catch clicks before they bubble
    document.addEventListener("mousedown", handleClickOutside, true)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true)
    }
  }, [showSearch, onEscape])

  const dropdownContent = showSearch && dropdownPosition ? (
    <div
      ref={dropdownRef}
      className="fixed z-[99999] w-[350px] border border-foreground bg-surface shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
      }}
    >
          <div className="flex items-center gap-[15px] border-b border-foreground p-[25px]">
            <SearchIcon className="size-[25px] shrink-0 text-foreground" />
            <input
              type="text"
              placeholder={placeholder || t(language, "compare.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value)
                onSearchFocus()
              }}
              onFocus={onSearchFocus}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  onEscape()
                }
              }}
              className="flex-1 border-0 bg-transparent text-[length:var(--text-body-base)] font-medium leading-[var(--leading-body-base)] tracking-[var(--tracking-body-base)] text-foreground placeholder:text-[rgb(var(--color-muted))] focus:outline-none"
            />
          </div>
          <div className="p-[20px]">
            {hasResults ? (
              <div className="flex flex-col gap-[20px]">
                {displayedCareers.map((career, idx) => {
                  const title = getLocalizedString(language, career.title) || ""
                  const isLast = idx === displayedCareers.length - 1
                  return (
                    <React.Fragment key={career._id}>
                      <button
                        onClick={() => onAddCareer(career._id)}
                        className="flex w-full items-center justify-between text-left transition-opacity hover:opacity-70"
                        type="button"
                      >
                        <span className="text-[length:var(--text-body-base)] font-medium leading-[var(--leading-body-base)] tracking-[var(--tracking-body-base)]">
                          {title}
                        </span>
                        <span className="shrink-0 text-[rgb(var(--color-accent-green))]">
                          <PlusIcon />
                        </span>
                      </button>
                      {!isLast && (
                        <div className="h-[0.5px] w-full bg-foreground" />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            ) : (
              <p className="text-[length:var(--text-body-base)] font-medium leading-[var(--leading-body-base)] tracking-[var(--tracking-body-base)]">
                {t(language, "compare.noResults")}
              </p>
            )}
          </div>
        </div>
      ) : null

  return (
    <>
      <div ref={containerRef} className="relative w-full">
        {!showSearch ? (
          <div className="flex items-center gap-[15px]">
            {showIcon && (
              <SearchIcon className="size-[25px] shrink-0 text-foreground" />
            )}
            <input
              type="text"
              placeholder={placeholder || t(language, "compare.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value)
                onSearchFocus()
              }}
              onFocus={onSearchFocus}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  onEscape()
                }
              }}
              className="flex-1 border-0 bg-transparent text-[length:var(--text-body-base)] font-medium leading-[var(--leading-body-base)] tracking-[var(--tracking-body-base)] text-foreground placeholder:text-[rgb(var(--color-muted))] focus:outline-none"
            />
          </div>
        ) : (
          <div className="flex items-center gap-[15px]">
            <SearchIcon className="size-[25px] shrink-0 text-foreground" />
            <input
              type="text"
              placeholder={placeholder || t(language, "compare.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value)
                onSearchFocus()
              }}
              onFocus={onSearchFocus}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  onEscape()
                }
              }}
              className="flex-1 border-0 bg-transparent text-[length:var(--text-body-base)] font-medium leading-[var(--leading-body-base)] tracking-[var(--tracking-body-base)] text-foreground placeholder:text-[rgb(var(--color-muted))] focus:outline-none"
            />
          </div>
        )}
      </div>
      {dropdownContent && createPortal(dropdownContent, document.body)}
    </>
  )
}

