import React from "react"
import sadRedImage from "./sad-red.png"

type SadFaceIconProps = {
    className?: string
    size?: number
}

export function SadFaceIcon({ className = "", size = 48 }: SadFaceIconProps) {
    return (
        <img
            src={sadRedImage}
            alt="Dislike"
            width={size}
            height={size}
            className={`block object-contain ${className}`}
            style={{ imageRendering: "auto" }}
            role="img"
            aria-label="Dislike"
        />
    )
}

