import React from "react"

type Props = {
  type: "user" | "bot" | "system"
  message: string
}

export function ChatMessage({ type, message }: Props) {
  const getMessageStyles = () => {
    switch (type) {
      case "user":
        return "ml-auto w-fit max-w-[70%] lg:max-w-[50%] bg-foreground text-surface"
      case "bot":
        return "mr-auto w-fit max-w-[70%] lg:max-w-[50%] bg-surface-2"
      default:
        return "mx-auto w-fit max-w-[70%] lg:max-w-[50%] bg-surface-1 text-muted"
    }
  }

  const getTextStyles = () => {
    switch (type) {
      case "user":
        return "text-body-lg font-medium leading-[135%] tracking-[-0.025em] text-surface"
      case "bot":
        return "text-body-lg font-medium leading-[135%] tracking-[-0.025em] text-foreground"
      default:
        return ""
    }
  }

  const getBorderRadius = () => {
    switch (type) {
      case "user":
        return "rounded-none"
      default:
        return "rounded-md"
    }
  }

  return (
    <div className={`${getBorderRadius()} p-4 ${getMessageStyles()}`}>
      <p className={`whitespace-pre-wrap ${getTextStyles()}`}>
        {message}
      </p>
    </div>
  )
}

