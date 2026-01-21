import React from "react"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"

type Props = {
  language: Language
  titleKey: string
  count: number
  iconSrc: string
  iconAlt: string
  iconBgColor: string
}

export function SectionHeader({ language, titleKey, count, iconSrc, iconAlt, iconBgColor }: Props) {
  return (
    <div className="flex items-center justify-between p-[25px] border-b-[0.5px] border-foreground">
      <div className="flex items-center gap-[20px]">
        <div className={`flex h-[70px] w-[70px] items-center justify-center ${iconBgColor}`}>
          <img src={iconSrc} alt={iconAlt} className="h-[35px] w-[35px]" />
        </div>
        <h2 className="text-h3 font-bold text-foreground">{t(language, titleKey)}</h2>
      </div>
      <span className="text-body-base text-foreground">{count} Found</span>
    </div>
  )
}

