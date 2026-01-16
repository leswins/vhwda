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
      <div className="min-h-[520px] border border-foreground bg-surface1 p-4 text-sm text-foreground/70">
        No institutions with location data found.
      </div>
    )
  }

  if (!token) {
    return (
      <div className="grid gap-8 lg:grid-cols-[480px_1fr]">
        <div className="max-h-[520px] overflow-auto border-t border-foreground pr-2 pt-6">
          <ul className="divide-y divide-foreground/20">
            {sorted.map((institution) => {
              return (
                <li key={institution._id} className="flex items-center justify-between py-4">
                  {institution.website ? (
                    <a
                      className="text-xl hover:underline"
                      href={institution.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {institution.name}
                    </a>
                  ) : (
                    <span className="text-xl">{institution.name}</span>
                  )}
                  <span aria-hidden="true">→</span>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="min-h-[520px] border border-foreground bg-surface1 p-4 text-sm text-foreground/70">
          {t(language, "career.map.noToken")}
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[480px_1fr]">
      <div className="max-h-[520px] overflow-auto border-t border-foreground pr-2 pt-6">
        <ul className="divide-y divide-foreground/20">
          {sorted.map((institution) => {
            const isActive = institution._id === activeId
            if (institution.website) {
              return (
                <li key={institution._id} className="py-4">
                  <a
                    href={institution.website}
                    target="_blank"
                    rel="noreferrer"
                    className={cx(
                      "flex w-full items-center justify-between text-left text-xl hover:underline",
                      isActive && "font-bold"
                    )}
                    onClick={() => setActiveId(institution._id)}
                  >
                    {institution.name}
                    <span aria-hidden="true">→</span>
                  </a>
                </li>
              )
            }
            return (
              <li key={institution._id} className="py-4">
                <button
                  type="button"
                  className={cx("flex w-full items-center justify-between text-left text-xl", isActive && "font-bold")}
                  onClick={() => setActiveId(institution._id)}
                >
                  <span>{institution.name}</span>
                  <span aria-hidden="true">→</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="min-h-[520px] border border-foreground bg-surface1">
        <div ref={mapContainerRef} className="h-[520px] w-full" />
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

