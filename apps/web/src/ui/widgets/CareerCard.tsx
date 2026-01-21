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
}

export function CareerCard({ language, title, salary, to, imageUrl, videoUrl, showMatch, matchLabel }: Props) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null)

  const handleMouseEnter = () => {
    const video = videoRef.current
    if (!video) return
    void video.play()
  }

  const handleMouseLeave = () => {
    videoRef.current?.pause()
  }

  return (
    <div className="group w-[420px] shrink-0 bg-surface">
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
          <div className="relative z-10 text-2xl font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-surface">{title}</div>
        </div>

        <div className="h-[0.5px] w-full bg-foreground" />

        <div className="px-5">
          <div className="flex items-center justify-between py-5 text-sm font-bold text-onSurfaceSecondary">
            <span>{t(language, "careerCard.typicalVaSalary")}</span>
            <span>{salary ?? "—"}</span>
          </div>

          <div className="h-[0.5px] w-full bg-foreground" />

          <div className="flex items-center justify-between py-5">
            <span className="text-sm text-muted">{t(language, "careerCard.learnMore")}</span>
            <span aria-hidden="true" className="text-xl text-foreground">
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

