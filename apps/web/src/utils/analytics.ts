type AnalyticsEventName =
  | "page_view"
  | "career_search"
  | "career_filter_apply"
  | "career_sort_change"
  | "career_detail_view"
  | "career_click"
  | "compare_start"
  | "compare_view"
  | "compare_add"
  | "compare_remove"
  | "compare_search"
  | "quiz_start"
  | "quiz_complete"
  | "quiz_results_view"
  | "quiz_recommendation_click"
  | "resource_section_jump"
  | "resource_filter_apply"
  | "resource_search"
  | "resource_click"
  | "outbound_click"
  | "ai_chat_open"
  | "ai_chat_message_sent"
  | "ai_chat_quick_prompt_click"
  | "ai_chat_career_click"
  | "language_change"

type AnalyticsParams = Record<string, string | number | boolean | undefined | null>

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined
const GA_DEBUG_MODE = (import.meta.env.VITE_GA_DEBUG_MODE as string | undefined) === "true"
const IS_ENABLED = Boolean(GA_MEASUREMENT_ID) && (import.meta.env.PROD || GA_DEBUG_MODE)

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    __gaInitialized?: boolean
  }
}

function ensureGtag() {
  if (!IS_ENABLED || !GA_MEASUREMENT_ID || typeof window === "undefined") return

  if (!window.dataLayer) {
    window.dataLayer = []
  }

  if (!window.gtag) {
    window.gtag = function gtag() {
      // Use Array.from to ensure we push a real array, not the arguments object
      window.dataLayer?.push(Array.from(arguments))
    }
  }

  if (!window.__gaInitialized) {
    // 1. "js" call MUST be the first thing to spark the engine
    window.gtag?.("js", new Date())
    
    // 2. config call
    window.gtag?.("config", GA_MEASUREMENT_ID, {
      send_page_view: false,
      debug_mode: GA_DEBUG_MODE ? true : undefined
    })
    
    window.__gaInitialized = true
  }

  if (!document.getElementById("ga4-script")) {
}

export function initAnalytics() {
  ensureGtag()
}

export function trackPageView(params: {
  page_path: string
  page_location?: string
  page_title?: string
  language?: string
}) {
  if (!IS_ENABLED) return
  ensureGtag()

  window.gtag?.("event", "page_view", {
    page_path: params.page_path,
    page_location: params.page_location ?? window.location.href,
    page_title: params.page_title ?? document.title,
    language: params.language,
    debug_mode: GA_DEBUG_MODE ? true : undefined
  })
}

export function trackEvent(name: AnalyticsEventName, params: AnalyticsParams = {}) {
  if (!IS_ENABLED) return
  ensureGtag()
  window.gtag?.("event", name, {
    ...params,
    debug_mode: GA_DEBUG_MODE ? true : undefined
  })
}

export function trackOutboundClick(params: {
  outbound_url: string
  outbound_domain?: string
  resource_type?: string
  resource_id?: string
  resource_title?: string
  career_id?: string
  career_slug?: string
  career_title?: string
  language?: string
}) {
  trackEvent("outbound_click", {
    outbound_url: params.outbound_url,
    outbound_domain: params.outbound_domain ?? getOutboundDomain(params.outbound_url),
    resource_type: params.resource_type,
    resource_id: params.resource_id,
    resource_title: params.resource_title,
    career_id: params.career_id,
    career_slug: params.career_slug,
    career_title: params.career_title,
    language: params.language
  })
}

export function getOutboundDomain(url: string): string | undefined {
  try {
    return new URL(url).hostname
  } catch {
    return undefined
  }
}
