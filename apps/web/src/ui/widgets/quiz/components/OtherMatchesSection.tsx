import React from "react"
import { Link } from "react-router-dom"
import type { QuizVector, CareerForMatching } from "../../../../sanity/queries/careers"
import { OtherMatchesList } from "./OtherMatchesList"
import { t } from "../../../../utils/i18n"

type CareerMatch = CareerForMatching & { score: number }

type OtherMatchesSectionProps = {
  careers: CareerMatch[]
  userVector: QuizVector
  language: "en" | "es"
}

export function OtherMatchesSection({ careers, userVector, language }: OtherMatchesSectionProps) {
  return (
    <div className="w-full p-fluid-50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-fluid-50">
        <h2 className="text-h3 font-bold text-foreground">{t(language, "quiz.results.otherMatches")}</h2>
        <Link
          to="/careers"
          className="inline-flex md:inline-flex items-center bg-surface2 px-6 py-3 text-body-base text-foreground transition-colors hover:bg-surface1 w-full md:w-auto justify-center md:justify-start text-center md:text-left"
        >
          {t(language, "quiz.results.searchPlaceholder")}
        </Link>
      </div>
      <OtherMatchesList
        careers={careers}
        userVector={userVector}
        language={language}
        maxResults={20}
      />
    </div>
  )
}