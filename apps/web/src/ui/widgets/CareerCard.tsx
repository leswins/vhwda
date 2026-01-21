import React from "react"
import { Link } from "react-router-dom"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"

type Props = {
  language: Language
  title: string
  salary?: string
  to: string
  imageUrl?: string
  videoUrl?: string
  showMatch?: boolean
  matchLabel?: string
  isInCompare?: boolean
  canAddToCompare?: boolean
  onToggleCompare?: () => void
}

export function CareerCard({ language, title, salary, to, imageUrl, videoUrl, showMatch, matchLabel, isInCompare = false, canAddToCompare = false, onToggleCompare }: Props) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null)

  const handleMouseEnter = () => {
    const video = videoRef.current
    if (!video) return
    void video.play()
  }

  const handleMouseLeave = () => {
    videoRef.current?.pause()
  }

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleCompare?.()
  }

  const showCompareButton = onToggleCompare && (isInCompare || canAddToCompare)

  return (
    <div className="group w-full bg-surface relative">
      {showCompareButton && (
        <button
          onClick={handleCompareClick}
          className={`absolute right-0 top-0 z-10 flex h-[35px] w-[35px] items-center justify-center transition-colors ${isInCompare ? 'bg-accentOrange hover:bg-accentOrange/90' : 'bg-accentGreen hover:bg-accentGreen/90'
            }`}
          aria-label={isInCompare ? `Remove ${title} from compare` : `Add ${title} to compare`}
        >
          {isInCompare ? (
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.79541 0.795532L15.7954 15.7955M0.79541 15.7955L15.7954 0.795532" stroke="#09090B" strokeWidth="2.25" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 0V7.5M7.5 7.5V15M7.5 7.5H0M7.5 7.5H15" stroke="#09090B" strokeWidth="2" />
            </svg>
          )}
        </button>
      )}
      <Link to={to} className="block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onFocus={handleMouseEnter} onBlur={handleMouseLeave}>
        <div className="relative h-[283px] w-full overflow-hidden bg-surface2">
          {videoUrl ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
              loop
              poster={imageUrl}
            >
              <source src={videoUrl} />
            </video>
          ) : imageUrl ? (
            <img alt="" src={imageUrl} className="h-full w-full object-cover" />
          ) : null}

          {showMatch ? (
            <div className="absolute left-0 top-0 bg-accentGreen px-2.5 py-2">
              <div className="text-xs font-bold uppercase tracking-widest text-foreground">{matchLabel}</div>
            </div>
          ) : null}
        </div>

        <div className="h-[0.5px] w-full bg-foreground" />

        <div className="relative overflow-hidden bg-surface1 px-5 py-5">
          <div className="absolute inset-0 translate-x-[-100%] bg-foreground transition-transform duration-300 ease-out group-hover:translate-x-0" />
          <div className="relative z-10 text-h4 font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-surface">{title}</div>
        </div>

        <div className="h-[0.5px] w-full bg-foreground" />

        <div className="px-5">
          <div className="flex items-center justify-between py-5 text-body-base font-bold text-foreground">
            <span>{t(language, "careerCard.typicalVaSalary")}</span>
            <span>{salary ?? "—"}</span>
          </div>

          <div className="h-[0.5px] w-full bg-foreground" />

          <div className="flex items-center justify-between py-5">
            <span className="text-body-base font-medium text-foreground">{t(language, "careerCard.learnMore")}</span>
            <span aria-hidden="true" className="text-foreground">
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-4.92305e-07 11.2626L-3.81923e-07 8.73737L15.1515 8.73737L8.20707 1.79293L10 -4.37114e-07L20 10L10 20L8.20707 18.2071L15.1515 11.2626L-4.92305e-07 11.2626Z" fill="currentColor" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

