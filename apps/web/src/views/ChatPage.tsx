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
        console.log("🔄 Loading careers context...")
        const careers = await fetchCareersForChat()
        const careersContext = formatCareersContext(careers, language)
        const context = createChatSystemPrompt(careersContext, language)
        setSystemContext(context)
        console.log("✅ Careers context loaded successfully")
        console.log("✅ System context set:", context ? "Yes" : "No")
      } catch (error) {
        console.error("❌ Error loading careers for chat context:", error)
        setSystemContext(undefined)
      } finally {
        setLoadingCareers(false)
        console.log("✅ Loading careers completed")
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
      console.error("Error generating response:", err)
      const errorMessage =
        err instanceof Error && err.message.includes("API key not configured")
          ? t(language, "chat.apiKeyNotConfigured")
          : err instanceof Error && err.message.includes("API key not valid")
            ? t(language, "chat.apiKeyInvalid")
            : t(language, "chat.failedToGenerate")
      setResponse((prevResponse) => [
        ...prevResponse,
        { type: "system", message: errorMessage },
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

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col space-y-4">
      {response.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center space-y-4">
          <h1 className="text-2xl font-semibold">{t(language, "chat.welcome")}</h1>
          {loadingCareers && (
            <p className="text-sm text-muted">{t(language, "chat.loadingCareers")}</p>
          )}
          {!loadingCareers && systemContext && (
            <p className="text-xs text-muted">
              ✅ {t(language, "chat.careersLoaded")}
            </p>
          )}
        </div>
      ) : (
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

