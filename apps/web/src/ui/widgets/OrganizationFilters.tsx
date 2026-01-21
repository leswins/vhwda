import React, { useState, useEffect } from "react"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"
import type { OrganizationFilters as OrganizationFiltersType } from "./filters/organizationFilters"
import { organizationFilters } from "./filters/organizationFilters"
import { fetchCareerCategories } from "../../sanity/queries/careerCategories"
import type { CareerCategory } from "../../sanity/queries/careerCategories"

type Props = {
  language: Language
  filters: OrganizationFiltersType
  onFiltersChange: (filters: OrganizationFiltersType) => void
}

export function OrganizationFilters({ language, filters, onFiltersChange }: Props) {
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery)
  const [isGeographicFocusExpanded, setIsGeographicFocusExpanded] = useState(false)
  const [isCareerAreasExpanded, setIsCareerAreasExpanded] = useState(false)
  const [careerCategories, setCareerCategories] = useState<CareerCategory[]>([])

  useEffect(() => {
    async function loadCareerCategories() {
      try {
        const categories = await fetchCareerCategories()
        setCareerCategories(categories)
      } catch (error) {
        console.error("Failed to load career categories:", error)
      }
    }
    loadCareerCategories()
  }, [])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onFiltersChange({ ...filters, searchQuery: value })
  }

  const handleMembershipTypeToggle = (value: string) => {
    const newMembershipTypes = filters.selectedMembershipTypes.includes(value)
      ? filters.selectedMembershipTypes.filter((t) => t !== value)
      : [...filters.selectedMembershipTypes, value]
    onFiltersChange({ ...filters, selectedMembershipTypes: newMembershipTypes })
  }

  const handleGeographicFocusToggle = (value: string) => {
    const newGeographicFocus = filters.selectedGeographicFocus.includes(value)
      ? filters.selectedGeographicFocus.filter((f) => f !== value)
      : [...filters.selectedGeographicFocus, value]
    onFiltersChange({ ...filters, selectedGeographicFocus: newGeographicFocus })
  }

  const handleCareerAreaToggle = (areaId: string) => {
    const newCareerAreas = filters.selectedCareerAreas.includes(areaId)
      ? filters.selectedCareerAreas.filter((a) => a !== areaId)
      : [...filters.selectedCareerAreas, areaId]
    onFiltersChange({ ...filters, selectedCareerAreas: newCareerAreas })
  }

  const membershipTypeGroup = organizationFilters.find((g) => g.id === "membershipType")
  const geographicFocusGroup = organizationFilters.find((g) => g.id === "geographicFocus")

  return (
    <aside className="w-full lg:w-64 space-y-6">
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            placeholder={t(language, "filters.search")}
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

      <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[15px]">
          <span className="text-h5 font-bold text-foreground">
            {membershipTypeGroup ? t(language, membershipTypeGroup.titleKey) : "Membership Type"}
          </span>
          <div className="flex flex-col gap-[15px]">
            {membershipTypeGroup?.options.map((option) => (
              <label key={option.value} className="flex items-center gap-[15px] cursor-pointer">
                <div className="relative h-5 w-5 shrink-0">
                  <input
                    type="checkbox"
                    checked={filters.selectedMembershipTypes.includes(option.value)}
                    onChange={() => handleMembershipTypeToggle(option.value)}
                    className="peer h-5 w-5 appearance-none border-[0.5px] border-foreground bg-surface1 checked:bg-surface1"
                  />
                  {filters.selectedMembershipTypes.includes(option.value) && (
                    <svg
                      className="pointer-events-none absolute inset-0 h-5 w-5 text-foreground"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 10L8 14L16 6" />
                    </svg>
                  )}
                </div>
                <span className="text-body-base font-medium text-foreground">
                  {t(language, option.labelKey)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="h-[0.5px] w-full bg-foreground shrink-0" />

        <div className="flex flex-col gap-[15px]">
          <button
            onClick={() => setIsGeographicFocusExpanded(!isGeographicFocusExpanded)}
            className="flex w-full items-center justify-between gap-[10px]"
          >
            <span className="text-h5 font-bold text-foreground">
              {geographicFocusGroup ? t(language, geographicFocusGroup.titleKey) : "Geographic Focus"}
            </span>
            {isGeographicFocusExpanded ? (
              <svg width="15" height="2" viewBox="0 0 15 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 1H7.5H15" stroke="#09090B" strokeWidth="2" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 0V7.5M7.5 7.5V15M7.5 7.5H0M7.5 7.5H15" stroke="#09090B" strokeWidth="2" />
              </svg>
            )}
          </button>
          {isGeographicFocusExpanded && (
            <div className="flex flex-col gap-[15px]">
              {geographicFocusGroup?.options.map((option) => (
                <label key={option.value} className="flex items-center gap-[15px] cursor-pointer">
                  <div className="relative h-5 w-5 shrink-0">
                    <input
                      type="checkbox"
                      checked={filters.selectedGeographicFocus.includes(option.value)}
                      onChange={() => handleGeographicFocusToggle(option.value)}
                      className="peer h-5 w-5 appearance-none border-[0.5px] border-foreground bg-surface1 checked:bg-surface1"
                    />
                    {filters.selectedGeographicFocus.includes(option.value) && (
                      <svg
                        className="pointer-events-none absolute inset-0 h-5 w-5 text-foreground"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 10L8 14L16 6" />
                      </svg>
                    )}
                  </div>
                  <span className="text-body-base font-medium text-foreground">
                    {t(language, option.labelKey)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="h-[0.5px] w-full bg-foreground shrink-0" />

        <div className="flex flex-col gap-[15px]">
          <button
            onClick={() => setIsCareerAreasExpanded(!isCareerAreasExpanded)}
            className="flex w-full items-center justify-between gap-[10px]"
          >
            <span className="text-h5 font-bold text-foreground">{t(language, "filters.careerArea")}</span>
            {isCareerAreasExpanded ? (
              <svg width="15" height="2" viewBox="0 0 15 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 1H7.5H15" stroke="#09090B" strokeWidth="2" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 0V7.5M7.5 7.5V15M7.5 7.5H0M7.5 7.5H15" stroke="#09090B" strokeWidth="2" />
              </svg>
            )}
          </button>
          {isCareerAreasExpanded && (
            <div className="flex flex-col gap-[15px]">
              {careerCategories.map((category) => (
                <label key={category._id} className="flex items-center gap-[15px] cursor-pointer">
                  <div className="relative h-5 w-5 shrink-0">
                    <input
                      type="checkbox"
                      checked={filters.selectedCareerAreas.includes(category._id)}
                      onChange={() => handleCareerAreaToggle(category._id)}
                      className="peer h-5 w-5 appearance-none border-[0.5px] border-foreground bg-surface1 checked:bg-surface1"
                    />
                    {filters.selectedCareerAreas.includes(category._id) && (
                      <svg
                        className="pointer-events-none absolute inset-0 h-5 w-5 text-foreground"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 10L8 14L16 6" />
                      </svg>
                    )}
                  </div>
                  <span className="text-body-base font-medium text-foreground">{category.title}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
