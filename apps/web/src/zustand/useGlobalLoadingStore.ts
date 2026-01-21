import { create } from "zustand"

interface GlobalLoadingState {
  isLoading: boolean
  loadingStartTime: number | null
  setLoading: (loading: boolean) => void
}

const MINIMUM_LOADING_DURATION = 1000 // 1 second in milliseconds

export const useGlobalLoadingStore = create<GlobalLoadingState>((set, get) => ({
  isLoading: false,
  loadingStartTime: null,
  setLoading: (loading: boolean) => {
    if (loading) {
      // Starting to load - record the start time
      set({ isLoading: true, loadingStartTime: Date.now() })
    } else {
      // Stopping loading - ensure minimum duration
      const state = get()
      if (state.loadingStartTime === null) {
        // No start time recorded, just hide immediately
        set({ isLoading: false, loadingStartTime: null })
        return
      }

      const elapsed = Date.now() - state.loadingStartTime
      const remaining = MINIMUM_LOADING_DURATION - elapsed

      if (remaining > 0) {
        // Need to wait longer to meet minimum duration
        setTimeout(() => {
          set({ isLoading: false, loadingStartTime: null })
        }, remaining)
      } else {
        // Minimum duration already met, hide immediately
        set({ isLoading: false, loadingStartTime: null })
      }
    }
  }
}))

