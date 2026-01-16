import React, { useState } from "react"
import type { QuizVector } from "../../../../sanity/queries/careers"
import { t } from "../../../../utils/i18n"

type VectorModalProps = {
    vector: QuizVector
    language: "en" | "es"
}

export function VectorModal({ vector, language }: VectorModalProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Trigger button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-on-surface-primary text-surface-background px-4 py-2 border border-on-surface-primary hover:bg-surface-background hover:text-on-surface-primary transition-colors z-50"
            >
                {t(language, "quiz.showVector")}
            </button>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-surface-background border border-on-surface-primary max-w-2xl w-full max-h-[80vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-on-surface-primary text-surface-background p-4 flex items-center justify-between">
                            <h3 className="text-h5 font-bold">
                                {t(language, "quiz.vectorTitle")}
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-surface-background hover:text-on-surface-primary transition-colors"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M18 6L6 18M6 6L18 18"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <pre className="text-xs font-mono bg-surface-above-1 p-4 overflow-x-auto border border-on-surface-primary">
                                {JSON.stringify(vector, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

