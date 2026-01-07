import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useLanguageStore } from "../../zustand/useLanguageStore"
import { t } from "../../utils/i18n"
import { Button } from "../components/Button"
import { Divider } from "../components/Divider"

function IconButton({
  label,
  children,
  onClick
}: {
  label: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex items-center justify-center p-5 text-foreground hover:bg-surface2"
    >
      {children}
    </button>
  )
}

export function NavHeader() {
  const { language, setLanguage } = useLanguageStore()
  const navigate = useNavigate()

  return (
    <header className="border-b border-foreground bg-surface text-foreground">
      <div className="mx-auto flex max-w-[1368px] items-stretch justify-between pl-6 pr-0">
        <Link to="/" className="flex flex-col items-start gap-1 py-4">
          <span className="text-4xl font-extrabold leading-none">{t(language, "brand.name")}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">{t(language, "brand.tagline")}</span>
        </Link>

        <div className="flex items-stretch bg-surface1">
          <Divider orientation="vertical" className="bg-foreground/20" />

          <Button
            variant="dark"
            className="h-full rounded-none px-5 py-5"
            onClick={() => {
              navigate("/chat")
            }}
          >
            {t(language, "header.askAi")}
          </Button>

          <Divider orientation="vertical" className="bg-foreground/20" />

          <div className="flex items-stretch gap-4 px-5">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={
                language === "en"
                  ? "font-bold text-foreground"
                  : "font-medium text-foreground/60 hover:text-foreground"
              }
            >
              {t(language, "language.enShort")}
            </button>
            <Divider orientation="vertical" className="my-5 bg-foreground/20" />
            <button
              type="button"
              onClick={() => setLanguage("es")}
              className={
                language === "es"
                  ? "font-bold text-foreground"
                  : "font-medium text-foreground/60 hover:text-foreground"
              }
            >
              {t(language, "language.esShort")}
            </button>
          </div>

          <Divider orientation="vertical" className="bg-foreground/20" />

          <IconButton label={t(language, "header.searchA11y")}>
            <svg width="24" height="24" viewBox="0 0 24 24" className="text-foreground" aria-hidden="true">
              <path
                fill="currentColor"
                d="M10 2a8 8 0 1 1 4.9 14.3l4.4 4.4-1.4 1.4-4.4-4.4A8 8 0 0 1 10 2Zm0 2a6 6 0 1 0 0 12a6 6 0 0 0 0-12Z"
              />
            </svg>
          </IconButton>

          <Divider orientation="vertical" className="bg-foreground/20" />

          <IconButton label={t(language, "header.menuA11y")}>
            <svg width="24" height="24" viewBox="0 0 24 24" className="text-foreground" aria-hidden="true">
              <path fill="currentColor" d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z" />
            </svg>
          </IconButton>
        </div>
      </div>
    </header>
  )
}

