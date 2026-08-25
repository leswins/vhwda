import React from "react"

function columnCenters(columns: number): number[] {
  return Array.from({ length: columns }, (_, index) => ((index + 0.5) / columns) * 100)
}

function joinPath(points: Array<[number, number]>): string {
  return points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ")
}

type ConnectorProps = {
  columns: number
  connected?: boolean
}

export function ForkConnector({ columns }: ConnectorProps) {
  const centers = columnCenters(columns)
  const midY = 10
  const endY = 36
  const paths = centers.map((x) => joinPath([[50, 0], [50, midY], [x, midY], [x, endY]]))

  return (
    <svg
      viewBox="0 0 100 40"
      className="hidden h-10 w-full text-foreground lg:block"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {paths.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {centers.map((x, index) => (
        <polygon key={`${x}-${index}`} points={`${x - 1.2},32 ${x + 1.2},32 ${x},38`} fill="currentColor" />
      ))}
    </svg>
  )
}

export function MergeConnector({ columns, connected = true }: ConnectorProps) {
  const centers = columnCenters(columns)
  const midY = connected ? 26 : 36
  const paths = centers.map((x) =>
    connected ? joinPath([[x, 0], [x, midY], [50, midY], [50, 40]]) : joinPath([[x, 0], [x, midY]])
  )
  const bar = connected || columns < 2 ? null : joinPath([[centers[0], midY], [centers[centers.length - 1], midY]])

  return (
    <svg
      viewBox="0 0 100 40"
      className="hidden h-10 w-full text-foreground lg:block"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {bar ? (
        <path d={bar} fill="none" stroke="currentColor" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      ) : null}
      {paths.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {connected ? <polygon points="48.8,34 51.2,34 50,40" fill="currentColor" /> : null}
    </svg>
  )
}

export function VerticalConnector() {
  return (
    <div className="flex flex-col items-center py-fluid-5" aria-hidden="true">
      <div className="h-fluid-15 w-px bg-foreground" />
      <svg width="8" height="6" viewBox="0 0 8 6" className="text-foreground">
        <path d="M0 0 L4 6 L8 0" fill="currentColor" />
      </svg>
    </div>
  )
}
