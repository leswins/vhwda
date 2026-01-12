import React from "react"
import upImage from "./up.png"

type ThumbsUpIconProps = {
    className?: string
    size?: number
}

export function ThumbsUpIcon({ className = "", size = 24 }: ThumbsUpIconProps) {
    return (
        <img 
            src={upImage}
            alt="Thumbs up"
            className={className}
            style={{ 
                width: '30px',
                height: '30px',
                objectFit: 'contain',
                display: 'block',
                imageRendering: 'auto'
            }}
            role="img"
            aria-label="Thumbs up"
        />
    )
}

