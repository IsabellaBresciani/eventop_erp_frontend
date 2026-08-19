import { Minus, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { MarketplaceVenueListing } from '../../types/marketplace-host'
import { formatPrice } from '../../data/salon-profile-defaults'
import { getVenueProfile } from '../../data/marketplace-venues'

interface VenueMapViewProps {
  venues: MarketplaceVenueListing[]
}

const MAP_BOUNDS = {
  minLat: -34.78,
  maxLat: -34.42,
  minLng: -58.95,
  maxLng: -58.18,
}

function latLngToPercent(lat: number, lng: number) {
  const top = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100
  const left = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100
  return {
    top: `${Math.min(92, Math.max(8, top))}%`,
    left: `${Math.min(92, Math.max(8, left))}%`,
  }
}

export function VenueMapView({ venues }: VenueMapViewProps) {
  return (
    <div className="relative h-full min-h-[480px] overflow-hidden rounded-card border border-[var(--mk-border)] bg-[var(--mk-bg-alt)]">
      <iframe
        title="Mapa de salones"
        src="https://www.openstreetmap.org/export/embed.html?bbox=-58.95%2C-34.78%2C-58.18%2C-34.42&layer=mapnik"
        className="absolute inset-0 h-full w-full border-0 opacity-90"
      />

      {venues.map((venue) => {
        const profile = getVenueProfile(venue.id)
        if (!profile) return null
        const pos = latLngToPercent(profile.lat, profile.lng)

        return (
          <Link
            key={venue.id}
            to={`/marketplace/salones/${venue.id}`}
            className="absolute z-10 -translate-x-1/2 -translate-y-full transition-transform hover:scale-105"
            style={{ top: pos.top, left: pos.left }}
          >
            <span className="inline-flex rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-md">
              {formatPrice(venue.priceFrom, profile.currency)}
            </span>
          </Link>
        )
      })}

      <div className="absolute bottom-4 right-4 flex flex-col gap-1">
        <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--mk-border)] bg-[var(--mk-bg-elevated)] shadow-md">
          <Plus className="h-4 w-4 text-primary" />
        </button>
        <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--mk-border)] bg-[var(--mk-bg-elevated)] shadow-md">
          <Minus className="h-4 w-4 text-primary" />
        </button>
      </div>
    </div>
  )
}
