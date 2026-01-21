import React, { useMemo } from "react"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import { SectionNav } from "../ui/widgets/SectionNav"
import { Button } from "../ui/components/Button"
import VHWDALogo from "../assets/icons/VHWDA Logo.svg"
import ScaleIcon from "../assets/icons/Scale.svg"
import MoneyIcon from "../assets/icons/Money.svg"
import EducationIcon from "../assets/icons/Education.svg"
import DoctorIcon from "../assets/icons/Doctor.svg"

function BulletGrid({ items }: { items?: string[] }) {
  if (!items?.length) return null
  return (
    <div className="flex flex-col gap-y-[20px]">
      {items.map((item, idx) => (
        <div key={`${idx}-${item}`} className="flex items-start gap-6">
          <div className="mt-2 h-[10px] w-[10px] shrink-0 bg-accentOrange" aria-hidden="true" />
          <div className="text-body-lg text-foreground">{item}</div>
        </div>
      ))}
    </div>
  )
}

interface DataSourceProps {
  icon: string
  title: string
  description: string
  color: string
}

function DataSourceCard({ icon, title, description, color }: DataSourceProps) {
  return (
    <div className="flex items-center gap-[50px]">
      <div
        className="flex h-[100px] w-[100px] shrink-0 items-center justify-center"
        style={{ backgroundColor: `rgb(var(${color}))` }}
        aria-hidden="true"
      >
        <img src={icon} alt="" className="h-[50px] w-auto" />
      </div>
      <div className="h-[100px] w-[0.5px] bg-foreground shrink-0" />
      <div className="flex flex-col gap-[15px]">
        <h3 className="text-h4 font-bold">{title}</h3>
        <p className="text-body-lg text-foreground">{description}</p>
      </div>
    </div>
  )
}

