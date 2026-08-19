import {
  Camera,
  LucideIcon,
  Music,
  Palette,
  Sparkles,
  Users,
  UtensilsCrossed,
  Wifi,
} from 'lucide-react'
import { getServiceCategoryLabel } from '../../data/salon-profile-defaults'
import type { SalonProfile, VenueService, VenueServiceCategory } from '../../types/salon-profile'

const CATEGORY_ICONS: Record<VenueServiceCategory, LucideIcon> = {
  VENUE_SET_UP: Wifi,
  ENTERTAINMENT: Music,
  FOOD_BEVERAGE: UtensilsCrossed,
  DECORATION: Palette,
  STAFFING: Users,
  MEDIA: Camera,
}

interface SalonAmenitiesProps {
  profile: SalonProfile
}

function pickDisplayServices(services: VenueService[]) {
  const active = services.filter((s) => s.status === 'ACTIVE')
  const preferred = active.filter((s) =>
    ['FOOD_BEVERAGE', 'STAFFING', 'ENTERTAINMENT', 'DECORATION'].includes(s.category),
  )
  return (preferred.length >= 4 ? preferred : active).slice(0, 4)
}

export function SalonAmenities({ profile }: SalonAmenitiesProps) {
  const services = pickDisplayServices(profile.services ?? [])

  if (services.length === 0) return null

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight text-ink">Qué incluye este espacio</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {services.map((service) => {
          const Icon = CATEGORY_ICONS[service.category] ?? Sparkles
          return (
            <div
              key={service.id}
              className="flex gap-4 rounded-2xl border border-black/[0.06] bg-white p-4"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-ink">{service.name}</p>
                <p className="mt-1 text-sm text-ink-muted">
                  {service.description || getServiceCategoryLabel(service.category)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
