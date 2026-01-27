import React, { useEffect, useMemo, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import type { EducationalInstitution } from "../../sanity/queries/careers"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"

type Props = {
  language: Language
  institutions: EducationalInstitution[]
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

const REGION_ORDER = [
  "Northern VA",
  "Blue Ridge",
  "Rappahannock",
  "Central",
  "Southside",
  "Eastern VA",
  "South Central",
  "Southwest"
]

function getRegionLabel(region?: string): string {
  if (!region || !region.trim()) return "Other"
  return region
}

type RegionGroup = {
  region: string
  institutions: EducationalInstitution[]
}

function groupInstitutionsByRegion(institutions: EducationalInstitution[]): RegionGroup[] {
  const grouped = new Map<string, EducationalInstitution[]>()
  institutions.forEach((institution) => {
    const region = getRegionLabel(institution.region)
    const list = grouped.get(region)
    if (list) {
      list.push(institution)
    } else {
      grouped.set(region, [institution])
    }
  })

  const ordered: RegionGroup[] = []
  REGION_ORDER.forEach((region) => {
    const entries = grouped.get(region)
    if (entries && entries.length) {
      ordered.push({
        region,
        institutions: entries.slice().sort((a, b) => (a.name || "").localeCompare(b.name || ""))
      })
      grouped.delete(region)
    }
  })

  grouped.forEach((entries, region) => {
    ordered.push({
      region,
      institutions: entries.slice().sort((a, b) => (a.name || "").localeCompare(b.name || ""))
    })
  })

  return ordered
}

type RegionListProps = {
  groups: RegionGroup[]
  activeId: string | null
  onSelect: (institution: EducationalInstitution) => void
}

function RegionList({ groups, activeId, onSelect }: RegionListProps) {
  const [expandedRegions, setExpandedRegions] = useState<string[]>([])

  const toggleRegion = (region: string) => {
    setExpandedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    )
  }

  return (
    <div className="flex h-full flex-col">
      <ul>
        {groups.map((group, index) => {
          const isExpanded = expandedRegions.includes(group.region)
          const isLast = index === groups.length - 1
          return (
            <li
              key={group.region}
              className={cx(
                "border-b-[0.5px] border-foreground",
                isLast && !isExpanded && "border-b-0"
              )}
            >
              <button
                type="button"
                onClick={() => toggleRegion(group.region)}
                className="flex w-full items-center justify-between py-[25px] text-left text-h4 font-semibold text-foreground"
              >
                <span>{group.region}</span>
                <span aria-hidden="true">
                  {isExpanded ? (
                    <svg width="15" height="2" viewBox="0 0 15 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 1H7.5H15" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.5 0V7.5M7.5 7.5V15M7.5 7.5H0M7.5 7.5H15" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  )}
                </span>
              </button>
              {isExpanded && (
                <ul className="border-t-[0.5px] border-foreground">
                  {group.institutions.map((institution, institutionIndex) => {
                    const isActive = institution._id === activeId
                    const isLastInstitution = institutionIndex === group.institutions.length - 1
                    return (
                      <li
                        key={institution._id}
                        className={cx(
                          "border-b-[0.5px] border-foreground last:border-b-0 pl-[25px] ml-[25px]",
                          isLast && isLastInstitution && "border-b-0"
                        )}
                      >
                        <button
                          type="button"
                          className={cx(
                            "flex w-full items-center justify-between py-[25px] text-left text-body-lg",
                            isActive && "font-semibold"
                          )}
                          onClick={() => onSelect(institution)}
                        >
                          <span>{institution.name}</span>
                          <span aria-hidden="true">
                            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M-4.92305e-07 11.2626L-3.81923e-07 8.73737L15.1515 8.73737L8.20707 1.79293L10 -4.37114e-07L20 10L10 20L8.20707 18.2071L15.1515 11.2626L-4.92305e-07 11.2626Z" fill="currentColor" />
                            </svg>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function getInstitutionLngLat(institution: EducationalInstitution): [number, number] | null {
  const loc = institution.location
  if (!loc) return null
  if (typeof loc.lng !== "number" || typeof loc.lat !== "number") return null
  return [loc.lng, loc.lat]
}

function computeInitialView(institutions: EducationalInstitution[]): { center: [number, number]; zoom: number } {
  const coords = institutions.map(getInstitutionLngLat).filter((c): c is [number, number] => Boolean(c))
  if (!coords.length) return { center: [-78.6569, 37.4316], zoom: 5.5 } // Virginia-ish fallback
  if (coords.length === 1) return { center: coords[0], zoom: 9.5 }

  // naive bbox center
  const lngs = coords.map((c) => c[0])
  const lats = coords.map((c) => c[1])
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  return { center: [(minLng + maxLng) / 2, (minLat + maxLat) / 2], zoom: 6.8 }
}

export function EducationalInstitutionsMap({ language, institutions }: Props) {
  const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<Array<{ id: string; marker: mapboxgl.Marker }>>([])

  const [activeId, setActiveId] = useState<string | null>(institutions[0]?._id ?? null)

  const sorted = useMemo(
    () => institutions.slice().filter((i) => i.name?.trim().length > 0 && getInstitutionLngLat(i) !== null),
    [institutions]
  )
  const groupedRegions = useMemo(() => groupInstitutionsByRegion(sorted), [sorted])

  useEffect(() => {
    if (!token) return
    if (!mapContainerRef.current) return

    mapboxgl.accessToken = token

    const { center, zoom } = computeInitialView(sorted)
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center,
      zoom
    })
    mapRef.current = map

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right")

    return () => {
      markersRef.current.forEach((m) => m.marker.remove())
      markersRef.current = []
      map.remove()
      mapRef.current = null
    }
  }, [token, sorted])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // clear previous markers
    markersRef.current.forEach((m) => m.marker.remove())
    markersRef.current = []

    sorted.forEach((institution) => {
      const lngLat = getInstitutionLngLat(institution)
      if (!lngLat) return

      const el = document.createElement("button")
      el.type = "button"
      el.className = cx(
        "education-map-marker",
        "relative h-0 w-0",
        "transition-transform",
        activeId === institution._id && "education-map-marker--active"
      )
      el.setAttribute("aria-label", institution.name)
      el.addEventListener("click", () => {
        setActiveId(institution._id)
        if (institution.website) {
          window.open(institution.website, "_blank", "noopener,noreferrer")
        }
      })

      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" }).setLngLat(lngLat).addTo(map)
      markersRef.current.push({ id: institution._id, marker })
    })
  }, [sorted, activeId])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (!activeId) return

    const institution = sorted.find((i) => i._id === activeId)
    if (!institution) return
    const lngLat = getInstitutionLngLat(institution)
    if (!lngLat) return

    map.easeTo({ center: lngLat, zoom: Math.max(map.getZoom(), 9), duration: 700 })
  }, [activeId, sorted])

  if (!sorted.length) {
    return (
      <div className="min-h-[750px] border border-foreground bg-surface1 p-4 text-sm text-foreground/70">
        No institutions with location data found.
      </div>
    )
  }

  if (!token) {
    return (
      <div className="grid h-[750px] lg:grid-cols-[480px_1fr]">
        <div className="h-full overflow-auto scrollbar-hide px-[25px] pb-[25px] pt-0 border-r-[0.5px] border-foreground">
          <RegionList
            groups={groupedRegions}
            activeId={activeId}
            onSelect={(institution) => {
              setActiveId(institution._id)
              if (institution.website) {
                window.open(institution.website, "_blank", "noopener,noreferrer")
              }
            }}
          />
        </div>
        <div className="h-full bg-surface1 p-4 text-sm text-foreground/70">
          {t(language, "career.map.noToken")}
        </div>
      </div>
    )
  }

  return (
    <div className="grid h-[750px] lg:grid-cols-[480px_1fr]">
      <div className="h-full overflow-auto scrollbar-hide px-[25px] pb-[25px] pt-0 border-r-[0.5px] border-foreground">
        <RegionList
          groups={groupedRegions}
          activeId={activeId}
          onSelect={(institution) => {
            setActiveId(institution._id)
            if (institution.website) {
              window.open(institution.website, "_blank", "noopener,noreferrer")
            }
          }}
        />
      </div>

      <div className="h-full bg-surface1">
        <div ref={mapContainerRef} className="h-full w-full" />
      </div>

      <style>{`
        .education-map-marker {
          border: none;
          background: transparent;
          padding: 0;
          cursor: pointer;
          transform: translateY(0);
        }
        /* Triangle marker using borders */
        .education-map-marker::before {
          content: "";
          display: block;
          width: 0;
          height: 0;
          border-left: 14px solid transparent;
          border-right: 14px solid transparent;
          border-top: 20px solid rgb(var(--color-accent-blue));
          filter: drop-shadow(0 1px 0 rgba(0,0,0,0.25));
        }
        .education-map-marker--active {
          transform: translateY(-4px) scale(1.05);
        }
      `}</style>
    </div>
  )
}