export function AboutPage() {
  const { language } = useLanguageStore()

  const sections = useMemo(
    () => [
      { id: "about-vhwda", label: t(language, "about.sections.aboutVhwda") },
      { id: "data-sources", label: t(language, "about.sections.dataSources") },
      { id: "quiz-methodology", label: t(language, "about.sections.quizMethodology") },
      { id: "ai-features", label: t(language, "about.sections.aiFeatures") },
      { id: "update-cadence", label: t(language, "about.sections.updateCadence") }
    ],
    [language]
  )

  const softScoringItems = [
    t(language, "about.quizMethodology.softScoring.item1"),
    t(language, "about.quizMethodology.softScoring.item2"),
    t(language, "about.quizMethodology.softScoring.item3")
  ]

  const hardFiltersItems = [
    t(language, "about.quizMethodology.hardFilters.item1"),
    t(language, "about.quizMethodology.hardFilters.item2"),
    t(language, "about.quizMethodology.hardFilters.item3")
  ]

  const aiChatItems = [
    t(language, "about.aiFeatures.aiChat.item1"),
    t(language, "about.aiFeatures.aiChat.item2"),
    t(language, "about.aiFeatures.aiChat.item3")
  ]

  const careerVideosItems = [
    t(language, "about.aiFeatures.careerVideos.item1"),
    t(language, "about.aiFeatures.careerVideos.item2"),
    t(language, "about.aiFeatures.careerVideos.item3")
  ]

  const quizScoringItems = [
    t(language, "about.aiFeatures.quizScoring.item1"),
    t(language, "about.aiFeatures.quizScoring.item2"),
    t(language, "about.aiFeatures.quizScoring.item3")
  ]

  const dataSources = [
    {
      icon: ScaleIcon,
      title: t(language, "about.dataSources.careerInfo.title"),
      description: t(language, "about.dataSources.careerInfo.description"),
      color: "--color-accent-yellow"
    },
    {
      icon: MoneyIcon,
      title: t(language, "about.dataSources.salaryOutlook.title"),
      description: t(language, "about.dataSources.salaryOutlook.description"),
      color: "--color-accent-green"
    },
    {
      icon: EducationIcon,
      title: t(language, "about.dataSources.educationPrograms.title"),
      description: t(language, "about.dataSources.educationPrograms.description"),
      color: "--color-accent-blue"
    },
    {
      icon: DoctorIcon,
      title: t(language, "about.dataSources.profOrgs.title"),
      description: t(language, "about.dataSources.profOrgs.description"),
      color: "--color-accent-pink"
    }
  ]

  return (
    <div className="py-[50px]">
      {/* Page Header */}
      <div className="flex flex-col gap-[15px] pt-0 pb-[50px] px-[50px]">
        <p className="text-sub2 font-bold uppercase text-foreground">
          {t(language, "about.kicker")}
        </p>
        <h1 className="text-h2 font-bold text-foreground">
          {t(language, "about.title")}
        </h1>
      </div>

      {/* Sticky Section Navigation */}
      <SectionNav items={sections} offsetTopPx={0} ariaLabel={t(language, "about.sectionNavA11y")} />

      {/* About VHWDA Section */}
      <section id="about-vhwda" className="border-b border-foreground pt-[65px] pb-[50px] px-[50px]">
        <div className="flex flex-col gap-[50px]">
          <div className="flex-shrink-0">
            <img src={VHWDALogo} alt="VHWDA Logo" className="h-[75px] w-auto" />
          </div>
          <div className="space-y-[50px] max-w-[1200px]">
            <h2 className="text-h2 font-bold">
              {t(language, "about.aboutVhwda.heading")}
            </h2>
            <p className="text-body-lg text-foreground/70">
              {t(language, "about.aboutVhwda.paragraph")}
            </p>
          </div>
        </div>
      </section>

      {/* Data Sources Section */}
      <section id="data-sources" className="border-b border-foreground p-[50px]">
        <h2 className="mb-[50px] text-h2 font-bold">
          {t(language, "about.sections.dataSources")}
        </h2>
        <div className="flex flex-col gap-[50px]">
          {dataSources.map((source, idx) => (
            <DataSourceCard
              key={idx}
              icon={source.icon}
              title={source.title}
              description={source.description}
              color={source.color}
            />
          ))}
        </div>
      </section>

      {/* Quiz Methodology Section */}
      <section id="quiz-methodology" className="border-b border-foreground p-[50px]">
        <h2 className="mb-[50px] text-h2 font-bold">
          {t(language, "about.sections.quizMethodology")}
        </h2>
        <div className="space-y-[50px]">
          <p className="text-body-lg text-foreground">
            {t(language, "about.quizMethodology.intro")}
          </p>

          <div className="space-y-[50px]">
            <div className="space-y-[25px]">
              <h3 className="text-h4 font-bold">
                {t(language, "about.quizMethodology.softScoring.title")}
              </h3>
              <BulletGrid items={softScoringItems} />
            </div>

            <div className="space-y-[25px]">
              <h3 className="text-h4 font-bold">
                {t(language, "about.quizMethodology.hardFilters.title")}
              </h3>
              <BulletGrid items={hardFiltersItems} />
            </div>
          </div>

          <p className="text-body-lg text-foreground">
            {t(language, "about.quizMethodology.outro")}
          </p>
        </div>
      </section>

      {/* AI Features Disclosure Section */}
      <section id="ai-features" className="border-b border-foreground p-[50px]">
        <h2 className="mb-[50px] text-h2 font-bold">
          {t(language, "about.sections.aiFeatures")}
        </h2>
        <div className="space-y-[50px]">
          <p className="text-body-lg text-foreground">
            {t(language, "about.aiFeatures.intro")}
          </p>

          <div className="space-y-[50px]">
            <div className="space-y-[25px]">
              <h3 className="text-h4 font-bold">
                {t(language, "about.aiFeatures.aiChat.title")}
              </h3>
              <BulletGrid items={aiChatItems} />
            </div>

            <div className="space-y-[25px]">
              <h3 className="text-h4 font-bold">
                {t(language, "about.aiFeatures.careerVideos.title")}
              </h3>
              <BulletGrid items={careerVideosItems} />
            </div>

            <div className="space-y-[25px]">
              <h3 className="text-h4 font-bold">
                {t(language, "about.aiFeatures.quizScoring.title")}
              </h3>
              <BulletGrid items={quizScoringItems} />
            </div>
          </div>
        </div>
      </section>

      {/* Update Cadence & Feedback Section */}
      <section id="update-cadence" className="p-[50px]">
        <h2 className="mb-[50px] text-h2 font-bold">
          {t(language, "about.sections.updateCadence")}
        </h2>
        <div className="space-y-[50px]">
          <p className="text-body-lg text-foreground">
            {t(language, "about.updateCadence.paragraph1")}
          </p>

          <div className="space-y-[25px]">
            <h3 className="text-h4 font-bold leading-h4 tracking-h4">
              {t(language, "about.updateCadence.contactHeading")}
            </h3>
            <div>
              <Button
                variant="dark"
                onClick={() => window.location.href = "mailto:feedback@vhwda.virginia.gov"}
              >
                {t(language, "about.updateCadence.emailButton")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
