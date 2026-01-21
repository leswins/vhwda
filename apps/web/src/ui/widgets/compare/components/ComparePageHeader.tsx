import React from "react"
import type { Language } from "../../../../utils/i18n"
import { t } from "../../../../utils/i18n"

interface ComparePageHeaderProps {
  language: Language
}

export function ComparePageHeader({ language }: ComparePageHeaderProps) {
  return (
    <div className="flex flex-col gap-[15px] pt-0 pb-[50px] px-[50px] border-b border-foreground">
      <p className="text-sub2 font-bold uppercase text-foreground">
        {t(language, "compare.title")}
      </p>
      <h1 className="text-h2 font-bold text-foreground">
        {t(language, "compare.subtitle")}
      </h1>
    </div>
  )
}

