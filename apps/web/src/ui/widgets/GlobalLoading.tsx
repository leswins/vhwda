import React from "react"
import Lottie from "lottie-react"
import logoLoadingAnimation from "../../assets/lottie/VHWDA Logo Loading.json"

export function GlobalLoading() {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-[75px] z-[999] bg-surface px-[50px]">
      <div className="site-grid-container flex h-full items-center justify-center border-b-[0.5px] border-foreground">
        <div className="w-[403px] max-w-[90vw]">
          <Lottie
            animationData={logoLoadingAnimation}
            loop={true}
            autoplay={true}
          />
        </div>
      </div>
    </div>
  )
}

