import React from "react"

type Props = {
  type: "user" | "bot" | "system"
  message: string
}

export function ChatMessage({ type, message }: Props) {
  const getMessageStyles = () => {
    switch (type) {
      case "user":
        return "ml-auto max-w-[80%] bg-foreground text-surface"
      case "bot":
        return "mr-auto max-w-[80%] bg-surface-2"
      default:
        return "mx-auto max-w-[80%] bg-surface-1 text-muted"
    }
  }

  return (
    <div className={`rounded-md p-4 ${getMessageStyles()}`}>
      <p className="whitespace-pre-wrap">{message}</p>
    </div>
  )
}

