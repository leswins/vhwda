import React, { useEffect, useState } from "react"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"
import type { HubFacetFilters, HubFacetGroup } from "../../lib/hubResourceFacets"
import { fetchCareerCategories } from "../../sanity/queries/careerCategories"
import type { CareerCategory } from "../../sanity/queries/careerCategories"

type Props = {
  language: Language
  groups: HubFacetGroup[]
  filters: HubFacetFilters
  onFiltersChange: (filters: HubFacetFilters) => void
  showCareerAreas?: boolean
}

function FilterCheckbox({
  checked,
  label,
  onChange
}: {
  checked: boolean
  label: string
  onChange: () => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-[10px] lg:gap-[15px]">
      <div className="relative h-5 w-5 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer h-5 w-5 appearance-none border-[0.5px] border-foreground bg-surface1 checked:bg-surface1"
        />
        {checked ? (
          <svg
            className="pointer-events-none absolute inset-0 h-5 w-5 text-foreground"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 10L8 14L16 6" />
          </svg>
        ) : null}
      </div>
      <span className="text-body-xs font-medium text-foreground lg:text-body-base">{label}</span>
    </label>
  )
}

function Accordion({
  title,
  children,
  last
}: {
  title: string
  children: React.ReactNode
  last?: boolean
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className={last ? "py-[15px]" : "border-b-[0.5px] border-foreground py-[15px]"}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-fluid-10 py-fluid-6 lg:py-2"
      >
        <span className="text-body-base font-bold text-foreground lg:text-h5">{title}</span>
        {open ? (
          <svg className="h-[2px] w-[15px] text-foreground" viewBox="0 0 15 2" fill="none">
            <path d="M0 1H15" stroke="currentColor" strokeWidth="2" />
          </svg>
        ) : (
          <svg className="h-[15px] w-[15px] text-foreground" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 0V15M0 7.5H15" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
      </button>
      {open ? <div className="mt-[15px] flex flex-col gap-[10px] lg:mt-0 lg:gap-[15px]">{children}</div> : null}
    </div>
  )
}

export function HubFacetFilters({ language, groups, filters, onFiltersChange, showCareerAreas = true }: Props) {
  const [careerCategories, setCareerCategories] = useState<CareerCategory[]>([])

  useEffect(() => {
    if (!showCareerAreas) return
    void fetchCareerCategories()
      .then(setCareerCategories)
      .catch(() => setCareerCategories([]))
  }, [showCareerAreas])

  function toggle(groupId: string, value: string) {
    const current = filters.selected[groupId as keyof typeof filters.selected] ?? []
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    onFiltersChange({
      ...filters,
      selected: { ...filters.selected, [groupId]: next }
    })
  }

  return (
    <div className="flex flex-col">
      {groups.map((group, index) => (
        <Accordion
          key={group.id}
          title={t(language, group.titleKey)}
          last={!showCareerAreas && index === groups.length - 1}
        >
          {group.options.map((option) => (
            <FilterCheckbox
              key={option.value}
              checked={(filters.selected[group.id] ?? []).includes(option.value)}
              label={t(language, option.labelKey)}
              onChange={() => toggle(group.id, option.value)}
            />
          ))}
        </Accordion>
      ))}
      {showCareerAreas ? (
        <Accordion title={t(language, "filters.careerArea")} last>
          {careerCategories.map((category) => (
            <FilterCheckbox
              key={category._id}
              checked={(filters.selected.careerAreas ?? []).includes(category._id)}
              label={category.title}
              onChange={() => toggle("careerAreas", category._id)}
            />
          ))}
        </Accordion>
      ) : null}
    </div>
  )
}

export function HubSortOptions({
  language,
  filters,
  onFiltersChange,
  showDeadline = true
}: {
  language: Language
  filters: HubFacetFilters
  onFiltersChange: (filters: HubFacetFilters) => void
  showDeadline?: boolean
}) {
  const options = [
    { value: "title" as const, key: "filters.sort.title" as const },
    ...(showDeadline ? [{ value: "deadline" as const, key: "filters.sort.deadline" as const }] : []),
    { value: "newest" as const, key: "filters.sort.newest" as const }
  ]

  return (
    <div className="flex flex-col gap-[15px]">
      {options.map((option) => (
        <label key={option.value} className="flex cursor-pointer items-center gap-[10px] lg:gap-[15px]">
          <input
            type="radio"
            name="hub-resource-sort"
            checked={filters.sort === option.value}
            onChange={() => onFiltersChange({ ...filters, sort: option.value })}
            className="h-4 w-4 accent-foreground"
          />
          <span className="text-body-xs font-medium text-foreground lg:text-body-base">{t(language, option.key)}</span>
        </label>
      ))}
    </div>
  )
}
