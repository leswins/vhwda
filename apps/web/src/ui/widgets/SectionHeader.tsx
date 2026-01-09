import React from "react"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"

type Props = {
  language: Language
  titleKey: string
  count: number
  icon: React.ReactNode
  iconBgColor: string
}

export function SectionHeader({ language, titleKey, count, icon, iconBgColor }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-md ${iconBgColor}`}>
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-foreground">{t(language, titleKey)}</h2>
      <span className="text-sm text-muted">{count} Found</span>
    </div>
  )
}

