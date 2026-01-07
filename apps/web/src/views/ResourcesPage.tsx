import React from "react"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import { PlanYourNextStepsSection } from "../ui/widgets/PlanYourNextStepsSection"

export function ResourcesPage() {
  const { language } = useLanguageStore()

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{t(language, "resources.title")}</h1>
        <p className="text-muted">{t(language, "resources.body")}</p>
      </div>
      <PlanYourNextStepsSection />
    </div>
  )
}


