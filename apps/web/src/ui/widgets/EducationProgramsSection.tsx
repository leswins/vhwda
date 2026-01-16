import React, { useEffect, useMemo, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import type { CareerEducationInstitutionItem } from "../../sanity/queries/careers"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"

type Props = {
  language: Language
  items: CareerEducationInstitutionItem[]
  title: string
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

function getItemName(item: CareerEducationInstitutionItem): string {
  return item.label || item.institution?.name || ""
}

function getItemHref(item: CareerEducationInstitutionItem): string | undefined {
  return item.programUrl || item.institution?.website
}

function getItemLngLat(item: CareerEducationInstitutionItem): [number, number] | null {
  const loc = item.institution?.location
  if (!loc) return null
  if (typeof loc.lng !== "number" || typeof loc.lat !== "number") return null
  return [loc.lng, loc.lat]
}

function computeInitialView(items: CareerEducationInstitutionItem[]): { center: [number, number]; zoom: number } {
  const coords = items.map(getItemLngLat).filter((c): c is [number, number] => Boolean(c))
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

export function EducationProgramsSection({ language, items, title }: Props) {
  const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<Array<{ id: string; marker: mapboxgl.Marker }>>([])

  const [activeKey, setActiveKey] = useState<string | null>(items[0]?._key ?? null)

  const sorted = useMemo(() => items.slice().filter((i) => getItemName(i).trim().length > 0), [items])

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

    sorted.forEach((item) => {
      const lngLat = getItemLngLat(item)
      if (!lngLat) return

      const el = document.createElement("button")
      el.type = "button"
      el.className = cx(
        "education-map-marker",
        "relative h-0 w-0",
        "transition-transform",
        activeKey === item._key && "education-map-marker--active"
      )
      el.setAttribute("aria-label", getItemName(item))
      el.addEventListener("click", () => {
        setActiveKey(item._key)
      })

      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" }).setLngLat(lngLat).addTo(map)
      markersRef.current.push({ id: item._key, marker })
    })
  }, [sorted, activeKey])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (!activeKey) return

    const item = sorted.find((i) => i._key === activeKey)
    if (!item) return
    const lngLat = getItemLngLat(item)
    if (!lngLat) return

    map.easeTo({ center: lngLat, zoom: Math.max(map.getZoom(), 9), duration: 700 })
  }, [activeKey, sorted])

  if (!sorted.length) return null

  if (!token) {
    return (
      <div className="grid h-[650px] max-h-[650px] overflow-hidden lg:grid-cols-[40%_60%]">
        <div className="flex h-full min-h-0 flex-col pt-[50px] px-[50px]">
          <h2 className="pb-[50px] text-4xl font-bold border-b border-foreground shrink-0">{title}</h2>
          <div className="min-h-0 flex-1 overflow-auto pr-2">
            <ul className="divide-y divide-foreground pb-[50px]">
              {sorted.map((item) => {
                const name = getItemName(item)
                const href = getItemHref(item)
                return (
                  <li key={item._key} className="flex items-center justify-between py-[25px]">
                    {href ? (
                      <a className="text-xl hover:underline" href={href} target="_blank" rel="noreferrer">
                        {name}
                      </a>
                    ) : (
                      <span className="text-xl">{name}</span>
                    )}
                    <span aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M-4.92305e-07 11.2626L-3.81923e-07 8.73737L15.1515 8.73737L8.20707 1.79293L10 -4.37114e-07L20 10L10 20L8.20707 18.2071L15.1515 11.2626L-4.92305e-07 11.2626Z" fill="currentColor" />
                      </svg>
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        <div className="h-[650px] border-l border-foreground bg-surface1 p-4 text-sm text-foreground/70">
          {t(language, "career.map.noToken")}
        </div>
      </div>
    )
  }

  return (
    <div className="grid h-[650px] max-h-[650px] overflow-hidden lg:grid-cols-[40%_60%]">
      <div className="flex h-full min-h-0 flex-col pt-[50px] px-[50px]">
        <h2 className="pb-[50px] text-4xl font-bold border-b border-foreground shrink-0">{title}</h2>
        <div className="min-h-0 flex-1 overflow-auto pr-2">
          <ul className="divide-y divide-foreground pb-[50px]">
            {sorted.map((item) => {
              const name = getItemName(item)
              const href = getItemHref(item)
              const isActive = item._key === activeKey
              return (
                <li key={item._key} className="py-[25px]">
                  <button
                    type="button"
                    className={cx("flex w-full items-center justify-between text-left", isActive && "font-bold")}
                    onClick={() => setActiveKey(item._key)}
                  >
                    {href ? (
                      <a
                        className="text-xl hover:underline"
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {name}
                      </a>
                    ) : (
                      <span className="text-xl">{name}</span>
                    )}
                    <span aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M-4.92305e-07 11.2626L-3.81923e-07 8.73737L15.1515 8.73737L8.20707 1.79293L10 -4.37114e-07L20 10L10 20L8.20707 18.2071L15.1515 11.2626L-4.92305e-07 11.2626Z" fill="currentColor" />
                      </svg>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="h-[650px] border-l border-foreground bg-surface1">
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

