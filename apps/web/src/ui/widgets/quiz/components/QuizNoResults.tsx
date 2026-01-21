import React from "react"
import { Link } from "react-router-dom"
import type { Language } from "../../../../utils/i18n"
import { t } from "../../../../utils/i18n"
import { QuizResultsHeader } from "./QuizResultsHeader"
import noOptionsShapes from "../../icons/shapes/no-options.png"

type QuizNoResultsProps = {
  language: Language
  onStartOver: () => void
}

export function QuizNoResults({ language, onStartOver }: QuizNoResultsProps) {
  return (
    <div className="w-full">
      <QuizResultsHeader language={language} onStartOver={onStartOver} />
      
      <div className="relative min-h-[600px] pt-16 px-8 overflow-hidden">
        <div className="max-w-5xl space-y-8">
          <h2 className="text-h3 font-bold text-foreground">
            {t(language, "quiz.results.noMatches.title")}
          </h2>
          
          <p className="text-body-lg text-foreground leading-[135%] tracking-[-0.025em] max-w-5xl">
            {t(language, "quiz.results.noMatches.description")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <button
              onClick={onStartOver}
              className="px-[15px] py-[10px] bg-[rgb(var(--color-accent-pink))] text-foreground font-semibold text-body-base leading-[135%] tracking-[-0.025em] hover:opacity-90 transition-opacity"
            >
              {t(language, "quiz.results.retake")}
            </button>
            
            <Link
              to="/careers"
              className="px-[15px] py-[10px] bg-surface1 text-foreground font-semibold text-body-base leading-[135%] tracking-[-0.025em] hover:bg-surface2 transition-colors"
            >
              {t(language, "quiz.results.noMatches.searchCareer")}
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-0 right-0 pointer-events-none" style={{ bottom: 0, right: 0, margin: 0, padding: 0 }}>
          <img 
            src={noOptionsShapes} 
            alt="" 
            className="w-auto h-auto max-w-md block"
            style={{ opacity: 0.4, margin: 0, padding: 0, display: 'block' }}
          />
        </div>
      </div>
    </div>
  )
}
