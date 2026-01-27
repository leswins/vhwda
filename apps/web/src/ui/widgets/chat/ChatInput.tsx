import React from "react"
import type { Language } from "../../../utils/i18n"
import { t } from "../../../utils/i18n"
import messageIcon from "../../../assets/icons/message.svg"

type Props = {
  language: Language
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

export function ChatInput({ language, value, onChange, onSubmit, disabled }: Props) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div
      className="sticky bottom-0 flex items-center justify-between border-t-[0.5px] border-foreground px-[25px] py-[25px]"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(2.5px)",
        WebkitBackdropFilter: "blur(2.5px)"
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={t(language, "chat.placeholder")}
        disabled={disabled}
        className="flex-1 border-0 bg-transparent text-foreground placeholder:text-muted focus:outline-none focus:ring-0 disabled:opacity-50"
        style={{
          fontSize: "var(--text-body-lg)",
          lineHeight: "var(--leading-body-lg)",
          letterSpacing: "var(--tracking-body-lg)",
          fontWeight: "500"
        }}
      />
      <button
        onClick={onSubmit}
        disabled={disabled}
        className="flex h-[30px] w-[30px] shrink-0 items-center justify-center disabled:opacity-50"
        aria-label={t(language, "chat.send")}
      >
        <div
          className={`h-[30px] w-[30px] transition-colors duration-250 ease-out ${value.trim().length === 0 ? "bg-onSurfaceDisabled" : "bg-foreground"
            }`}
          style={{
            maskImage: `url(${messageIcon})`,
            maskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskImage: `url(${messageIcon})`,
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat"
          }}
        />
      </button>
    </div>
  )
}
