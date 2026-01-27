import React, { useEffect, useRef } from "react"
import Lottie, { LottieRefCurrentProps } from "lottie-react"
import logoLoadingAnimation from "../../assets/lottie/VHWDA Logo Loading.json"
import { useGlobalLoadingStore } from "../../zustand/useGlobalLoadingStore"
import { useLanguageStore } from "../../zustand/useLanguageStore"
import { t } from "../../utils/i18n"

export function GlobalLoading() {
  const { isLoading, variant } = useGlobalLoadingStore()
  const { language } = useLanguageStore()
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  // Restart animation from beginning whenever loading becomes active
  useEffect(() => {
    if (isLoading) {
      lottieRef.current?.goToAndPlay(0)
    }
  }, [isLoading])

  return (
    <div className="fixed bottom-0 left-0 right-0 top-[75px] z-[999] bg-surface px-0 lg:px-[50px]">
      <div className="flex h-full w-full items-center justify-center lg:site-grid-container lg:border-y-[0.5px] lg:border-foreground">
        <div className="flex flex-col items-center px-fluid-20 lg:px-0">
          <div className="w-[200px] lg:w-[282px] max-w-[90vw]">
            <Lottie
              lottieRef={lottieRef}
              animationData={logoLoadingAnimation}
              loop={true}
              autoplay={true}
            />
        </div>
          {variant === "quizResults" && (
            <div className="mt-fluid-20 lg:mt-[25px] text-center px-fluid-20 lg:px-0">
              <h3 className="text-h3 lg:text-h3 text-foreground">{t(language, "quiz.loading.title")}</h3>
              <p className="mt-fluid-10 lg:mt-[10px] text-body-base lg:text-body-lg text-muted">{t(language, "quiz.loading.subtitle")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

