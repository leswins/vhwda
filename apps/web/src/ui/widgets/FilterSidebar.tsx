import React, { useState } from "react"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"
import type { FilterGroup } from "./filters/scholarshipFilters"

type Props = {
  language: Language
  filterGroups: FilterGroup[]
  searchPlaceholderKey: string
}

export function FilterSidebar({ language, filterGroups, searchPlaceholderKey }: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set([filterGroups[0]?.id]))

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
      }
      return next
    })
  }

  return (
    <aside className="w-full lg:w-64 space-y-6">
      <div className="space-y-2">
        <div className="flex gap-4 text-sm">
          <button className="font-semibold text-foreground">Filter</button>
          <button className="text-muted">Sort</button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder={t(language, searchPlaceholderKey)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        {filterGroups.map((group) => {
          const isExpanded = expandedGroups.has(group.id)
          return (
            <div key={group.id} className="border-b border-border pb-4 last:border-0">
              <button
                onClick={() => toggleGroup(group.id)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="font-medium text-foreground">{t(language, group.titleKey)}</span>
                <svg
                  className={`h-4 w-4 text-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isExpanded && (
                <div className="mt-3 space-y-2">
                  {group.options.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        value={option.value}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-foreground/20"
                      />
                      <span className="text-foreground">{t(language, option.labelKey)}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

