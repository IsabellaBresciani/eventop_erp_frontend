interface QrCodeDisplayProps {
  code: string
  size?: number
}

export function QrCodeDisplay({ code, size = 160 }: QrCodeDisplayProps) {
  const cells = 11
  const hash = code.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)

  const grid = Array.from({ length: cells * cells }, (_, i) => {
    const row = Math.floor(i / cells)
    const col = i % cells
    const isFinder =
      (row < 3 && col < 3) ||
      (row < 3 && col >= cells - 3) ||
      (row >= cells - 3 && col < 3)
    const isFinderInner =
      isFinder &&
      row >= 1 &&
      row <= 1 + (cells < 10 ? 0 : 0) &&
      ((row === 1 && col === 1) ||
        (row === 1 && col === cells - 2) ||
        (row === cells - 2 && col === 1))
    if (isFinder) return isFinderInner || row === 0 || row === 2 || col === 0 || col === 2 || row === cells - 1 || row === cells - 3 || col === cells - 1 || col === cells - 3
    return (hash + i * 7) % 3 !== 0
  })

  const cellSize = size / cells

  return (
    <div className="inline-block rounded-xl bg-white p-3 shadow-card">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect width={size} height={size} fill="white" />
        {grid.map((filled, i) => {
          if (!filled) return null
          const row = Math.floor(i / cells)
          const col = i % cells
          return (
            <rect
              key={i}
              x={col * cellSize}
              y={row * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#1e1e1e"
              rx={cellSize * 0.15}
            />
          )
        })}
      </svg>
      <p className="mt-2 text-center font-mono text-[10px] text-ink-muted">{code}</p>
    </div>
  )
}
