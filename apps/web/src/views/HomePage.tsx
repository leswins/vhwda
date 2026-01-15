import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import { Button } from "../ui/components/Button"
import { CareerCard } from "../ui/widgets/CareerCard"
import { fetchHomePageData, HomePageData } from "../sanity/queries/homePage"
import { getLocalizedString } from "../sanity/queries/careers"

const StepIconQuiz = () => (
  <svg aria-hidden="true" viewBox="0 0 48 48" className="h-12 w-12">
    <circle cx="14" cy="14" r="12" fill="rgb(var(--color-accent-pink))" />
    <circle cx="34" cy="14" r="12" fill="rgb(var(--color-accent-orange))" />
    <circle cx="14" cy="34" r="12" fill="rgb(var(--color-accent-yellow))" />
    <circle cx="34" cy="34" r="12" fill="rgb(var(--color-accent-blue))" />
  </svg>
)

const StepIconBrowse = () => (
  <svg aria-hidden="true" viewBox="0 0 48 48" className="h-12 w-12">
    <circle cx="18" cy="18" r="14" fill="rgb(var(--color-accent-blue))" />
    <circle cx="32" cy="30" r="14" fill="rgb(var(--color-accent-green))" />
    <circle cx="34" cy="14" r="9" fill="rgb(var(--color-accent-yellow))" />
  </svg>
)

const StepIconPlan = () => (
  <svg aria-hidden="true" viewBox="0 0 48 48" className="h-12 w-12">
    <circle cx="24" cy="24" r="10" fill="rgb(var(--color-accent-yellow))" />
    <rect x="22" y="2" width="4" height="10" fill="rgb(var(--color-accent-orange))" />
    <rect x="22" y="36" width="4" height="10" fill="rgb(var(--color-accent-orange))" />
    <rect x="2" y="22" width="10" height="4" fill="rgb(var(--color-accent-orange))" />
    <rect x="36" y="22" width="10" height="4" fill="rgb(var(--color-accent-orange))" />
  </svg>
)

const ArrowIndicator = () => (
  <div className="relative flex aspect-square h-[70px] items-center justify-center overflow-hidden" aria-hidden="true">
    <div className="absolute top-0 bottom-0 right-0 left-[-5px] translate-x-[-100%] bg-foreground transition-transform duration-300 ease-out group-hover:translate-x-0" />
    <svg className="relative z-10 text-foreground transition-colors duration-300 group-hover:text-surface" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M-4.92305e-07 11.2626L-3.81923e-07 8.73737L15.1515 8.73737L8.20707 1.79293L10 -4.37114e-07L20 10L10 20L8.20707 18.2071L15.1515 11.2626L-4.92305e-07 11.2626Z" fill="currentColor" />
    </svg>
  </div>
)

