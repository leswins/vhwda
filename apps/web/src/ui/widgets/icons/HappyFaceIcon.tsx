import React from "react"
import happyGreenImage from "./happy-green.png"

type HappyFaceIconProps = {
    className?: string
    size?: number
}

export function HappyFaceIcon({ className = "", size = 40 }: HappyFaceIconProps) {
    return (
        <img 
            src={happyGreenImage}
            alt="Like"
            className={className}
            style={{ 
                width: '48px',
                height: '48px',
                objectFit: 'contain',
                display: 'block',
                imageRendering: 'auto'
            }}
            role="img"
            aria-label="Like"
        />
    )
}

