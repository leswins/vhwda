import React from "react"

type Props = {
  type: "user" | "bot" | "system"
  message: string
}

export function ChatMessage({ type, message }: Props) {
  const getMessageStyles = () => {
    switch (type) {
      case "user":
        return "ml-auto mr-fluid-20 lg:mr-0 max-w-[85%] lg:max-w-[452px] bg-foreground text-surface"
      case "bot":
        return "mr-auto ml-fluid-20 lg:ml-0 max-w-[90%] lg:max-w-[500px] bg-surface-2"
      default:
        return "mx-auto max-w-[80%] bg-surface-1 text-muted"
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

