import React from "react"
import type { Language } from "../../../utils/i18n"
import type { CareerSummary } from "../../../services/careerContext"
import { ChatCareerCard } from "./ChatCareerCard"

type Props = {
  language: Language
  careers: CareerSummary[]
}

export function ChatCareerCards({ language, careers }: Props) {
  if (careers.length === 0) return null

  return (
    <div className="mt-4 mr-auto max-w-[492px] flex flex-col gap-2">
      {careers.map((career, index) => (
        <ChatCareerCard key={career._id} language={language} career={career} isSelected={index === 1} />
      ))}
    </div>
  )
}

