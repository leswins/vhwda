import React from "react"
import type { Language } from "../../../utils/i18n"
import { t } from "../../../utils/i18n"
import { QuickPromptCard } from "./QuickPromptCard"
import searchIcon from "../../../assets/icons/Search.svg"
import moneyIcon from "../../../assets/icons/Money.svg"
import educationIcon from "../../../assets/icons/Education.svg"
import growthIcon from "../../../assets/icons/Growth.svg"
import scaleIcon from "../../../assets/icons/Scale.svg"
import timeIcon from "../../../assets/icons/Time.svg"

type Props = {
  language: Language
  onPromptClick: (prompt: string) => void
  disabled?: boolean
}

export function QuickPrompts({ language, onPromptClick, disabled }: Props) {
  const quickPrompts = [
    { 
      key: "findCareers", 
      prompt: t(language, "chat.prompts.findCareers"),
      icon: searchIcon,
      color: "var(--color-accent-orange)"
    },
    { 
      key: "compareSalaries", 
      prompt: t(language, "chat.prompts.compareSalaries"),
      icon: moneyIcon,
      color: "var(--color-accent-green)"
    },
    { 
      key: "educationPaths", 
      prompt: t(language, "chat.prompts.educationPaths"),
      icon: educationIcon,
      color: "var(--color-accent-blue)"
    },
    { 
      key: "jobOutlook", 
      prompt: t(language, "chat.prompts.jobOutlook"),
      icon: growthIcon,
      color: "var(--color-accent-pink)"
    },
    { 
      key: "careerTransitions", 
      prompt: t(language, "chat.prompts.careerTransitions"),
      icon: scaleIcon,
      color: "var(--color-accent-yellow)"
    },
    { 
      key: "quickStart", 
      prompt: t(language, "chat.prompts.quickStart"),
      icon: timeIcon,
      color: "var(--color-accent-orange)"
    },
  ]

  return (
    <div 
      className="sticky flex gap-[25px] overflow-x-auto overflow-y-clip bg-surface py-[25px] pl-[25px] pr-[50px]"
      style={{ 
        bottom: "80px",
        scrollbarWidth: "none",
        msOverflowStyle: "none"
      }}
    >
      <style>{`
        .sticky::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {quickPrompts.map((item, index) => (
        <React.Fragment key={item.key}>
          {index > 0 && (
            <div className="flex items-center">
              <div className="h-full w-0 border-l-[0.5px] border-foreground" />
            </div>
          )}
          <QuickPromptCard
            language={language}
            promptKey={item.key}
            prompt={item.prompt}
            icon={item.icon}
            iconColor={item.color}
            onClick={onPromptClick}
            disabled={disabled}
          />
        </React.Fragment>
      ))}
    </div>
  )
}
