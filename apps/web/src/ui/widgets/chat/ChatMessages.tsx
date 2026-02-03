import React from "react"
import type { Language } from "../../../utils/i18n"
import { t } from "../../../utils/i18n"
import type { CareerSummary } from "../../../services/careerContext"
import { ChatMessage } from "./ChatMessage"
import { ChatCareerCards } from "./ChatCareerCards"

type Message = {
  type: "user" | "bot" | "system"
  message: string
  careers?: CareerSummary[]
}

type Props = {
  language: Language
  messages: Message[]
  isLoading: boolean
}

export function ChatMessages({ language, messages, isLoading }: Props) {
  if (messages.length === 0) return null

  return (
    <div className="space-y-fluid-10 px-5 py-5 lg:px-[30px] lg:py-[30px]">
      {messages.map((msg, index) => (
        <div key={index}>
          {msg.message && msg.message.trim() && (
            <ChatMessage type={msg.type} message={msg.message} />
          )}
          {msg.type === "bot" && msg.careers && msg.careers.length > 0 && (
            <ChatCareerCards language={language} careers={msg.careers} />
          )}
        </div>
      ))}
      {isLoading && (
        <div className="mr-auto w-fit max-w-[70%] lg:max-w-[50%] rounded-md bg-surface-2 p-4">
          <p className="text-muted">{t(language, "chat.generating")}</p>
        </div>
      )}
    </div>
  )
}

