import React, { useState } from "react"
import type { QuizVector, CareerForMatching } from "../../../../sanity/queries/careers"
import { CareerMatchList } from "./CareerMatchList"
import { getLocalizedString } from "../../../../sanity/queries/careers"
import { t } from "../../../../utils/i18n"

type CareerMatch = CareerForMatching & { score: number }

type OtherMatchesSectionProps = {
  careers: CareerMatch[]
  userVector: QuizVector
  language: "en" | "es"
}

export function OtherMatchesSection({ careers, userVector, language }: OtherMatchesSectionProps) {
  const [searchQuery, setSearchQuery] = useState("")
  
  const filteredCareers = searchQuery
    ? careers.filter((career) => {
        const title = getLocalizedString(language, career.title)?.toLowerCase() ?? ""
        return title.includes(searchQuery.toLowerCase())
      })
    : careers

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h2 className="text-h2 font-bold text-foreground">{t(language, "quiz.results.otherMatches")}</h2>
        <div className="w-full md:w-auto md:min-w-[300px]">
          <input
            type="text"
            placeholder={t(language, "quiz.results.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border-[0.5px] border-foreground bg-surface text-foreground placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-foreground"
          />
        </div>
      </div>
      <CareerMatchList
        careers={filteredCareers}
        userVector={userVector}
        language={language}
        maxResults={20}
      />
    </div>
  )
}