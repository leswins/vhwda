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
    const getPageTitle = () => {
      switch (true) {
        case location.pathname === "/":
          return t(language, "page.title.home")
        case location.pathname === "/careers":
          return t(language, "page.title.careers")
        case location.pathname.startsWith("/careers/"):
          return t(language, "page.title.careerDetail")
        case location.pathname === "/compare":
          return t(language, "page.title.compare")
        case location.pathname === "/quiz":
          return t(language, "page.title.quiz")
        case location.pathname === "/resources":
          return t(language, "page.title.resources")
        case location.pathname === "/chat":
          return t(language, "page.title.chat")
        case location.pathname === "/about":
          return t(language, "page.title.about")
        case location.pathname === "/scholarship-submit":
        case location.pathname === "/resource-submit":
          return t(language, "page.title.resourceSubmit")
        case location.pathname === "/scholarship-portal":
        case location.pathname === "/resource-portal":
          return t(language, "page.title.resourcePortal")
        case location.pathname.startsWith("/teachers"):
          return t(language, "page.title.teachers")
        default:
          return t(language, "app.title")
      }
    }

    const pageTitle = getPageTitle()
    const appTitle = t(language, "app.title")
    document.title = pageTitle === appTitle ? appTitle : `${pageTitle} | ${appTitle}`
  }, [language, location.pathname])

  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`
    if (location.pathname.startsWith("/careers/")) return
    const pageGroup = (() => {
      switch (true) {
        case location.pathname === "/":
          return "home"
        case location.pathname === "/careers":
          return "careers"
        case location.pathname === "/compare":
          return "compare"
        case location.pathname === "/quiz":
          return "quiz"
        case location.pathname === "/resources":
          return "resources"
        case location.pathname === "/chat":
          return "chat"
        case location.pathname === "/about":
          return "about"
        case location.pathname === "/scholarship-submit":
        case location.pathname === "/resource-submit":
          return "resource-submit"
        case location.pathname === "/scholarship-portal":
        case location.pathname === "/resource-portal":
          return "resource-portal"
        case location.pathname.startsWith("/teachers"):
          return "teachers"
        default:
          return "other"
      }
    })()
    trackPageView({
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
      page_group: pageGroup,
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
    <div className="flex min-h-screen flex-col bg-surface text-foreground overflow-x-clip">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-surface focus:px-3 focus:py-2 focus:text-foreground"
      >
        {t(language, "a11y.skipToContent")}
      </a>
      <NavHeader />
      <main id="main" className="flex-1 px-0 lg:px-fluid-50">
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


