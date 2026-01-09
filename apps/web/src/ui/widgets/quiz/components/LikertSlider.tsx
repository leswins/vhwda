import React, { useState } from "react"
import { t } from "../../../../utils/i18n"

type LikertSliderProps = {
    questionId: string
    value: number | null
    onChange: (questionId: string, value: string) => void
    language: "en" | "es"
}

export function LikertSlider({ questionId, value, onChange, language }: LikertSliderProps) {
    const [sliderValue, setSliderValue] = useState(value ?? 3)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value)
        setSliderValue(newValue)
        // Convert slider value to option ID (assuming options are named "1", "2", "3", "4", "5")
        onChange(questionId, newValue.toString())
    }

    return (
        <div className="flex flex-col gap-[32px] items-center w-full max-w-[530px]">
            <p className="text-sm font-medium text-on-surface-tertiary text-center tracking-tight leading-snug">
                {t(language, "quiz.adjustSlider")}
            </p>
            <div className="flex items-center justify-center gap-[24px] w-full">
                {/* Dislike icon */}
                <div className="w-[40px] h-[40px] flex items-center justify-center flex-shrink-0">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path
                            d="M12.5 27.5V17.5M7.5 25V20C7.5 18.6193 8.61929 17.5 10 17.5H15.2929C15.9229 17.5 16.5267 17.2471 16.9697 16.7971L27.0303 6.46967C27.4733 6.01997 28.0771 5.76711 28.7071 5.76711H30C31.3807 5.76711 32.5 6.8864 32.5 8.26711V13.2329C32.5 14.6136 31.3807 15.7329 30 15.7329H22.5L25 25H17.5L10 32.5H7.5C6.11929 32.5 5 31.3807 5 30V27.5C5 26.1193 6.11929 25 7.5 25Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-on-surface-primary"
                        />
                    </svg>
                </div>

                {/* Slider track with custom styling */}
                <div className="relative flex-1 h-[30px] flex items-center">
                    <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={sliderValue}
                        onChange={handleChange}
                        className="quiz-slider w-full h-[30px] cursor-pointer appearance-none bg-transparent"
                        style={{
                            background: `linear-gradient(to right, 
                                var(--color-on-surface-primary) 0%, 
                                var(--color-on-surface-primary) ${((sliderValue - 1) / 4) * 100}%, 
                                var(--color-surface-above-1) ${((sliderValue - 1) / 4) * 100}%, 
                                var(--color-surface-above-1) 100%)`,
                        }}
                    />
                </div>

                {/* Like icon */}
                <div className="w-[40px] h-[40px] flex items-center justify-center flex-shrink-0">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path
                            d="M27.5 12.5V22.5M32.5 15V20C32.5 21.3807 31.3807 22.5 30 22.5H24.7071C24.0771 22.5 23.4733 22.7529 23.0303 23.2029L12.9697 33.5303C12.5267 33.98 11.9229 34.2329 11.2929 34.2329H10C8.61929 34.2329 7.5 33.1136 7.5 31.7329V26.7671C7.5 25.3864 8.61929 24.2671 10 24.2671H17.5L15 15H22.5L30 7.5H32.5C33.8807 7.5 35 8.61929 35 10V12.5C35 13.8807 33.8807 15 32.5 15Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-on-surface-primary"
                        />
                    </svg>
                </div>
            </div>
        </div>
    )
}

