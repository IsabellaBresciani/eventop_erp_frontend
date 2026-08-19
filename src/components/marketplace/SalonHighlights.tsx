import {
  Baby,
  Clock,
  LucideIcon,
  UtensilsCrossed,
  Users,
} from 'lucide-react'
import type { SalonProfile } from '../../types/salon-profile'

interface SalonHighlightsProps {
  profile: SalonProfile
  hasCatering: boolean
}

export function SalonHighlights({ profile, hasCatering }: SalonHighlightsProps) {
  const items: { icon: LucideIcon; label: string; value: string }[] = [
    {
      icon: Users,
      label: 'Capacidad',
      value: `Hasta ${profile.capacityMax} invitados`,
    },
    {
      icon: Baby,
      label: 'Edades',
      value: 'Todas las edades',
    },
    {
      icon: Clock,
      label: 'Duración',
      value: '6 horas',
    },
    {
      icon: UtensilsCrossed,
      label: 'Catering',
      value: hasCatering ? 'Incluido' : 'Consultar',
    },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="rounded-2xl border border-black/[0.06] bg-[#f5f5f7] px-4 py-4 text-center">
          <Icon className="mx-auto h-5 w-5 text-primary" strokeWidth={1.75} />
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
            {label}
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
        </div>
      ))}
    </div>
  )
}
