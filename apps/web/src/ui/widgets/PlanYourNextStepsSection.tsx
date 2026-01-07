import React from "react"
import { useLanguageStore } from "../../zustand/useLanguageStore"
import { t } from "../../utils/i18n"
import { ResourceCard } from "./ResourceCard"
import { FilterSidebar } from "./FilterSidebar"
import { ScholarshipList } from "./ScholarshipList"
import { ProfessionalOrganizationList } from "./ProfessionalOrganizationList"
import { SectionHeader } from "./SectionHeader"
import { scholarshipFilters } from "./filters/scholarshipFilters"
import { organizationFilters } from "./filters/organizationFilters"
import { ScholarshipIcon } from "./icons/ScholarshipIcon"
import { ProfessionalOrganizationIcon } from "./icons/ProfessionalOrganizationIcon"

export function PlanYourNextStepsSection() {
  const { language } = useLanguageStore()

  return (
    <div className="space-y-12">
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">{t(language, "planNextSteps.title")}</h2>
          <p className="text-muted">{t(language, "planNextSteps.description")}</p>
        </div>

        <div className="flex flex-col gap-4">
          <ResourceCard language={language} type="scholarships" />
          <ResourceCard language={language} type="professionalOrganizations" />
          <ResourceCard language={language} type="schoolsPrerequisites" />
        </div>
      </section>

      <section id="scholarships" className="scroll-mt-8 space-y-6">
        <SectionHeader
          language={language}
          titleKey="planNextSteps.card.scholarships.title"
          count={74}
          iconBgColor="bg-[rgb(var(--color-accent-green))]"
          icon={<ScholarshipIcon />}
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[256px_1fr]">
          <FilterSidebar
            language={language}
            filterGroups={scholarshipFilters}
            searchPlaceholderKey="filters.search"
          />
          <ScholarshipList language={language} count={74} />
        </div>
      </section>

      <section id="organizations" className="scroll-mt-8 space-y-6">
        <SectionHeader
          language={language}
          titleKey="planNextSteps.card.professionalOrganizations.title"
          count={125}
          iconBgColor="bg-[rgb(var(--color-accent-pink))]"
          icon={<ProfessionalOrganizationIcon />}
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[256px_1fr]">
          <FilterSidebar
            language={language}
            filterGroups={organizationFilters}
            searchPlaceholderKey="filters.search"
          />
          <ProfessionalOrganizationList language={language} count={125} />
        </div>
      </section>

      <section id="schools" className="scroll-mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          {t(language, "planNextSteps.card.schoolsPrerequisites.title")}
        </h2>
        <p className="text-muted">
          {t(language, "planNextSteps.card.schoolsPrerequisites.description")}
        </p>
      </section>
    </div>
  )
}

