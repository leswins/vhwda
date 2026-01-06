import React, { useState, useEffect } from "react"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import { generateContent, type ChatMessage } from "../services/Model"
import { fetchCareersForChat, formatCareersContext, createChatSystemPrompt } from "../services/careerContext"

type Message = {
  type: "user" | "bot" | "system"
  message: string
}

export function ChatPage() {
  const { language } = useLanguageStore()
  const [userInput, setUserInput] = useState("")
  const [response, setResponse] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [systemContext, setSystemContext] = useState<string | undefined>(undefined)
  const [loadingCareers, setLoadingCareers] = useState(true)

  useEffect(() => {
    async function loadCareersContext() {
      try {
        setLoadingCareers(true)
        const careers = await fetchCareersForChat()
        const careersContext = formatCareersContext(careers, language)
        const context = createChatSystemPrompt(careersContext, language)
        setSystemContext(context)
      } catch (error) {
        setSystemContext(undefined)
      } finally {
        setLoadingCareers(false)
      }
    }

    loadCareersContext()
  }, [language])

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value)
  }

  const handleClear = () => {
    setUserInput("")
    setResponse([])
    setIsLoading(false)
  }

  const handleSubmit = async () => {
    if (!userInput.trim()) {
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

      const res = await generateContent(userInput, conversationHistory, systemContext)
      
      setResponse((prevResponse) => [
        ...prevResponse,
        { type: "user", message: userInput },
        { type: "bot", message: res },
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleQuickPrompt = async (prompt: string) => {
    if (loadingCareers || isLoading) {
      return
    }

    setUserInput(prompt)
    
    setIsLoading(true)
    try {
      const conversationHistory: ChatMessage[] = response
        .filter((msg) => msg.type === "user" || msg.type === "bot")
        .map((msg) => ({
          role: msg.type === "user" ? "user" : "model",
          parts: msg.message,
        }))

      const res = await generateContent(prompt, conversationHistory, systemContext)
      
      setResponse((prevResponse) => [
        ...prevResponse,
        { type: "user", message: prompt },
        { type: "bot", message: res },
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

  const quickPrompts = [
    { key: "findCareers", prompt: t(language, "chat.prompts.findCareers") },
    { key: "compareSalaries", prompt: t(language, "chat.prompts.compareSalaries") },
    { key: "educationPaths", prompt: t(language, "chat.prompts.educationPaths") },
    { key: "jobOutlook", prompt: t(language, "chat.prompts.jobOutlook") },
    { key: "careerTransitions", prompt: t(language, "chat.prompts.careerTransitions") },
    { key: "quickStart", prompt: t(language, "chat.prompts.quickStart") },
  ]
  return (
    <div className="flex h-[calc(100vh-200px)] flex-col space-y-4">
      {response.length > 0 && (
        <div className="flex-1 space-y-4 overflow-y-auto">
          {response.map((msg, index) => (
            <div
              key={index}
              className={`rounded-md p-4 ${
                msg.type === "user"
                  ? "ml-auto max-w-[80%] bg-primary text-on-primary"
                  : msg.type === "bot"
                    ? "mr-auto max-w-[80%] bg-surface-2"
                    : "mx-auto max-w-[80%] bg-surface-1 text-muted"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))}
          {isLoading && (
            <div className="mr-auto max-w-[80%] rounded-md bg-surface-2 p-4">
              <p className="text-muted">{t(language, "chat.generating")}</p>
            </div>
          )}
        </div>
      )}

      {response.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-4xl">
            {quickPrompts.map((item) => (
              <button
                key={item.key}
                onClick={() => handleQuickPrompt(item.prompt)}
                className="rounded-md border border-border bg-surface p-4 text-left hover:bg-surface-1 transition-colors"
              >
                <div className="font-medium text-foreground mb-1">
                  {t(language, `chat.prompts.${item.key}.title`)}
                </div>
                <div className="text-sm text-muted">
                  {t(language, `chat.prompts.${item.key}.subtitle`)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleClear}
          className="rounded-md border border-border bg-surface px-4 py-2 text-sm hover:bg-surface-1"
        >
          {t(language, "chat.clear")}
        </button>

        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          onKeyDown={handleKeyPress}
          placeholder={t(language, "chat.placeholder")}
          className="flex-1 rounded-md border border-border bg-surface px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90 disabled:opacity-50"
        >
          {t(language, "chat.send")}
        </button>
      </div>
    </div>
  )
}

