import { ArrowUpRight, MapPin, Star, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FavoriteButton } from './FavoriteButton'

interface VenueCardProps {
  id: string
  name: string
  image: string
  location: string
  description?: string
  rating: number
  reviewCount: number
  capacity?: string
  badge?: string
  priceLabel?: string
  variant?: 'default' | 'featured' | 'compact'
}

export function VenueCard({
  id,
  name,
  image,
  location,
  description,
  rating,
  reviewCount,
  capacity,
  badge,
  priceLabel,
  variant = 'default',
}: VenueCardProps) {
  const isCompact = variant === 'compact'

  return (
    <article className="mk-card mk-card-hover group flex h-full flex-col">
      <Link to={`/marketplace/salones/${id}`} className="relative block aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full border border-[var(--mk-border)] bg-[var(--mk-bg-elevated)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-primary shadow-sm">
            {badge}
          </span>
        )}
        <FavoriteButton salonId={id} className="absolute right-3 top-3" />
      </Link>

      <div className={`flex flex-1 flex-col ${isCompact ? 'p-4' : 'p-5'}`}>
        <div className="flex items-start justify-between gap-2">
          <Link to={`/marketplace/salones/${id}`} className="font-semibold text-ink hover:text-primary">
            {name}
          </Link>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-200/60 bg-amber-50/90 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {rating.toFixed(1)}
          </span>
        </div>

        <p className="mt-1 text-[11px] text-ink-muted">({reviewCount} reseñas)</p>

        <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
          {location}
        </p>

        {capacity && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
            <Users className="h-3.5 w-3.5 shrink-0 text-primary" />
            {capacity}
          </p>
        )}

        {description && variant === 'featured' && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-muted">{description}</p>
        )}

        {priceLabel && (
          <p className="mt-3 text-[15px] font-medium text-ink">{priceLabel}</p>
        )}

        <Link
          to={`/marketplace/salones/${id}`}
          className={`mk-btn-soft mt-auto w-full ${isCompact ? '!mt-3 !py-2 text-xs' : '!mt-4'}`}
        >
          Ver salón
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}
