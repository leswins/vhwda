import React, { useState, useEffect, useRef } from "react"
import { t } from "../../../../utils/i18n"
import { Slider } from "../../../components/Slider"
import { SadFaceIcon } from "../../icons/SadFaceIcon"
import { HappyFaceIcon } from "../../icons/HappyFaceIcon"

type LikertSliderProps = {
    questionId: string
    value: number | null
    onChange: (questionId: string, value: string) => void
    language: "en" | "es"
}

export function LikertSlider({ questionId, value, onChange, language }: LikertSliderProps) {
    const [sliderValue, setSliderValue] = useState(value ?? 3)
    const prevQuestionIdRef = useRef<string>(questionId)
    const hasInitializedRef = useRef<boolean>(false)

    // Initialize value when questionId changes
    useEffect(() => {
        if (questionId !== prevQuestionIdRef.current) {
            // New question - reset initialization flag and update ref
            hasInitializedRef.current = false
            prevQuestionIdRef.current = questionId
            // Set initial value for new question
            const initialValue = value ?? 3
            setSliderValue(initialValue)
        }
        
        // Register initial value only once per question
        if (!hasInitializedRef.current) {
            const initialValue = value ?? 3
            setSliderValue(initialValue)
            // Register the initial value immediately
            onChange(questionId, initialValue.toString())
            hasInitializedRef.current = true
        }
    }, [questionId, value, onChange])

    // Sync slider value when external value changes (but questionId hasn't changed)
    useEffect(() => {
        if (value !== null && questionId === prevQuestionIdRef.current) {
            setSliderValue(value)
        }
    }, [value, questionId])

    const handleChange = (newValue: number) => {
        setSliderValue(newValue)
        // Convert slider value to option ID (assuming options are named "1", "2", "3", "4", "5")
        onChange(questionId, newValue.toString())
    }

    return (
        <div className="flex flex-col gap-8 items-center w-full max-w-[530px]">
            <p className="text-body-sm text-muted text-center">
                {t(language, "quiz.adjustSlider")}
            </p>
            <Slider
                min={1}
                max={5}
                step={1}
                value={sliderValue}
                onChange={handleChange}
                showTicks={true}
                leftLabel={<SadFaceIcon />}
                rightLabel={<HappyFaceIcon />}
            />
        </div>
    )
}

