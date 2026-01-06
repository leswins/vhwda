import React, { useState, useEffect } from "react"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { generateContent, type ChatMessage } from "../services/Model"
import { getCareersContext, createChatSystemPrompt, getCareersBySlugs, fetchCareersForChat, type CareerSummary } from "../services/careerContext"
import { parseAIResponse } from "../services/parseAIResponse"
import { ChatHeader } from "../ui/widgets/chat/ChatHeader"
import { ChatEmptyState } from "../ui/widgets/chat/ChatEmptyState"
import { QuickPrompts } from "../ui/widgets/chat/QuickPrompts"
import { ChatMessages } from "../ui/widgets/chat/ChatMessages"
import { ChatInput } from "../ui/widgets/chat/ChatInput"
import { t } from "../utils/i18n"

type Message = {
  type: "user" | "bot" | "system"
  message: string
  careers?: CareerSummary[]
}

export function ChatPage() {
  const { language } = useLanguageStore()
  const [userInput, setUserInput] = useState("")
  const [response, setResponse] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [systemContext, setSystemContext] = useState<string | undefined>(undefined)
  const [loadingCareers, setLoadingCareers] = useState(true)
  const [careersCache, setCareersCache] = useState<CareerSummary[]>([])

  useEffect(() => {
    async function loadCareersContext() {
      try {
        setLoadingCareers(true)
        const careers = await fetchCareersForChat()
        setCareersCache(careers)
        const careersContext = await getCareersContext(language, careers)
        const context = createChatSystemPrompt(careersContext, language)
        setSystemContext(context)
      } catch (error) {
        setSystemContext(undefined)
        setCareersCache([])
      } finally {
        setLoadingCareers(false)
      }
    }

    loadCareersContext()
  }, [language])

  const handleSubmit = async (promptToSend: string = userInput) => {
    if (!promptToSend.trim()) {
      setResponse([{ type: "system", message: t(language, "chat.pleaseEnterPrompt") }])
      return
    }

    if (loadingCareers) {
      setResponse([{ type: "system", message: t(language, "chat.loadingCareers") }])
      return
    }

    if (isLoading) {
      return
    }

    setIsLoading(true)
    try {
      const conversationHistory: ChatMessage[] = response
        .filter((msg) => msg.type === "user" || msg.type === "bot")
        .map((msg) => ({
          role: msg.type === "user" ? "user" : "model",
          parts: msg.message,
        }))

      const res = await generateContent(promptToSend, conversationHistory, systemContext)
      const parsed = parseAIResponse(res)
      
      const careers = parsed.careerSlugs.length > 0 
        ? await getCareersBySlugs(parsed.careerSlugs, careersCache)
        : []
      
      setResponse((prevResponse) => [
        ...prevResponse,
        { type: "user", message: promptToSend },
        { type: "bot", message: parsed.text, careers },
      ])
      setUserInput("")
    } catch (err) {
      setResponse((prevResponse) => [
        ...prevResponse,
        { type: "system", message: t(language, "chat.error") },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPromptClick = (prompt: string) => {
    setUserInput(prompt)
  }

  const handleClear = () => {
    setUserInput("")
    setResponse([])
    setIsLoading(false)
  }

  const showEmptyState = response.length === 0 && !loadingCareers
  const showQuickPrompts = response.length === 0 && !loadingCareers
  const showMessages = response.length > 0

  return (
    <div className="flex h-screen flex-col bg-surface">
      <ChatHeader />
      
      {loadingCareers && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted">{t(language, "chat.loadingCareers")}</p>
        </div>
      )}

      {showEmptyState && <ChatEmptyState language={language} />}
      
      {showQuickPrompts && (
        <QuickPrompts
          language={language}
          onPromptClick={handleQuickPromptClick}
          disabled={isLoading || loadingCareers}
        />
      )}

      {showMessages && (
        <ChatMessages
          language={language}
          messages={response}
          isLoading={isLoading}
        />
      )}

      <ChatInput
        language={language}
        value={userInput}
        onChange={setUserInput}
        onSubmit={() => handleSubmit()}
        onClear={handleClear}
        disabled={isLoading || loadingCareers}
      />
    </div>
  )
}
