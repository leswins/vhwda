import React, { useEffect, useRef, useState } from "react"
import type { QuizVector, CareerForMatching } from "../../../../sanity/queries/careers"
import { CareerCard } from "../../CareerCard"
import { calculateMatchPercentage } from "../../../../utils/vector-aux"
import { getLocalizedString } from "../../../../sanity/queries/careers"
import { t } from "../../../../utils/i18n"
import { pickTypicalSalary } from "../../../../utils/salary"
import { trackEvent } from "../../../../utils/analytics"
const PatternCircle = () => (
  <svg aria-hidden="true" viewBox="0 0 18 18" className="h-full w-full">
    <circle cx="8.5535" cy="8.5535" r="8.5535" fill="currentColor" />
  </svg>
)

const PatternSquare = () => (
  <svg aria-hidden="true" viewBox="0 0 18 18" className="h-full w-full">
    <rect width="17.107" height="17.107" fill="currentColor" />
  </svg>
)

const PatternTriangle = () => (
  <svg aria-hidden="true" viewBox="0 0 20 18" className="h-full w-full">
    <path d="M9.87673 0L19.7535 17.107H0L9.87673 0Z" fill="currentColor" />
  </svg>
)

const PatternStar = () => (
  <svg aria-hidden="true" viewBox="0 0 18 18" className="h-full w-full">
    <path d="M8.5535 0L10.5175 3.81206L14.6017 2.50526L13.2949 6.58953L17.107 8.5535L13.2949 10.5175L14.6017 14.6017L10.5175 13.2949L8.5535 17.107L6.58953 13.2949L2.50526 14.6017L3.81206 10.5175L0 8.5535L3.81206 6.58953L2.50526 2.50526L6.58953 3.81206L8.5535 0Z" fill="currentColor" />
  </svg>
)

const PatternSlice = () => (
  <svg aria-hidden="true" viewBox="0 0 18 18" className="h-full w-full">
    <path d="M0 15.945C0 7.13883 7.13883 0 15.945 0H17.107V17.107H0V15.945Z" fill="currentColor" />
  </svg>
)

const patternIcons = [PatternCircle, PatternSquare, PatternTriangle, PatternStar, PatternSlice]
const accentClasses = ["text-accentOrange", "text-accentYellow", "text-accentGreen", "text-accentBlue", "text-accentPink"]

const PatternBar = ({ iconSize = 50, height = "3rem" }: { iconSize?: number; height?: string | number }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [count, setCount] = useState(0)
  const [gap, setGap] = useState(8)

  useEffect(() => {
    const target = containerRef.current
    if (!target) return

    const minGap = 0
    const maxGap = 0

    const updatePattern = () => {
      const width = target.clientWidth
      if (!width) return
      let c = Math.floor((width + maxGap) / (iconSize + minGap))
      if (c < 1) c = 1
      let g = c > 1 ? (width - c * iconSize) / (c - 1) : 0
      while (c > 1 && g < minGap) {
        c -= 1
        g = (width - c * iconSize) / (c - 1)
      }
      if (c > 1 && g > maxGap) {
        const expandedCount = Math.min(
          c + Math.floor((width - c * (iconSize + maxGap)) / (iconSize + maxGap)),
          Math.floor((width + maxGap) / (iconSize + minGap))
        )
        if (expandedCount > c) {
          c = expandedCount
          g = (width - c * iconSize) / (c - 1)
        }
      }
      const clampedGap = Math.min(maxGap, Math.max(minGap, g || minGap))
      setCount(c)
      setGap(clampedGap)
    }

    updatePattern()
    const observer = new ResizeObserver(updatePattern)
    observer.observe(target)
    return () => observer.disconnect()
  }, [iconSize])

  return (
    <div ref={containerRef} className="flex w-full items-center justify-end" style={{ gap: `${gap}px`, height }}>
      {Array.from({ length: count }).map((_, index) => {
        const Icon = patternIcons[index % patternIcons.length]
        const colorClass = accentClasses[index % accentClasses.length]
        return (
          <span key={`pattern-${index}`} style={{ width: iconSize, height: iconSize }} className={`shrink-0 ${colorClass}`}>
            <Icon />
          </span>
        )
      })}
    </div>
  )
}

type CareerMatch = CareerForMatching & { score: number }

type TopMatchesSectionProps = {
  careers: CareerMatch[]
  userVector: QuizVector
  language: "en" | "es"
}

export function TopMatchesSection({ careers, userVector, language }: TopMatchesSectionProps) {
  return (
    <div>
      <div className="flex items-center p-fluid-50">
        <h1 className="text-h2 font-bold text-foreground whitespace-nowrap">{t(language, "quiz.results.topMatches")}</h1>
        <div className="ml-fluid-50 flex-1 min-w-0">
          <PatternBar />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-surface border-y-[0.5px] border-foreground">
        {careers.map((career) => {
          const matchPercentage = Math.round(calculateMatchPercentage(userVector, career.quizVector || {}))
          const title = getLocalizedString(language, career.title) ?? ""
          const salary = pickTypicalSalary(career.salary)
          
          return (
            <div
              key={career._id}
              className="bg-surface border-r-[0.5px] border-foreground [&:nth-child(3n)]:border-r-0"
            >
              <CareerCard
                language={language}
                title={title}
                salary={salary}
                to={`/careers/${career.slug ?? ""}`}
                imageUrl={career.imageUrl}
                videoUrl={career.videoUrl}
                showMatch={true}
                matchLabel={`${matchPercentage}% MATCH`}
                onClick={() => {
                  trackEvent("quiz_recommendation_click", {
                    source: "quiz_top_matches",
                    career_id: career._id,
                    career_slug: career.slug ?? undefined,
                    career_title: title,
                    match_percent: matchPercentage,
                    language
                  })
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}