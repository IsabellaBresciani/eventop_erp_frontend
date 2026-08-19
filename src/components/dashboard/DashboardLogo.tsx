import { CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'

interface DashboardLogoProps {
  to?: string
  className?: string
  compact?: boolean
  onNavigate?: () => void
}

export function DashboardLogo({
  to = '/dashboard',
  className = '',
  compact = false,
  onNavigate,
}: DashboardLogoProps) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={`group flex items-center gap-2.5 ${className}`}
      aria-label="EvenTop Gestor"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary text-white">
        <CalendarDays className="h-[18px] w-[18px]" strokeWidth={2.25} />
      </div>
      {!compact && (
        <div className="leading-none">
          <span className="block text-[17px] font-semibold tracking-[-0.02em] text-ink">
            EvenTop
          </span>
          <span className="text-[11px] font-medium text-ink-muted">Gestor</span>
        </div>
      )}
    </Link>
  )
}
