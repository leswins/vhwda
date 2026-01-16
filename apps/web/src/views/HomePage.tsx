import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import { Button } from "../ui/components/Button"
import { CareerCard } from "../ui/widgets/CareerCard"
import { fetchHomePageData, HomePageData } from "../sanity/queries/homePage"
import { getLocalizedString } from "../sanity/queries/careers"

export function HomePage() {
  const { language } = useLanguageStore()
  const navigate = useNavigate()
  const [data, setData] = useState<HomePageData | null>(null)

  useEffect(() => {
    fetchHomePageData().then(setData)
  }, [])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-surface px-6 py-20 lg:py-32 border-b border-foreground">
        <div className="mx-auto max-w-[1200px]">
          <div className="max-w-[850px] space-y-8">
            <h1 className="text-h1 font-bold leading-h1 tracking-h1 text-foreground uppercase">
              {t(language, "home.hero.title")}
            </h1>
            <p className="text-body-lg text-foreground max-w-[600px] font-medium">
              {t(language, "home.hero.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                variant="dark"
                size="lg" 
                className="px-8 py-4 text-lg uppercase" 
                onClick={() => navigate("/careers")}
              >
                {t(language, "home.hero.browseCTA")}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg border-foreground uppercase" 
                onClick={() => navigate("/quiz")}
              >
                {t(language, "home.hero.quizCTA")}
              </Button>
            </div>
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
