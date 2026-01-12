import React from "react"
import downImage from "./down.png"

type ThumbsDownIconProps = {
    className?: string
    size?: number
}

export function ThumbsDownIcon({ className = "", size = 24 }: ThumbsDownIconProps) {
    return (
        <img 
            src={downImage}
            alt="Thumbs down"
            className={className}
            style={{ 
                width: '30px',
                height: '30px',
                objectFit: 'contain',
                display: 'block',
                imageRendering: 'auto'
            }}
            role="img"
            aria-label="Thumbs down"
        />
    )
}

