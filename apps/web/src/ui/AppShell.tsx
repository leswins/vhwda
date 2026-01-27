import React, { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigation } from "react-router-dom"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { useGlobalLoadingStore } from "../zustand/useGlobalLoadingStore"
import { t } from "../utils/i18n"
import { trackPageView } from "../utils/analytics"
import { Footer } from "./widgets/Footer"
import { NavHeader } from "./widgets/NavHeader"
import { GlobalLoading } from "./widgets/GlobalLoading"

export function AppShell() {
  const { language } = useLanguageStore()
  const navigation = useNavigation()
  const location = useLocation()
  const { isLoading, setLoading } = useGlobalLoadingStore()
  const [contentVisible, setContentVisible] = useState(true)

  useEffect(() => {
    document.title = t(language, "app.title")
  }, [language])

  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`
    trackPageView({
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
      language
    })
  }, [language, location.hash, location.pathname, location.search])

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
    }
  }, [navigation.state, setLoading])

  // Sync content visibility with global loading state
  useEffect(() => {
    if (!isLoading && navigation.state === "idle") {
      const timer = setTimeout(() => {
        setContentVisible(true)
      }, 50)
      return () => clearTimeout(timer)
    } else {
      setContentVisible(false)
    }
  }, [isLoading, navigation.state])

  // Handle scroll locking when loading
  useEffect(() => {
    if (isLoading) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" })
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isLoading])

  return (
    <div className="flex min-h-screen flex-col bg-surface text-foreground overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-surface focus:px-3 focus:py-2 focus:text-foreground"
      >
        {t(language, "a11y.skipToContent")}
      </a>
      <NavHeader />
      <main id="main" className="flex-1 px-0 lg:px-[50px]">
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


