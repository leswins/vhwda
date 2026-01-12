import React, { useRef, useEffect, useState } from "react"

export type SliderProps = {
    min: number
    max: number
    step?: number
    value: number
    onChange: (value: number) => void
    leftLabel?: React.ReactNode
    rightLabel?: React.ReactNode
    showTicks?: boolean
    className?: string
    trackClassName?: string
    disabled?: boolean
}

/**
 * Generic, reusable Slider component following design system tokens
 * and maintaining single responsibility principle
 */
export function Slider({
    min,
    max,
    step = 1,
    value,
    onChange,
    leftLabel,
    rightLabel,
    showTicks = false,
    className = "",
    trackClassName = "",
    disabled = false,
}: SliderProps) {
    const sliderRef = useRef<HTMLInputElement>(null)
    const [thumbPosition, setThumbPosition] = useState(0)
    const [trackWidth, setTrackWidth] = useState(0)

    useEffect(() => {
        const updatePosition = () => {
            if (sliderRef.current) {
                const rect = sliderRef.current.getBoundingClientRect()
                const trackWidth = rect.width - 18 // Subtract thumb width
                setTrackWidth(trackWidth)
                
                const percentage = ((value - min) / (max - min)) * 100
                const thumbLeft = (percentage / 100) * trackWidth + 9 // Add half thumb width
                setThumbPosition(thumbLeft)
            }
        }

        updatePosition()
        window.addEventListener('resize', updatePosition)
        return () => window.removeEventListener('resize', updatePosition)
    }, [value, min, max])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value)
        onChange(newValue)
    }

    const percentage = ((value - min) / (max - min)) * 100
    const tickCount = max - min + 1

    return (
        <div className={`flex flex-row items-center justify-center gap-6 w-full ${className}`}>
            {/* Left label */}
            {leftLabel && (
                <div className="flex-shrink-0">
                    {leftLabel}
                </div>
            )}

            {/* Slider track container */}
            <div className={`relative flex-1 h-[30px] flex items-center ${trackClassName}`}>
                {/* Background track (unfilled portion) */}
                <div className="absolute left-[9px] right-[9px] h-[2px] bg-border top-1/2 -translate-y-1/2" />
                
                {/* Filled track (progress bar) - fills up to thumb center */}
                <div 
                    className="absolute left-[9px] h-[2px] bg-foreground top-1/2 -translate-y-1/2 transition-all duration-200"
                    style={{ 
                        width: trackWidth > 0 ? `${thumbPosition}px` : `${percentage}%`
                    }}
                />

                {/* Ticks/markers */}
                {showTicks && (
                    <div className="absolute left-[9px] right-[9px] top-0 bottom-0 flex items-center pointer-events-none z-20">
                        {Array.from({ length: tickCount }).map((_, index) => {
                            const tickValue = min + index
                            const tickPercentage = ((tickValue - min) / (max - min)) * 100
                            const isSelected = tickValue === value

                            return (
                                <div
                                    key={index}
                                    className="absolute top-1/2"
                                    style={{ 
                                        left: `${tickPercentage}%`, 
                                        transform: "translate(-50%, -50%)" 
                                    }}
                                >
                                    {!isSelected && (
                                        <div
                                            className="w-2 h-2 bg-foreground rounded-full transition-all duration-200"
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Slider input */}
                <input
                    ref={sliderRef}
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    className="quiz-slider w-full h-[30px] cursor-pointer appearance-none bg-transparent relative z-30"
                />
            </div>

            {/* Right label */}
            {rightLabel && (
                <div className="flex-shrink-0">
                    {rightLabel}
                </div>
            )}
        </div>
    )
}

