import React, { useState } from "react"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"

type Props = {
  language: Language
  searchPlaceholderKey: string
  onSearchChange: (query: string) => void
}

export function FilterSidebar({ language, searchPlaceholderKey, onSearchChange }: Props) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearchChange(value)
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
    </aside>
  )
}

