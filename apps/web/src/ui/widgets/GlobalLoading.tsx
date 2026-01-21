import React, { useEffect, useRef } from "react"
import Lottie, { LottieRefCurrentProps } from "lottie-react"
import logoLoadingAnimation from "../../assets/lottie/VHWDA Logo Loading.json"
import { useGlobalLoadingStore } from "../../zustand/useGlobalLoadingStore"

export function GlobalLoading() {
  const { isLoading } = useGlobalLoadingStore()
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  // Restart animation from beginning whenever loading becomes active
  useEffect(() => {
    if (isLoading) {
      lottieRef.current?.goToAndPlay(0)
    }
  }, [isLoading])

  return (
    <div className="fixed bottom-0 left-0 right-0 top-[75px] z-[999] bg-surface px-[50px]">
      <div className="site-grid-container flex h-full items-center justify-center border-b-[0.5px] border-foreground">
        <div className="w-[282px] max-w-[90vw]">
          <Lottie
            lottieRef={lottieRef}
            animationData={logoLoadingAnimation}
            loop={true}
            autoplay={true}
          />
        </div>
      </div>
    </div>
  )
}

