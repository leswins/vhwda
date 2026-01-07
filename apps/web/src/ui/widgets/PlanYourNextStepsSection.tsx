import React from "react"
import { useLanguageStore } from "../../zustand/useLanguageStore"
import { t } from "../../utils/i18n"
import { ResourceCard } from "./ResourceCard"

export function PlanYourNextStepsSection() {
  const { language } = useLanguageStore()

  return (
    <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{t(language, "planNextSteps.title")}</h2>
        <p className="text-muted">{t(language, "planNextSteps.description")}</p>
      </div>

      <div className="flex flex-col gap-4">
        <ResourceCard
          language={language}
          type="scholarships"
          to="/resources/scholarships"
        />
        <ResourceCard
          language={language}
          type="professionalOrganizations"
          to="/resources/organizations"
        />
        <ResourceCard
          language={language}
          type="schoolsPrerequisites"
          to="/resources/schools"
        />
      </div>
    </section>
  )
}

