import React, { useState, useEffect } from "react"
import { t } from "../../../../utils/i18n"
import { Slider } from "../../../components/Slider"

type LikertSliderProps = {
    questionId: string
    value: number | null
    onChange: (questionId: string, value: string) => void
    language: "en" | "es"
}

export function LikertSlider({ questionId, value, onChange, language }: LikertSliderProps) {
    const [sliderValue, setSliderValue] = useState(value ?? 3)

    // Sync with external value changes
    useEffect(() => {
        if (value !== null && value !== sliderValue) {
            setSliderValue(value)
        }
    }, [value])

    const handleChange = (newValue: number) => {
        setSliderValue(newValue)
        // Convert slider value to option ID (assuming options are named "1", "2", "3", "4", "5")
        onChange(questionId, newValue.toString())
    }

    return (
        <div className="flex flex-col gap-8 items-center w-full max-w-[530px]">
            <p className="text-body-sm font-medium text-muted text-center tracking-tight leading-snug">
                {t(language, "quiz.adjustSlider")}
            </p>
            <Slider
                min={1}
                max={5}
                step={1}
                value={sliderValue}
                onChange={handleChange}
                showTicks={true}
            />
        </div>
    )
}

