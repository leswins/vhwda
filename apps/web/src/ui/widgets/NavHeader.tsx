import React, { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useLanguageStore } from "../../zustand/useLanguageStore"
import { useGlobalSearchStore } from "../../zustand/useGlobalSearchStore"
import { t } from "../../utils/i18n"
import { getLocalizedString } from "../../sanity/queries/careers"
import type { GlobalSearchResult } from "../../sanity/queries/globalSearch"
import { GlobalSearchDropdown } from "./GlobalSearchDropdown"
import { Button } from "../components/Button"
import { Divider } from "../components/Divider"
import { trackEvent, trackOutboundClick } from "../../utils/analytics"
import closeIcon from "../../assets/icons/close.svg"

function AiStarIcon({ className }: { className?: string }) {
  return (
    <svg
      width="210"
      height="210"
      viewBox="0 0 210 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M128.285 81.7148L200.001 110L128.285 138.284L100.001 210L71.7158 138.284L0 110L71.7158 81.7148L100.001 10L128.285 81.7148ZM192.071 17.9287L210.001 25L192.071 32.0703L185.001 50L177.93 32.0703L160.001 25L177.93 17.9287L185.001 0L192.071 17.9287Z"
        fill="currentColor"
      />
    </svg>
  )
}

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
      className="inline-flex w-[75px] items-center justify-center text-foreground transition-colors duration-250 ease-out hover:bg-surface2"
    >
      {children}
    </button>
  )
}

