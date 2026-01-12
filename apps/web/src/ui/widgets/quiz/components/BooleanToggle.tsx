import React from "react"
import { t } from "../../../../utils/i18n"

type BooleanToggleProps = {
    questionId: string
    value: string | null
    onChange: (questionId: string, value: string) => void
    language: "en" | "es"
}

export function BooleanToggle({ questionId, value, onChange, language }: BooleanToggleProps) {
    const isYesSelected = value === "yes" || value === "true" || value === "1"
    const isNoSelected = value === "no" || value === "false" || value === "0"

    return (
        <div className="flex flex-col gap-12 items-center w-full max-w-[530px]">
            <p className="text-body-sm font-medium text-muted text-center tracking-tight leading-snug">
                {t(language, "quiz.isDealbreaker")}
            </p>
            <div className="flex items-center gap-6">
                {/* Yes button */}
                <button
                    onClick={() => onChange(questionId, "yes")}
                    className={`
                        flex items-center justify-center gap-4 px-8 py-6
                        transition-all rounded-md border-2 min-w-[140px]
                        ${isYesSelected 
                            ? "bg-foreground text-surface border-foreground" 
                            : "bg-surface text-foreground border-border hover:bg-surface1"
                        }
                    `}
                >
                    {/* Thumbs up icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M7 22V11M2 13V20C2 21.1046 2.89543 22 4 22H16.4262C16.9071 22 17.3863 21.8962 17.8291 21.6935L20.5618 20.3902C21.0979 20.1474 21.5 19.6367 21.5 19.0708V9.58579C21.5 9.21071 21.3532 8.85107 21.0858 8.58579L14.9142 2.41421C14.351 1.85107 13.5 1.85107 12.9369 2.41421L9.58579 5.76537C9.21071 6.14045 9 6.64772 9 7.17157V20C9 21.1046 8.10457 22 7 22Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span className="text-h4 font-bold tracking-tight leading-tight">
                        {t(language, "quiz.yes")}
                    </span>
                </button>

                {/* No button */}
                <button
                    onClick={() => onChange(questionId, "no")}
                    className={`
                        flex items-center justify-center gap-4 px-8 py-6
                        transition-all rounded-md border-2 min-w-[140px]
                        ${isNoSelected
                            ? "bg-foreground text-surface border-foreground" 
                            : "bg-surface text-foreground border-border hover:bg-surface1"
                        }
                    `}
                >
                    <span className="text-h4 font-bold tracking-tight leading-tight">
                        {t(language, "quiz.no")}
                    </span>
                    {/* Thumbs down icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M17 2V13M22 11V4C22 2.89543 21.1046 2 20 2H7.57377C7.09288 2 6.61368 2.10375 6.17094 2.30654L3.43819 3.60983C2.9021 3.85265 2.5 4.36326 2.5 4.92921V14.4142C2.5 14.7893 2.64678 15.1489 2.91421 15.4142L9.08579 21.5858C9.64893 22.1489 10.5 22.1489 11.0631 21.5858L14.4142 18.2346C14.7893 17.8596 15 17.3523 15 16.8284V4C15 2.89543 15.8954 2 17 2Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
        </div>
    )
}

