import React from "react"
import type { Language } from "../../../utils/i18n"
import { t } from "../../../utils/i18n"

type Props = {
  language: Language
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onClear?: () => void
  disabled?: boolean
}

export function ChatInput({ language, value, onChange, onSubmit, onClear, disabled }: Props) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="border-t border-border px-6 py-4">
      <div className="flex gap-2">
        {onClear && (
          <button
            onClick={onClear}
            className="rounded-md border border-border bg-surface px-4 py-2 text-sm hover:bg-surface-1"
          >
            {t(language, "chat.clear")}
          </button>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={t(language, "chat.placeholder")}
          disabled={disabled}
          className="flex-1 rounded-md border border-border bg-surface px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
        <button
          onClick={onSubmit}
          disabled={disabled}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90 disabled:opacity-50"
        >
          {t(language, "chat.send")}
        </button>
      </div>
    </div>
  )
}

