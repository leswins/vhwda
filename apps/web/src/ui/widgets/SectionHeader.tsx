import React from "react"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"
import type { TranslationKey } from "../../utils/i18n"

type Props = {
  language: Language
  title?: string
  titleKey?: TranslationKey
  count: number
  icon: React.ReactNode
  iconAlt: string
  iconBgColor: string
}

export function SectionHeader({ language, title, titleKey, count, icon, iconAlt, iconBgColor }: Props) {
  const heading = title ?? (titleKey ? t(language, titleKey) : "")
  const countLabel = t(language, "resources.countFound").replace("{count}", String(count))

  return (
    <div className="flex items-center justify-between p-[25px] border-b-[0.5px] border-foreground">
      <div className="flex items-center gap-[20px]">
        <div className={`flex h-[70px] w-[70px] items-center justify-center ${iconBgColor}`}>
          <div className="flex h-[35px] w-[35px] items-center justify-center text-foreground" aria-hidden="true">
            {icon}
          </div>
          <span className="sr-only">{iconAlt}</span>
        </div>
        <h2 className="text-h3 font-bold text-foreground">{heading}</h2>
      </div>
      <span className="text-body-base text-foreground">{countLabel}</span>
    </div>
  )
}
