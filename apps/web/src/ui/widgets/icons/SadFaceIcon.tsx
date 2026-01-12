import React from "react"
import sadRedImage from "./sad-red.png"

type SadFaceIconProps = {
    className?: string
    size?: number
}

export function SadFaceIcon({ className = "", size = 40 }: SadFaceIconProps) {
    return (
        <img 
            src={sadRedImage}
            alt="Dislike"
            className={className}
            style={{ 
                width: '48px',
                height: '48px',
                objectFit: 'contain',
                display: 'block',
                imageRendering: 'auto'
            }}
            role="img"
            aria-label="Dislike"
        />
    )
}

