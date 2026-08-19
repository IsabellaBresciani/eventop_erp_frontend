import { CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'

interface MarketplaceLogoProps {
  className?: string
  light?: boolean
}

export function MarketplaceLogo({ className = '', light = false }: MarketplaceLogoProps) {
  return (
    <Link
      to="/marketplace"
      className={`group flex items-center gap-2.5 ${className}`}
      aria-label="EvenTop Marketplace"
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-[10px] text-white ${
          light ? 'bg-white/20 backdrop-blur-md' : 'bg-primary'
        }`}
      >
        <CalendarDays className="h-[18px] w-[18px]" strokeWidth={2.25} />
      </div>
      <div className="leading-none">
        <span
          className={`block text-[17px] font-semibold tracking-[-0.02em] ${
            light ? 'text-white' : 'text-ink'
          }`}
        >
          EvenTop
        </span>
        <span className={`text-[11px] font-medium ${light ? 'text-white/75' : 'text-ink-muted'}`}>
          Marketplace
        </span>
      </div>
    </Link>
  )
}
