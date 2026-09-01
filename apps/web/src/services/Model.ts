export type ChatMessage = {
  role: "user" | "model"
  parts: string
}

export const generateContent = async (
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  systemContext?: string
): Promise<string> => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: userMessage,
      history: conversationHistory,
      systemContext
    })
  })

  const payload = (await response.json().catch(() => null)) as { text?: string; error?: string } | null

  if (response.status === 429) {
    throw new Error(payload?.error || "Rate limit exceeded. Please wait a moment and try again.")
  }

  if (!response.ok) {
    throw new Error(payload?.error || "Failed to generate a response")
  }

  if (!payload?.text) {
    throw new Error("Failed to generate a response")
  }

  return payload.text
}
