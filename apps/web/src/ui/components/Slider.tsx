import React from "react"

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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value)
        onChange(newValue)
    }

    const percentage = ((value - min) / (max - min)) * 100
    const tickCount = max - min + 1

    return (
        <div className={`flex items-center justify-center gap-6 w-full ${className}`}>
            {/* Left label */}
            {leftLabel && (
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    {leftLabel}
                </div>
            )}

            {/* Slider track container */}
            <div className={`relative flex-1 h-[30px] flex items-center ${trackClassName}`}>
                {/* Background track (unfilled portion) */}
                <div className="absolute inset-0 h-[2px] bg-border top-1/2 -translate-y-1/2" />
                
                {/* Filled track (progress bar) */}
                <div 
                    className="absolute h-[2px] bg-foreground top-1/2 -translate-y-1/2 transition-all duration-200"
                    style={{ width: `${percentage}%` }}
                />

                {/* Ticks/markers */}
                {showTicks && (
                    <div className="absolute inset-0 flex items-center pointer-events-none z-20">
                        {Array.from({ length: tickCount }).map((_, index) => {
                            const tickValue = min + index
                            const tickPercentage = ((tickValue - min) / (max - min)) * 100
                            const isSelected = tickValue === value
                            const isActive = tickValue <= value

                            return (
                                <div
                                    key={index}
                                    className="absolute top-1/2"
                                    style={{ 
                                        left: `${tickPercentage}%`, 
                                        transform: "translate(-50%, -50%)" 
                                    }}
                                >
                                    <div
                                        className={`rounded-full transition-all duration-200 ${
                                            isSelected
                                                ? "w-4 h-4 bg-foreground scale-125"
                                                : isActive
                                                ? "w-2.5 h-2.5 bg-foreground"
                                                : "w-2.5 h-2.5 bg-border"
                                        }`}
                                    />
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Slider input */}
                <input
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
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    {rightLabel}
                </div>
            )}
        </div>
    )
}

