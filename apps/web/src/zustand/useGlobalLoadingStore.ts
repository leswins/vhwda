import { create } from "zustand"

interface GlobalLoadingState {
  isLoading: boolean
  loadingStartTime: number | null
  minDurationMs: number
  variant: "default" | "quizResults"
  setLoading: (loading: boolean, options?: { minDurationMs?: number; variant?: GlobalLoadingState["variant"] }) => void
}

const MINIMUM_LOADING_DURATION = 1000 // 1 second in milliseconds

export const useGlobalLoadingStore = create<GlobalLoadingState>((set, get) => ({
  isLoading: false,
  loadingStartTime: null,
  minDurationMs: MINIMUM_LOADING_DURATION,
  variant: "default",
  setLoading: (loading: boolean, options) => {
    if (loading) {
      // Starting to load - record the start time and config
      set({
        isLoading: true,
        loadingStartTime: Date.now(),
        minDurationMs: options?.minDurationMs ?? MINIMUM_LOADING_DURATION,
        variant: options?.variant ?? "default",
      })
    } else {
      // Stopping loading - ensure minimum duration
      const state = get()
      if (state.loadingStartTime === null) {
        // No start time recorded, just hide immediately
        set({ isLoading: false, loadingStartTime: null, minDurationMs: MINIMUM_LOADING_DURATION, variant: "default" })
        return
      }

      const elapsed = Date.now() - state.loadingStartTime
      const remaining = state.minDurationMs - elapsed

      if (remaining > 0) {
        // Need to wait longer to meet minimum duration
        setTimeout(() => {
          set({ isLoading: false, loadingStartTime: null, minDurationMs: MINIMUM_LOADING_DURATION, variant: "default" })
        }, remaining)
      } else {
        // Minimum duration already met, hide immediately
        set({ isLoading: false, loadingStartTime: null, minDurationMs: MINIMUM_LOADING_DURATION, variant: "default" })
      }
    }
  },
}))

