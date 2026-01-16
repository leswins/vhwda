import React from "react"

type Props = {
  onClose?: () => void
}

export function ChatHeader({ onClose }: Props) {
  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-4">
      <h1 className="text-xl font-bold text-foreground">Career Assistant</h1>
      {onClose && (
        <button
          onClick={onClose}
          className="text-foreground hover:text-muted"
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
  )
}