export function NavHeader() {
  const { language, setLanguage } = useLanguageStore()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    careers,
    scholarships,
    organizations,
    loading: isSearchLoading,
    initialized,
    fetchSearchData
  } = useGlobalSearchStore()
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement | null>(null)

  const isChatOpen = location.pathname === "/chat"

  /**
   * Lazily load global search data on first search activation.
   */
  useEffect(() => {
    if (isSearchActive && !initialized) {
      fetchSearchData()
    }
  }, [fetchSearchData, initialized, isSearchActive])

  /**
   * Close the search UI when the user clicks outside the header search area.
   */
  useEffect(() => {
    if (!isSearchActive) return

    const handleOutsideClick = (event: MouseEvent) => {
      if (!searchContainerRef.current) return
      if (!searchContainerRef.current.contains(event.target as Node)) {
        handleCloseSearch()
      }
    }

    window.addEventListener("mousedown", handleOutsideClick)
    return () => window.removeEventListener("mousedown", handleOutsideClick)
  }, [isSearchActive])

  /**
   * Clear search UI and restore default navigation state.
   */
  const handleCloseSearch = () => {
    setIsSearchActive(false)
    setSearchQuery("")
    setShowDropdown(false)
  }

  /**
   * Filters content across careers, scholarships, and organizations.
   * Returns a mixed list capped at 5 results per content type.
   */
  const filteredResults = useMemo<GlobalSearchResult[]>(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return []

    const careerResults = careers
      .filter(career => {
        const title = getLocalizedString(language, career.title)?.toLowerCase() || ""
        return title.includes(query)
      })
      .slice(0, 5)

    const scholarshipResults = scholarships
      .filter(scholarship => scholarship.name?.toLowerCase().includes(query))
      .slice(0, 5)

    const organizationResults = organizations
      .filter(organization => organization.name?.toLowerCase().includes(query))
      .slice(0, 5)

    return [...careerResults, ...scholarshipResults, ...organizationResults]
  }, [careers, scholarships, organizations, language, searchQuery])

  useEffect(() => {
    const query = searchQuery.trim()
    if (!query) return
    const timer = window.setTimeout(() => {
      trackEvent("career_search", {
        source: "global_search",
        query,
        results_count: filteredResults.length,
        language
      })
    }, 400)
    return () => window.clearTimeout(timer)
  }, [filteredResults.length, language, searchQuery])

  const handleResultClick = (result: GlobalSearchResult) => {
    if (result._type === "career") {
      trackEvent("career_click", {
        source: "global_search",
        career_id: result._id,
        career_slug: result.slug ?? undefined,
        career_title: getLocalizedString(language, result.title) ?? undefined,
        language
      })
      navigate(`/careers/${result.slug || result._id}`)
      handleCloseSearch()
      return
    }

    const externalLink = result.link
    if (externalLink) {
      trackOutboundClick({
        outbound_url: externalLink,
        resource_type: result._type,
        resource_id: result._id,
        resource_title: result.name,
        language
      })
      window.open(externalLink, "_blank", "noopener,noreferrer")
    }

    handleCloseSearch()
  }

  return (
    <header className="relative z-[1000] bg-surface text-foreground px-fluid-50 border-t-[0.5px] border-foreground">
      <div className="site-grid-container relative flex h-[75px] items-stretch justify-between border-b">
        <Link to="/" className="flex items-center px-fluid-30" aria-label={t(language, "brand.name")}>
          <svg width="150" height="41" viewBox="0 0 404 111" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M130.787 87.5906C134.824 87.5908 138.388 89.6401 140.281 92.794L136.529 94.9706C135.456 93.015 133.31 91.816 130.787 91.8158C126.466 91.8158 123.628 94.813 123.627 99.0708C123.627 103.298 126.465 106.296 130.787 106.296C133.31 106.296 135.488 105.098 136.529 103.174L140.281 105.351C138.42 108.504 134.856 110.554 130.787 110.554C124.1 110.554 119.304 105.506 119.304 99.0708C119.304 92.6049 124.1 87.5906 130.787 87.5906Z" fill="currentColor" />
            <path d="M242.836 87.5906C246.463 87.5906 249.238 89.4507 250.721 92.5413L247.064 94.6554C246.275 92.9836 245.075 91.8158 242.836 91.8158C241.006 91.8159 239.934 92.7633 239.934 94.025C239.934 95.3814 240.785 96.1079 244.129 97.1173C247.63 98.2214 251.351 99.3888 251.351 103.9C251.351 108.031 248.041 110.554 243.341 110.554C238.831 110.554 235.864 108.378 234.665 105.098L238.388 102.921C239.176 104.971 240.722 106.296 243.466 106.296C246.084 106.296 246.998 105.192 246.998 103.962C246.998 102.322 245.518 101.691 242.238 100.745C238.863 99.767 235.581 98.3453 235.581 94.1499C235.581 89.9869 239.051 87.5908 242.836 87.5906Z" fill="currentColor" />
            <path d="M272.552 87.5906C276.589 87.5909 280.153 89.6401 282.046 92.794L278.293 94.9706C277.221 93.015 275.075 91.816 272.552 91.8158C268.23 91.8158 265.392 94.813 265.392 99.0708C265.392 103.298 268.23 106.296 272.552 106.296C275.075 106.296 277.252 105.098 278.293 103.174L282.046 105.351C280.184 108.504 276.62 110.554 272.552 110.554C265.864 110.554 261.068 105.506 261.068 99.0708C261.069 92.6049 265.865 87.5906 272.552 87.5906Z" fill="currentColor" />
            <path fillRule="evenodd" clipRule="evenodd" d="M364.934 87.5906C371.306 87.5907 376.417 92.6049 376.418 99.0708C376.418 105.506 371.306 110.554 364.934 110.554C358.562 110.554 353.484 105.506 353.484 99.0708C353.485 92.6049 358.563 87.5906 364.934 87.5906ZM364.934 91.8158C360.929 91.8158 357.805 94.813 357.804 99.0708C357.804 103.298 360.928 106.296 364.934 106.296C368.94 106.296 372.065 103.298 372.065 99.0708C372.064 94.8131 368.94 91.8159 364.934 91.8158Z" fill="currentColor" />
            <path d="M390.045 87.5906C394.239 87.5911 397.802 89.7039 399.663 92.7316L395.941 94.8754C394.931 93.1097 392.692 91.8159 390.012 91.8158C385.816 91.8158 382.787 94.9082 382.787 99.1036C382.787 103.204 385.722 106.296 390.327 106.296C393.797 106.296 396.004 104.624 396.761 102.101H390.074V98.2532H401.147V99.9539C401.147 106.326 396.635 110.554 390.294 110.554C383.387 110.553 378.466 105.412 378.466 99.1036C378.466 92.7001 383.452 87.5906 390.045 87.5906Z" fill="currentColor" />
            <path d="M6.65459 96.8022H14.8552V88.0307H19.1755V110.114H14.8552V100.965H6.65459V110.114H2.30157V88.0307H6.65459V96.8022Z" fill="currentColor" />
            <path d="M36.7778 92.1964H27.6317V96.8943H35.9899V100.998H27.6317V105.948H36.9384V110.114H23.2787V88.0307H36.7778V92.1964Z" fill="currentColor" />
            <path fillRule="evenodd" clipRule="evenodd" d="M59.2714 110.114H54.5378L53.2147 106.139H44.4135L43.0874 110.114H38.3894L46.1172 88.0307H51.5109L59.2714 110.114ZM45.802 102.068H51.8588L48.8289 93.0468L45.802 102.068Z" fill="currentColor" />
            <path d="M65.7683 105.948H74.1889V110.114H61.4152V88.0307H65.7683V105.948Z" fill="currentColor" />
            <path d="M89.02 92.1964H83.0584V110.114H78.7054V92.1964H72.7735V88.0307H89.02V92.1964Z" fill="currentColor" />
            <path d="M95.8023 96.8022H104.003V88.0307H108.326V110.114H104.003V100.965H95.8023V110.114H91.4493V88.0307H95.8023V96.8022Z" fill="currentColor" />
            <path fillRule="evenodd" clipRule="evenodd" d="M161.79 110.114H157.057L155.734 106.139H146.932L145.606 110.114H140.908L148.636 88.0307H154.03L161.79 110.114ZM148.321 102.068H154.378L151.348 93.0468L148.321 102.068Z" fill="currentColor" />
            <path fillRule="evenodd" clipRule="evenodd" d="M172.765 88.0307C176.834 88.0307 180.115 91.3135 180.115 95.3511C180.115 98.1265 178.381 100.619 175.857 101.786L180.746 110.114H176.048L171.6 102.449H168.287V110.114H163.934V88.0307H172.765ZM168.287 98.6308H172.765C174.405 98.6308 175.762 97.1801 175.762 95.3511C175.762 93.5216 174.405 92.1013 172.765 92.1013H168.287V98.6308Z" fill="currentColor" />
            <path d="M196.811 92.1964H187.662V96.8943H196.023V100.998H187.662V105.948H196.968V110.114H183.309V88.0307H196.811V92.1964Z" fill="currentColor" />
            <path d="M213.539 92.1964H204.39V96.8943H212.748V100.998H204.39V105.948H213.697V110.114H200.037V88.0307H213.539V92.1964Z" fill="currentColor" />
            <path fillRule="evenodd" clipRule="evenodd" d="M225.596 88.0307C229.665 88.0307 232.946 91.3135 232.946 95.3511C232.946 98.1265 231.211 100.619 228.688 101.786L233.577 110.114H228.876L224.431 102.449H221.118V110.114H216.765V88.0307H225.596ZM221.118 98.6308H225.596C227.236 98.6308 228.593 97.1801 228.593 95.3511C228.593 93.5216 227.236 92.1013 225.596 92.1013H221.118V98.6308Z" fill="currentColor" />
            <path fillRule="evenodd" clipRule="evenodd" d="M303.555 110.114H298.821L297.498 106.139H288.697L287.371 110.114H282.673L290.401 88.0307H295.794L303.555 110.114ZM290.086 102.068H296.142L293.112 93.0468L290.086 102.068Z" fill="currentColor" />
            <path d="M318.701 92.1964H312.74V110.114H308.387V92.1964H302.455V88.0307H318.701V92.1964Z" fill="currentColor" />
            <path fillRule="evenodd" clipRule="evenodd" d="M338.456 110.114H333.726L332.4 106.139H323.599L322.272 110.114H317.574L325.302 88.0307H330.696L338.456 110.114ZM324.987 102.068H331.044L328.014 93.0468L324.987 102.068Z" fill="currentColor" />
            <path d="M344.953 105.948H353.377V110.114H340.6V88.0307H344.953V105.948Z" fill="currentColor" />
            <path fillRule="evenodd" clipRule="evenodd" d="M282.863 0.0336789C294.483 -0.236311 304.133 1.04322 314.943 6.56321C321.57 9.94988 326.578 15.0996 329.964 22.0129C332.114 26.402 332.374 28.9124 332.804 33.9212C333.484 41.7679 331.285 49.1185 326.212 55.9718C319.762 64.6718 307.512 69.5741 296.722 71.2341C286.063 72.8739 276.703 72.4015 265.514 71.8615C265.293 71.8512 265.084 71.757 264.931 71.5969C264.778 71.4367 264.693 71.2235 264.693 71.0022V2.17154C264.694 2.02939 264.724 1.88777 264.782 1.75824C264.84 1.62873 264.926 1.51351 265.032 1.41927C265.138 1.32494 265.263 1.25358 265.398 1.21114C265.532 1.16901 265.674 1.1556 265.814 1.17248C268.103 1.44212 269.813 0.253806 271.963 0.253709C272.736 0.253709 276.37 0.180346 282.863 0.0336789ZM284.065 15.3912C283.966 15.3898 283.867 15.4085 283.776 15.4447C283.685 15.4812 283.6 15.5365 283.529 15.6052C283.459 15.6739 283.402 15.7557 283.363 15.8461C283.324 15.9362 283.305 16.0335 283.303 16.1315L283.244 55.3741C283.243 55.472 283.261 55.5686 283.297 55.6596C283.334 55.751 283.386 55.8358 283.455 55.9064C283.524 55.9768 283.606 56.034 283.696 56.0729C283.786 56.1118 283.886 56.131 283.984 56.1323L290.692 56.1413C293.616 56.1472 296.514 55.6748 299.217 54.7497C301.92 53.8247 304.377 52.4655 306.448 50.7505C308.519 49.0355 310.163 46.997 311.286 44.7532C312.408 42.5098 312.988 40.1041 312.992 37.6736V33.9539C313.001 29.0457 310.666 24.3319 306.499 20.8532C302.332 17.3751 296.675 15.415 290.772 15.4031L284.065 15.3912Z" fill="currentColor" />
            <path d="M19.7345 0.931638C20.1788 0.932295 20.6147 1.05701 20.9922 1.29142C21.3703 1.52641 21.6749 1.86471 21.8723 2.26371L48.6327 56.8727C48.8318 57.2769 48.936 57.7227 48.936 58.175C48.9359 58.6273 48.8317 59.0752 48.6327 59.4833C46.7462 63.3697 45.0736 66.5173 43.6136 68.9238C42.8942 70.1136 43.1426 71.8319 41.3539 71.9923C40.1942 72.0923 38.917 72.09 37.5242 71.9834C37.2639 71.9623 37.0111 71.8768 36.7927 71.7336C36.5743 71.5904 36.3954 71.3931 36.2724 71.1627L0.0626141 1.71364C0.0193079 1.63268 -0.00217092 1.54078 0.000173236 1.44901C0.00252645 1.35742 0.0302695 1.26883 0.077481 1.19032C0.124863 1.11169 0.190704 1.04498 0.27075 1.00003C0.350581 0.955232 0.440874 0.931279 0.532407 0.931638H19.7345Z" fill="currentColor" />
            <path d="M208.214 0.1318C208.479 0.131897 208.741 0.208499 208.966 0.35183C209.19 0.495242 209.37 0.701647 209.483 0.943532L225.433 34.8638C225.49 34.9845 225.582 35.0862 225.694 35.1582C225.806 35.2297 225.936 35.2699 226.069 35.2711C226.203 35.2722 226.336 35.2344 226.449 35.1641C226.563 35.0938 226.655 34.9927 226.714 34.8727L243.074 1.46387C243.148 1.30534 243.267 1.17121 243.415 1.07733C243.564 0.983683 243.736 0.931709 243.912 0.931638H261.283C261.391 0.930754 261.5 0.956678 261.598 1.00597C261.695 1.05526 261.777 1.12856 261.842 1.21708C261.906 1.30579 261.949 1.40858 261.966 1.51739C261.984 1.62581 261.975 1.73661 261.943 1.84149C261.656 2.77439 261.267 3.74852 260.774 4.76134C256.534 13.4413 251.995 23.3034 247.162 34.3435C246.948 34.8366 246.466 35.5467 245.714 36.4724C245.496 36.7432 245.331 37.0521 245.232 37.3822C244.492 39.8289 243.304 42.6706 241.664 45.9039C240.364 48.477 239.061 51.2797 237.754 54.3126C236.728 56.726 234.057 62.3772 229.744 71.2638C229.642 71.4766 229.48 71.6557 229.28 71.7812C229.08 71.9065 228.85 71.9718 228.614 71.9715H222.712C222.509 71.9708 222.314 71.9008 222.156 71.7723C221.998 71.6434 221.887 71.4641 221.844 71.2638C221.624 70.2172 221.222 69.0628 220.642 67.8028C214.649 54.7369 210.314 45.3367 207.634 39.6034C207.081 38.4305 206.513 37.4739 205.933 36.734C205.897 36.6864 205.849 36.6479 205.793 36.624C205.738 36.6002 205.676 36.5913 205.615 36.5973C205.555 36.6034 205.496 36.6228 205.446 36.6567C205.394 36.691 205.353 36.7392 205.324 36.7935C203.49 40.1198 202.05 43.2624 201.003 46.2221C200.757 46.9132 200.442 47.5799 200.064 48.2113C198.43 50.9046 197.367 52.9835 196.873 54.4435C194.903 60.3631 192.462 64.3736 189.562 71.2133C189.467 71.4432 189.306 71.6396 189.098 71.7782C188.89 71.9171 188.644 71.992 188.393 71.9923H183.092C182.834 71.9926 182.581 71.9169 182.363 71.7753C182.145 71.6333 181.971 71.4313 181.864 71.1925L151.042 2.38264C150.967 2.21416 150.938 2.02818 150.952 1.84446C150.967 1.66136 151.025 1.48437 151.125 1.33007C151.225 1.17522 151.364 1.04687 151.526 0.958398C151.688 0.870287 151.869 0.822478 152.053 0.821623H169.402C169.787 0.821153 170.163 0.931572 170.488 1.1368C170.811 1.34213 171.072 1.63459 171.234 1.98124L186.083 33.5733C186.154 33.7212 186.265 33.8456 186.404 33.9331C186.543 34.0207 186.704 34.0669 186.868 34.0669C187.032 34.0669 187.193 34.0207 187.332 33.9331C187.47 33.8457 187.582 33.7212 187.653 33.5733L202.984 0.762156C203.07 0.574097 203.21 0.415843 203.385 0.304256C203.56 0.192558 203.765 0.131406 203.974 0.1318H208.214Z" fill="currentColor" />
            <path d="M146.543 1.03273C146.813 1.03273 147.074 1.13883 147.265 1.33007C147.457 1.52135 147.563 1.78209 147.563 2.0526V70.8119C147.563 71.0956 147.451 71.3694 147.251 71.5701C147.05 71.7708 146.776 71.8823 146.492 71.8823H130.344C129.967 71.8823 129.605 71.7323 129.339 71.466C129.073 71.2001 128.923 70.84 128.923 70.464V43.6828C128.923 43.4797 128.845 43.2843 128.706 43.1387C128.566 42.9931 128.374 42.9091 128.173 42.9038C127.613 42.8838 123.28 42.8763 115.174 42.883C107.067 42.883 102.729 42.8905 102.162 42.9038C101.962 42.9092 101.77 42.9932 101.63 43.1387C101.491 43.2843 101.413 43.4798 101.413 43.6828L101.422 70.464C101.422 70.8401 101.272 71.2 101.006 71.466C100.74 71.732 100.38 71.8821 100.004 71.8823L83.8523 71.8912C83.5689 71.891 83.2976 71.7794 83.0971 71.579C82.8967 71.3786 82.7822 71.1072 82.7819 70.8238L82.7641 2.06152C82.7644 1.79163 82.8707 1.53294 83.0614 1.34196C83.2527 1.15068 83.5134 1.04165 83.7839 1.04165L100.313 1.03273C100.471 1.03255 100.626 1.08665 100.747 1.18735C100.868 1.28802 100.947 1.42905 100.973 1.58281C101.213 2.98267 101.335 4.48918 101.342 6.10234C101.368 15.8557 101.383 22.8761 101.383 27.1628C101.383 28.316 102.247 28.8955 103.973 28.9022H115.162C120.608 28.9022 124.343 28.8999 126.363 28.8933C128.089 28.8933 128.952 28.316 128.952 27.1628C128.952 22.8761 128.962 15.8557 128.982 6.10234C128.989 4.48913 129.114 2.98271 129.354 1.58281C129.38 1.42889 129.459 1.28804 129.58 1.18735C129.701 1.08669 129.856 1.03256 130.014 1.03273H146.543Z" fill="currentColor" />
            <path fillRule="evenodd" clipRule="evenodd" d="M366.103 0.143694C366.315 0.143082 366.522 0.201018 366.704 0.310203C366.885 0.419506 367.036 0.574577 367.135 0.762156L403.315 70.134C403.407 70.3106 403.452 70.5085 403.446 70.7078C403.439 70.9074 403.382 71.1019 403.279 71.2728C403.175 71.4438 403.028 71.5852 402.854 71.6831C402.679 71.781 402.483 71.8323 402.283 71.8318H384.392C384.181 71.8322 383.973 71.7744 383.792 71.6652C383.61 71.5561 383.462 71.4004 383.363 71.2133L379.352 63.5123C379.254 63.325 379.105 63.1695 378.924 63.0603C378.743 62.951 378.535 62.8932 378.323 62.8938H349.172C348.961 62.8933 348.753 62.9511 348.572 63.0603C348.391 63.1695 348.242 63.3251 348.144 63.5123L344.094 71.2341C343.995 71.421 343.847 71.5769 343.666 71.6861C343.484 71.7954 343.274 71.8532 343.062 71.8526H324.853C324.653 71.8531 324.457 71.8017 324.282 71.7039C324.108 71.606 323.961 71.4647 323.857 71.2936C323.754 71.1228 323.697 70.9281 323.691 70.7286C323.685 70.5287 323.731 70.3288 323.824 70.1518L360.254 0.762156C360.353 0.574942 360.501 0.419348 360.682 0.310203C360.864 0.200925 361.071 0.143108 361.283 0.143694H366.103ZM363.653 32.1461C363.555 32.1462 363.459 32.174 363.376 32.2264C363.293 32.2791 363.225 32.3545 363.183 32.4435L357.162 44.9733C356.996 45.3257 356.848 45.6892 356.722 46.0615L355.794 48.7435C355.773 48.8024 355.765 48.866 355.773 48.9279C355.782 48.9889 355.806 49.0469 355.842 49.0973C355.878 49.1483 355.929 49.1907 355.985 49.2192C356.04 49.2474 356.101 49.2642 356.163 49.2638H371.422C371.488 49.2637 371.555 49.2454 371.613 49.2133C371.67 49.1813 371.718 49.135 371.752 49.0795C371.787 49.0235 371.808 48.9581 371.812 48.8922C371.815 48.8268 371.802 48.7608 371.773 48.7019L364.123 32.4435C364.081 32.3548 364.015 32.279 363.932 32.2264C363.849 32.1737 363.751 32.1461 363.653 32.1461Z" fill="currentColor" />
            <path d="M79.4815 0.500499C79.527 0.525515 79.5672 0.560328 79.5944 0.604567C79.6217 0.648967 79.6374 0.701169 79.639 0.753236C79.6407 0.804903 79.6274 0.856129 79.6034 0.901904L62.7324 33.0233C62.707 33.0692 62.6703 33.1091 62.6254 33.1363C62.5806 33.1632 62.529 33.1767 62.4767 33.1779C62.424 33.1789 62.3712 33.1648 62.3251 33.1392C62.2792 33.1137 62.2392 33.0772 62.2121 33.0322L44.8922 1.14275C44.8684 1.09749 44.8583 1.04522 44.8595 0.994079C44.8609 0.943531 44.8755 0.894955 44.9011 0.851357C44.9272 0.807236 44.9639 0.770107 45.0082 0.744315C45.0524 0.718592 45.1027 0.703593 45.1538 0.702688L79.3328 0.461845C79.3848 0.461032 79.4359 0.475491 79.4815 0.500499Z" fill="currentColor" />
          </svg>
        </Link>

        <div
          className="relative flex flex-1 items-stretch justify-end"
          ref={searchContainerRef}
        >
          <Divider orientation="vertical" className="bg-foreground" />

          {/* Default navigation controls */}
          <div
            className={`flex items-stretch bg-surface1 transition-opacity duration-250 ease-out ${isSearchActive ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
          >
            {!isMenuOpen && (
              <div className="relative flex items-stretch overflow-hidden">
                <div
                  className={`flex items-stretch transition-all duration-250 ease-out ${isChatOpen ? "opacity-100" : "pointer-events-none absolute left-0 inset-y-0 w-max opacity-0"
                    }`}
                >
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="flex h-full items-center gap-fluid-10 bg-surface px-5 py-5 text-base font-semibold text-foreground hover:bg-surface2 whitespace-nowrap"
                    style={{
                      fontSize: "var(--text-body-base)",
                      lineHeight: "var(--leading-body-base)",
                      letterSpacing: "var(--tracking-body-base)"
                    }}
                  >
                    {t(language, "header.closeAiChat")}
                    <div className="flex h-icon-30 w-icon-30 items-center justify-center">
                      <img src={closeIcon} alt="" className="h-[17px] w-[17px]" />
                    </div>
                  </button>
                </div>

                <div
                  className={`flex items-stretch transition-all duration-250 ease-out ${!isChatOpen ? "opacity-100" : "pointer-events-none absolute left-0 inset-y-0 w-max opacity-0"
                    }`}
                >
                  <Button
                    variant="dark"
                    className="h-full rounded-none px-8 text-base font-semibold whitespace-nowrap flex items-center gap-3"
                    onClick={() => {
                      navigate("/chat")
                    }}
                  >
                    {t(language, "header.askAi")}
                    <AiStarIcon className="w-icon-25 h-icon-25 text-accentBlue" />
                  </Button>
                </div>
                <Divider orientation="vertical" className="bg-foreground" />
              </div>
            )}

            <div className="flex items-center gap-fluid-15 px-fluid-15 py-fluid-15">
              <button
                type="button"
                onClick={() => {
                  trackEvent("language_change", {
                    language: "en",
                    previous_language: language
                  })
                  setLanguage("en")
                }}
                className={`flex items-center justify-center transition-all duration-250 ease-out ${language === "en"
                  ? "text-base font-bold text-foreground"
                  : "text-base font-medium text-foreground/60 hover:text-foreground"
                  }`}
              >
                {t(language, "language.enShort")}
              </button>
              <Divider orientation="vertical" className="h-5 bg-foreground" />
              <button
                type="button"
                onClick={() => {
                  trackEvent("language_change", {
                    language: "es",
                    previous_language: language
                  })
                  setLanguage("es")
                }}
                className={`flex items-center justify-center transition-all duration-250 ease-out ${language === "es"
                  ? "text-base font-bold text-foreground"
                  : "text-base font-medium text-foreground/60 hover:text-foreground"
                  }`}
              >
                {t(language, "language.esShort")}
              </button>
            </div>

            <Divider orientation="vertical" className="bg-foreground" />

            {!isMenuOpen && (
              <>
                <IconButton
                  label={t(language, "header.searchA11y")}
                  onClick={() => {
                    setIsSearchActive(true)
                    setShowDropdown(true)
                    setIsMenuOpen(false)
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 35 35"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M32.2778 35L20.0278 22.75C19.0556 23.5278 17.9375 24.1435 16.6736 24.5972C15.4097 25.0509 14.0648 25.2778 12.6389 25.2778C9.10648 25.2778 6.11722 24.0541 3.67111 21.6067C1.225 19.1593 0.00129733 16.17 1.02881e-06 12.6389C-0.00129527 9.10778 1.22241 6.11852 3.67111 3.67111C6.11982 1.2237 9.10907 0 12.6389 0C16.1687 0 19.1586 1.2237 21.6086 3.67111C24.0586 6.11852 25.2817 9.10778 25.2778 12.6389C25.2778 14.0648 25.0509 15.4097 24.5972 16.6736C24.1435 17.9375 23.5278 19.0556 22.75 20.0278L35 32.2778L32.2778 35ZM12.6389 21.3889C15.0694 21.3889 17.1357 20.5385 18.8378 18.8378C20.5398 17.137 21.3902 15.0707 21.3889 12.6389C21.3876 10.207 20.5372 8.14139 18.8378 6.44194C17.1383 4.7425 15.072 3.89148 12.6389 3.88889C10.2057 3.8863 8.14009 4.73732 6.44195 6.44194C4.7438 8.14657 3.89278 10.2122 3.88889 12.6389C3.885 15.0656 4.73602 17.1319 6.44195 18.8378C8.14787 20.5437 10.2135 21.3941 12.6389 21.3889Z" />
                  </svg>
                </IconButton>
                <Divider orientation="vertical" className="bg-foreground" />
              </>
            )}

            <div className="relative flex items-stretch">
              <div
                className={`flex items-stretch transition-all duration-250 ease-out ${isMenuOpen ? "opacity-100" : "pointer-events-none absolute right-0 inset-y-0 w-max opacity-0"
                  }`}
              >
                <div className="flex items-stretch">
                  <div className="flex items-center bg-foreground px-8 text-base font-semibold text-surface whitespace-nowrap">
                    {t(language, "header.selectAPage")}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex w-[75px] items-center justify-center bg-surface border-l border-foreground hover:bg-surface2 transition-colors duration-250 ease-out"
                  >
                    <img src={closeIcon} alt="" className="h-[17px] w-[17px]" />
                  </button>
                </div>
              </div>

              <div
                className={`flex items-stretch transition-all duration-250 ease-out ${!isMenuOpen ? "opacity-100" : "pointer-events-none absolute right-0 inset-y-0 w-max opacity-0"
                  }`}
              >
                <IconButton
                  label={t(language, "header.menuA11y")}
                  onClick={() => {
                    setIsMenuOpen(true)
                    if (isSearchActive) handleCloseSearch()
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 35 35"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M35 35H0V30H35V35ZM35 20H0V15H35V20ZM35 5H0V0H35V5Z" />
                  </svg>
                </IconButton>
              </div>
            </div>
          </div>

          {/* Search state overlay */}
          <div
            className={`absolute inset-0 flex items-stretch bg-surface1 transition-all duration-250 ease-out ${isSearchActive ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
          >
            <div className="relative flex flex-1 items-stretch">
              <div className="flex h-full w-[75px] items-center justify-center border-l-[0.5px] border-foreground text-foreground">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 35 35"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M32.2778 35L20.0278 22.75C19.0556 23.5278 17.9375 24.1435 16.6736 24.5972C15.4097 25.0509 14.0648 25.2778 12.6389 25.2778C9.10648 25.2778 6.11722 24.0541 3.67111 21.6067C1.225 19.1593 0.00129733 16.17 1.02881e-06 12.6389C-0.00129527 9.10778 1.22241 6.11852 3.67111 3.67111C6.11982 1.2237 9.10907 0 12.6389 0C16.1687 0 19.1586 1.2237 21.6086 3.67111C24.0586 6.11852 25.2817 9.10778 25.2778 12.6389C25.2778 14.0648 25.0509 15.4097 24.5972 16.6736C24.1435 17.9375 23.5278 19.0556 22.75 20.0278L35 32.2778L32.2778 35ZM12.6389 21.3889C15.0694 21.3889 17.1357 20.5385 18.8378 18.8378C20.5398 17.137 21.3902 15.0707 21.3889 12.6389C21.3876 10.207 20.5372 8.14139 18.8378 6.44194C17.1383 4.7425 15.072 3.89148 12.6389 3.88889C10.2057 3.8863 8.14009 4.73732 6.44195 6.44194C4.7438 8.14657 3.89278 10.2122 3.88889 12.6389C3.885 15.0656 4.73602 17.1319 6.44195 18.8378C8.14787 20.5437 10.2135 21.3941 12.6389 21.3889Z" />
                </svg>
              </div>

              <div className="flex flex-1 items-center pr-fluid-20">
                <input
                  type="text"
                  value={searchQuery}
                  placeholder={t(language, "header.searchPlaceholder")}
                  aria-label={t(language, "header.searchFieldA11y")}
                  onChange={(event) => {
                    setSearchQuery(event.target.value)
                    setShowDropdown(true)
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      handleCloseSearch()
                    }
                  }}
                  autoFocus={isSearchActive}
                  className="w-full border-0 bg-transparent text-body-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-0"
                />
              </div>

              {showDropdown && searchQuery.trim().length > 0 && (
                <GlobalSearchDropdown
                  searchQuery={searchQuery}
                  results={filteredResults}
                  language={language}
                  isLoading={isSearchLoading}
                  onResultClick={handleResultClick}
                />
              )}
            </div>

            <Divider orientation="vertical" className="bg-foreground" />

            <IconButton
              label={t(language, "header.searchCloseA11y")}
              onClick={handleCloseSearch}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="text-[rgb(var(--color-accent-orange))]"
              >
                <path
                  d="M0.79541 0.795532L15.7954 15.7955M0.79541 15.7955L15.7954 0.795532"
                  stroke="currentColor"
                  strokeWidth="2.25"
                />
              </svg>
            </IconButton>
          </div>
        </div>

        {/* Absolute menu list anchored to site-grid-container */}
        <div
          className={`absolute right-0 top-full z-[1001] flex h-[75px] items-stretch border border-foreground bg-surface transition-all duration-250 ease-out ${isMenuOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
            }`}
        >
          {[
            { label: t(language, "header.menu.home"), path: "/" },
            { label: t(language, "header.menu.quiz"), path: "/quiz" },
            { label: t(language, "header.menu.careers"), path: "/careers" },
            { label: t(language, "header.menu.resources"), path: "/resources" },
            { label: t(language, "header.menu.about"), path: "/about" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center border-r border-foreground px-10 text-base font-bold text-foreground hover:bg-surface2 last:border-r-0 transition-colors duration-250 ease-out"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}

