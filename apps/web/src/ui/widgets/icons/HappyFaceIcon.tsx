import React from "react"
import happyGreenImage from "./happy-green.png"

type HappyFaceIconProps = {
    className?: string
    size?: number
}

export function HappyFaceIcon({ className = "", size = 48 }: HappyFaceIconProps) {
    return (
        <img
            src={happyGreenImage}
            alt="Like"
            width={size}
            height={size}
            className={`block object-contain ${className}`}
            style={{ imageRendering: "auto" }}
            role="img"
            aria-label="Like"
        />
    )
}

