import React from "react"
import type { Language } from "../../../utils/i18n"
import { t } from "../../../utils/i18n"
import closeIcon from "../../../assets/icons/close.svg"

type Props = {
  language?: Language
  onClose?: () => void
}

export function ChatHeader({ language = "en", onClose }: Props) {
  return (
    <div 
      className="sticky top-0 z-50 flex flex-col gap-5 px-[25px] pt-[25px] pb-0"
      style={{ 
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)"
      }}
    >
      <div className="flex items-center justify-between">
        <h1 
          className="font-bold text-foreground" 
          style={{ 
            fontSize: "var(--text-h4)",
            lineHeight: "var(--leading-h4)",
            letterSpacing: "var(--tracking-h4)"
          }}
        >
          {t(language, "chat.careerAssistant")}
        </h1>
        {onClose && (
          <button
            onClick={onClose}
            className="flex h-[30px] w-[30px] items-center justify-center"
            aria-label="Close"
          >
            <img src={closeIcon} alt="" className="h-[17px] w-[17px]" />
          </button>
        )}
      </div>
      <div className="h-0 w-full border-b-[0.5px] border-foreground" />
    </div>
  )
}
