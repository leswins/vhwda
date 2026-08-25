import React, { useCallback, useEffect, useRef, useState } from "react"
import type { Language } from "../../../utils/i18n"
import { t } from "../../../utils/i18n"
import type { AcademicPathway as AcademicPathwayData } from "../../../sanity/queries/careers"
import { getPathwayLayoutMeta, toPathwayLayout } from "./toPathwayLayout"
import { PathwayNode } from "./PathwayNode"
import { PathwayChoiceGroup } from "./PathwayChoiceGroup"
import { VerticalConnector } from "./PathwayConnectors"

const MIN_ZOOM = 0.8
const MAX_ZOOM = 1.2
const ZOOM_STEP = 0.1

type AcademicPathwayProps = {
  pathway: AcademicPathwayData
  language: Language
}

export function AcademicPathway({ pathway, language }: AcademicPathwayProps) {
  const rows = toPathwayLayout(pathway.items, language)
  const { hasChoice, hasOptionalSteps, showLegend } = getPathwayLayoutMeta(rows)
  const [zoom, setZoom] = useState(1)
  const viewportRef = useRef<HTMLDivElement>(null)
  const isPanningRef = useRef(false)
  const panOriginRef = useRef({ x: 0, y: 0, scrollLeft: 0 })
  const [isPanning, setIsPanning] = useState(false)

  const endPan = useCallback(() => {
    isPanningRef.current = false
    setIsPanning(false)
  }, [])

  useEffect(() => {
    const onPointerUp = () => endPan()
    window.addEventListener("pointerup", onPointerUp)
    window.addEventListener("pointercancel", onPointerUp)
    return () => {
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("pointercancel", onPointerUp)
    }
  }, [endPan])

  if (!rows.length) return null

  const canZoomOut = zoom > MIN_ZOOM + 0.001
  const canZoomIn = zoom < MAX_ZOOM - 0.001

  const adjustZoom = (delta: number) => {
    setZoom((current) => {
      const next = Math.round((current + delta) * 10) / 10
      return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next))
    })
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    const viewport = viewportRef.current
    if (!viewport) return
    // Horizontal pan only — height always hugs content so there is nothing to scroll vertically.
    if (viewport.scrollWidth <= viewport.clientWidth + 1) return
    isPanningRef.current = true
    setIsPanning(true)
    panOriginRef.current = {
      x: event.clientX,
      y: event.clientY,
      scrollLeft: viewport.scrollLeft
    }
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanningRef.current) return
    const viewport = viewportRef.current
    if (!viewport) return
    const { x, scrollLeft } = panOriginRef.current
    viewport.scrollLeft = scrollLeft - (event.clientX - x)
  }

  return (
    <div>
      <div className="mb-fluid-15 flex justify-end" role="group" aria-label={t(language, "career.pathway.zoomControlsA11y")}>
        <button
          type="button"
          onClick={() => adjustZoom(-ZOOM_STEP)}
          disabled={!canZoomOut}
          className="flex h-8 w-8 items-center justify-center border border-foreground bg-surface text-foreground hover:bg-surface1 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={t(language, "career.pathway.zoomOut")}
        >
          <MinusIcon />
        </button>
        <button
          type="button"
          onClick={() => adjustZoom(ZOOM_STEP)}
          disabled={!canZoomIn}
          className="flex h-8 w-8 items-center justify-center border border-l-0 border-foreground bg-surface text-foreground hover:bg-surface1 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={t(language, "career.pathway.zoomIn")}
        >
          <PlusGlyph />
        </button>
      </div>

      {/*
        CSS zoom affects layout size (unlike transform), so height hugs the full diagram
        with no vertical clipping/scroll. Horizontal overflow can still be panned when zoomed in.
      */}
      <div
        ref={viewportRef}
        className={`overflow-x-auto overflow-y-hidden ${isPanning ? "cursor-grabbing select-none" : "cursor-grab"}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerLeave={endPan}
      >
        <div className="mx-auto w-max max-w-none" style={{ zoom }}>
          <ol className="m-0 flex list-none flex-col items-center p-0" role="list">
            {rows.map((row, index) => {
              const previous = index > 0 ? rows[index - 1] : undefined
              const showVerticalConnector = index > 0 && previous?.type === "step"

              return (
                <li
                  key={row.type === "step" ? row.step.key : row.key}
                  className="flex w-full flex-col items-center"
                >
                  {showVerticalConnector ? <VerticalConnector /> : null}
                  {row.type === "step" ? (
                    <PathwayNode step={row.step} />
                  ) : (
                    <PathwayChoiceGroup
                      row={row}
                      language={language}
                      connectToNext={index < rows.length - 1}
                    />
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      {showLegend ? (
        <ul
          className="mt-fluid-40 flex list-none flex-wrap items-center justify-center gap-x-fluid-30 gap-y-fluid-10 p-0"
          role="list"
          aria-label={t(language, "career.pathway.legendA11y")}
        >
          {hasOptionalSteps ? (
            <>
              <LegendItem
                swatchClassName="border-solid border-foreground bg-accentBlue/25"
                label={t(language, "career.pathway.legendRequired")}
              />
              <LegendItem
                swatchClassName="border-dashed border-foreground/70 bg-surface2"
                label={t(language, "career.pathway.legendOptional")}
              />
            </>
          ) : null}
          {hasChoice ? (
            <LegendItem
              swatchClassName="border-solid border-foreground bg-accentGreen/25"
              label={t(language, "career.pathway.legendChooseOne")}
            />
          ) : null}
        </ul>
      ) : null}
    </div>
  )
}

function LegendItem({ swatchClassName, label }: { swatchClassName: string; label: string }) {
  return (
    <li className="flex items-center gap-fluid-10 text-body-sm text-muted">
      <span className={`h-fluid-15 w-fluid-20 shrink-0 rounded-none border ${swatchClassName}`} aria-hidden="true" />
      <span>{label}</span>
    </li>
  )
}

function MinusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1 6H11" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function PlusGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