export function HomePage() {
  const { language } = useLanguageStore()
  const navigate = useNavigate()
  const [data, setData] = useState<HomePageData | null>(null)

  const steps = [
    {
      id: "quiz",
      to: "/quiz",
      title: t(language, "home.steps.quiz.title"),
      description: t(language, "home.steps.quiz.description"),
      icon: <StepIconQuiz />
    },
    {
      id: "browse",
      to: "/careers",
      title: t(language, "home.steps.browse.title"),
      description: t(language, "home.steps.browse.description"),
      icon: <StepIconBrowse />
    },
    {
      id: "plan",
      to: "/resources",
      title: t(language, "home.steps.plan.title"),
      description: t(language, "home.steps.plan.description"),
      icon: <StepIconPlan />
    }
  ]

  useEffect(() => {
    fetchHomePageData().then(setData)
  }, [])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-surface border-b border-foreground">
        <div className="mx-auto max-w-[1200px] px-6 py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <h1 className="text-h1 text-foreground">{t(language, "home.hero.title")}</h1>
              <p className="text-body-lg text-onSurfaceSecondary max-w-[620px]">
                {t(language, "home.hero.subtitle")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="ghost"
                  size="lg"
                  className="bg-accentPink px-6 py-3 text-body-base text-foreground hover:bg-accentPink/90"
                  onClick={() => navigate("/quiz")}
                >
                  {t(language, "home.hero.primaryCTA")}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="border border-foreground bg-surface2 px-6 py-3 text-body-base text-foreground hover:bg-surface1"
                  onClick={() => navigate("/careers")}
                >
                  {t(language, "home.hero.secondaryCTA")}
                </Button>
              </div>
            </div>
            <div className="lg:border-l border-foreground lg:pl-12 lg:flex lg:justify-end">
              <div className="aspect-square w-full max-w-[520px] bg-surface2" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="bg-surface border-b border-foreground">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="sr-only">{t(language, "home.steps.heading")}</h2>
          <div className="border-y border-foreground">
            {steps.map((step, index) => (
              <Link
                key={step.id}
                to={step.to}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 py-8 border-b border-foreground last:border-b-0"
              >
                <div className="flex items-center gap-6">
                  <span className="text-sub2 text-foreground">{index + 1}</span>
                  <div className="w-[0.5px] self-stretch bg-foreground" aria-hidden="true" />
                  <div className="flex h-[56px] w-[56px] items-center justify-center" aria-hidden="true">
                    {step.icon}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-h4 text-foreground">{step.title}</span>
                  <p className="text-body-base text-onSurfaceSecondary">{step.description}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-[0.5px] self-stretch bg-foreground" aria-hidden="true" />
                  <ArrowIndicator />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Careers Section */}
      <section className="bg-surface1 py-20 overflow-hidden border-b border-foreground">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-h2 font-bold leading-h2 tracking-h2 text-foreground uppercase">
              {t(language, "home.featuredCareers.title")}
            </h2>
            <Link to="/careers" className="text-sm font-bold text-foreground hover:underline underline-offset-4 uppercase tracking-widest">
              {t(language, "home.featuredCareers.viewAll")} →
            </Link>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
            {data?.featuredCareers && data.featuredCareers.length > 0 ? (
              data.featuredCareers.map((career) => (
                <div key={career._id} className="snap-start">
                  <CareerCard
                    language={language}
                    title={getLocalizedString(language, career.title) || ""}
                    salary={career.salary?.median ? `$${career.salary.median.toLocaleString()}` : undefined}
                    to={`/careers/${career.slug}`}
                    imageUrl={career.imageUrl}
                  />
                </div>
              ))
            ) : (
              // Placeholder cards if no data
              [1, 2, 3].map((i) => (
                <div key={i} className="h-[480px] w-[420px] shrink-0 bg-surface2 border border-foreground animate-pulse" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Explore Options Section */}
      <section className="bg-surface py-20 lg:py-32">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="text-h2 font-bold mb-16 text-foreground uppercase tracking-h2">
            {t(language, "home.sections.explore.title")}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Browse Card */}
            <Link to="/careers" className="group p-10 border border-foreground bg-surface hover:bg-foreground hover:text-surface transition-colors flex flex-col h-full">
              <h3 className="text-h4 font-bold mb-4 uppercase tracking-h4">{t(language, "home.sections.explore.browse.title")}</h3>
              <p className="text-body-base text-onSurfaceSecondary group-hover:text-surface/80 mb-12 flex-1">
                {t(language, "home.sections.explore.browse.description")}
              </p>
              <div className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <span>{t(language, "home.hero.browseCTA")}</span>
                <span className="text-xl">→</span>
              </div>
            </Link>

            {/* Quiz Card */}
            <Link to="/quiz" className="group p-10 border-y md:border-y-0 md:border-x border-foreground bg-surface hover:bg-foreground hover:text-surface transition-colors flex flex-col h-full">
              <h3 className="text-h4 font-bold mb-4 uppercase tracking-h4">{t(language, "home.sections.explore.quiz.title")}</h3>
              <p className="text-body-base text-onSurfaceSecondary group-hover:text-surface/80 mb-12 flex-1">
                {t(language, "home.sections.explore.quiz.description")}
              </p>
              <div className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <span>{t(language, "home.hero.quizCTA")}</span>
                <span className="text-xl">→</span>
              </div>
            </Link>

            {/* Resources Card */}
            <Link to="/resources" className="group p-10 border border-foreground bg-surface hover:bg-foreground hover:text-surface transition-colors flex flex-col h-full">
              <h3 className="text-h4 font-bold mb-4 uppercase tracking-h4">{t(language, "home.sections.explore.resources.title")}</h3>
              <p className="text-body-base text-onSurfaceSecondary group-hover:text-surface/80 mb-12 flex-1">
                {t(language, "home.sections.explore.resources.description")}
              </p>
              <div className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <span>{t(language, "nav.resources")}</span>
                <span className="text-xl">→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
