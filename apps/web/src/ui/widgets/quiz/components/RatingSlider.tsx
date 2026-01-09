import React, { useState } from "react"
import { t } from "../../../../utils/i18n"

type RatingSliderProps = {
    questionId: string
    value: number | null
    onChange: (questionId: string, value: string) => void
    language: "en" | "es"
}

export function RatingSlider({ questionId, value, onChange, language }: RatingSliderProps) {
    const [sliderValue, setSliderValue] = useState(value ?? 3)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value)
        setSliderValue(newValue)
        onChange(questionId, newValue.toString())
    }

    return (
        <div className="flex flex-col gap-[32px] items-center w-full max-w-[530px]">
            <p className="text-sm font-medium text-on-surface-tertiary text-center tracking-tight leading-snug">
                {t(language, "quiz.adjustSlider")}
            </p>
            <div className="flex items-center justify-center gap-[24px] w-full">
                {/* Rating number display - left */}
                <div className="w-[40px] h-[40px] flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-on-surface-primary">1</span>
                </div>

                {/* Slider track */}
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

                {/* Rating number display - right */}
                <div className="w-[40px] h-[40px] flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-on-surface-primary">5</span>
                </div>
            </div>
            <div className="text-center">
                <span className="text-3xl font-bold text-on-surface-primary">{sliderValue}</span>
            </div>
        </div>
    )
}

