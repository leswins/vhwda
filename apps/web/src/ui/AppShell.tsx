import React, { useEffect, useState } from "react"
import { Outlet, useNavigation } from "react-router-dom"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { useGlobalLoadingStore } from "../zustand/useGlobalLoadingStore"
import { t } from "../utils/i18n"
import { Footer } from "./widgets/Footer"
import { NavHeader } from "./widgets/NavHeader"
import { GlobalLoading } from "./widgets/GlobalLoading"

export function AppShell() {
  const { language } = useLanguageStore()
  const navigation = useNavigation()
  const { isLoading, setLoading } = useGlobalLoadingStore()
  const [contentVisible, setContentVisible] = useState(true)

  useEffect(() => {
    document.title = t(language, "app.title")
  }, [language])

  // Track navigation state and update loading
  useEffect(() => {
    if (navigation.state === "loading") {
      setContentVisible(false)
      // Wait for fade-out animation before showing loading
      const timer = setTimeout(() => {
        setLoading(true)
      }, 250)
      return () => clearTimeout(timer)
    } else if (navigation.state === "idle") {
      setLoading(false)
      // Wait a moment before fading content back in
      const timer = setTimeout(() => {
        setContentVisible(true)
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [navigation.state, setLoading])

  // Handle scroll locking when loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isLoading])

  return (
    <div className="flex min-h-screen flex-col bg-surface text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-surface focus:px-3 focus:py-2 focus:text-foreground"
      >
        {t(language, "a11y.skipToContent")}
      </a>
      <NavHeader />
      <main id="main" className="flex-1 px-[50px]">
        <div
          className="site-grid-container min-h-full transition-opacity duration-250 ease-out"
          style={{ opacity: contentVisible ? 1 : 0 }}
        >
          <Outlet />
        </div>
      </main>
      <Footer />
      
      {/* Global Loading Overlay */}
      <div
        className="transition-opacity duration-250 ease-out"
        style={{ 
          opacity: isLoading ? 1 : 0,
          pointerEvents: isLoading ? 'auto' : 'none'
        }}
      >
        <GlobalLoading />
      </div>
    </div>
  )
}


