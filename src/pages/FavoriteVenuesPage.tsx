import { Check, Copy, GitCompareArrows, MapPin, Share2, Star, Users, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FavoriteButton } from '../components/marketplace/FavoriteButton'
import { HostAccountLayout } from '../components/marketplace/host-account/HostAccountLayout'
import {
  formatPriceRange,
  getFavoriteSalonIds,
  getVenueCoverPhoto,
  getVenueListing,
  getVenueProfile,
} from '../data/marketplace-venues'
import { useHostSession } from '../hooks/useHostSession'
import { absoluteAppUrl } from '../lib/app-url'
import type { SalonProfile } from '../types/salon-profile'

interface FavoriteVenueEntry {
  id: string
  profile: SalonProfile
  rating: number
  reviewCount: number
  priceLabel: string
}

function useFavoriteVenues(): FavoriteVenueEntry[] {
  return useMemo(() => {
    const ids = getFavoriteSalonIds()
    return ids
      .map((id) => {
        const profile = getVenueProfile(id)
        const listing = getVenueListing(id)
        if (!profile || !listing) return null
        return {
          id,
          profile,
          rating: listing.rating,
          reviewCount: listing.reviewCount,
          priceLabel: formatPriceRange(listing.priceFrom, listing.priceTo, profile.currency),
        } satisfies FavoriteVenueEntry
      })
      .filter((v): v is FavoriteVenueEntry => v !== null)
  }, [])
}

export default function FavoriteVenuesPage() {
  const [favorites, setFavorites] = useState<FavoriteVenueEntry[]>(useFavoriteVenues())
  const [mode, setMode] = useState<'grid' | 'compare'>('grid')
  const [shareOpen, setShareOpen] = useState(false)

  const refreshFavorites = () => {
    const ids = getFavoriteSalonIds()
    setFavorites((prev) => prev.filter((f) => ids.includes(f.id)))
  }

  return (
    <HostAccountLayout
      title={mode === 'grid' ? 'Tus salones guardados' : 'Comparativa de salones'}
      subtitle={`${favorites.length} ${favorites.length === 1 ? 'salón guardado' : 'salones guardados'}`}
      headerActions={
        <>
          {mode === 'compare' && favorites.length > 0 && (
            <button type="button" onClick={() => setShareOpen(true)} className="mk-btn-soft">
              <Share2 className="h-4 w-4" />
              Compartir Comparativa
            </button>
          )}
          {favorites.length > 1 && (
            <button
              type="button"
              onClick={() => setMode((m) => (m === 'grid' ? 'compare' : 'grid'))}
              className="mk-btn-primary"
            >
              <GitCompareArrows className="h-4 w-4" />
              {mode === 'grid' ? 'Comparar' : 'Ver Grilla'}
            </button>
          )}
        </>
      }
    >
      {favorites.length === 0 ? (
        <EmptyState />
      ) : mode === 'grid' ? (
        <FavoritesGrid favorites={favorites} onChange={refreshFavorites} />
      ) : (
        <ComparisonTable favorites={favorites} onChange={refreshFavorites} />
      )}

      {shareOpen && <ShareComparisonModal onClose={() => setShareOpen(false)} favorites={favorites} />}
    </HostAccountLayout>
  )
}

function EmptyState() {
  return (
    <div className="mk-card flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Star className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-semibold text-ink">Todavía no guardaste salones favoritos</h2>
      <p className="max-w-sm text-sm text-ink-muted">
        Explorá el marketplace y tocá el ícono de estrella en cualquier salón para guardarlo acá y
        comparar tus opciones antes de decidir.
      </p>
      <Link to="/marketplace" className="mk-btn-primary mt-2">
        Explorar salones
      </Link>
    </div>
  )
}

function FavoritesGrid({
  favorites,
  onChange,
}: {
  favorites: FavoriteVenueEntry[]
  onChange: () => void
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {favorites.map(({ id, profile, rating, reviewCount, priceLabel }) => (
        <article key={id} className="mk-card mk-card-hover group flex h-full flex-col">
          <Link to={`/marketplace/salones/${id}`} className="relative block aspect-[16/10] overflow-hidden">
            <img
              src={getVenueCoverPhoto(profile)}
              alt={profile.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <FavoriteButton salonId={id} className="absolute right-3 top-3" onChange={onChange} />
          </Link>
          <div className="flex flex-1 flex-col p-5">
            <div className="flex items-start justify-between gap-2">
              <Link
                to={`/marketplace/salones/${id}`}
                className="font-semibold text-ink hover:text-primary"
              >
                {profile.name}
              </Link>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-200/60 bg-amber-50/90 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {rating.toFixed(1)}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-ink-muted">({reviewCount} reseñas)</p>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
              {profile.neighborhood}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
              <Users className="h-3.5 w-3.5 shrink-0 text-primary" />
              {profile.capacityMin}–{profile.capacityMax} personas
            </p>
            <p className="mt-3 text-[15px] font-medium text-ink">{priceLabel}</p>
            <Link to={`/marketplace/salones/${id}`} className="mk-btn-soft mt-auto !mt-4 w-full">
              Ver salón
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}

function ComparisonTable({
  favorites,
  onChange,
}: {
  favorites: FavoriteVenueEntry[]
  onChange: () => void
}) {
  return (
    <div className="mk-surface-panel overflow-x-auto p-0">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="w-40 border-b border-surface-border p-4 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Salón
            </th>
            {favorites.map(({ id, profile }) => (
              <th key={id} className="min-w-[220px] border-b border-surface-border p-4 align-top">
                <div className="flex flex-col items-start gap-2">
                  <div className="relative w-full overflow-hidden rounded-xl">
                    <img
                      src={getVenueCoverPhoto(profile)}
                      alt={profile.name}
                      className="h-24 w-full object-cover"
                    />
                    <FavoriteButton
                      salonId={id}
                      className="absolute right-2 top-2 !h-7 !w-7"
                      onChange={onChange}
                    />
                  </div>
                  <Link
                    to={`/marketplace/salones/${id}`}
                    className="text-sm font-semibold text-ink hover:text-primary"
                  >
                    {profile.name}
                  </Link>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <ComparisonRow
            label="Precio estimado"
            values={favorites.map((f) => f.priceLabel)}
          />
          <ComparisonRow
            label="Capacidad"
            values={favorites.map((f) => `${f.profile.capacityMin}–${f.profile.capacityMax} personas`)}
          />
          <ComparisonRow
            label="Ubicación"
            values={favorites.map((f) => f.profile.neighborhood)}
          />
          <ComparisonRow
            label="Calificación"
            values={favorites.map((f) => `${f.rating.toFixed(1)} (${f.reviewCount} reseñas)`)}
          />
          <ComparisonRow
            label="Servicios incluidos"
            values={favorites.map((f) =>
              (f.profile.services ?? [])
                .filter((s) => s.status === 'ACTIVE')
                .slice(0, 4)
                .map((s) => s.name)
                .join(', ') || 'Sin datos',
            )}
          />
        </tbody>
      </table>
    </div>
  )
}

function ComparisonRow({ label, values }: { label: string; values: string[] }) {
  return (
    <tr className="odd:bg-secondary/20">
      <td className="border-b border-surface-border p-4 text-xs font-semibold uppercase tracking-wider text-ink-muted">
        {label}
      </td>
      {values.map((value, i) => (
        <td key={i} className="border-b border-surface-border p-4 align-top text-ink">
          {value}
        </td>
      ))}
    </tr>
  )
}

function ShareComparisonModal({
  favorites,
  onClose,
}: {
  favorites: FavoriteVenueEntry[]
  onClose: () => void
}) {
  const { session } = useHostSession()
  const shareUrl = useMemo(() => {
    const token = Math.random().toString(36).slice(2, 10)
    const ids = favorites.map((f) => f.id).join(',')
    return absoluteAppUrl(`/marketplace/comparativa/${token}?salones=${ids}`)
  }, [favorites])

  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-card bg-white p-6 shadow-elevated">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Compartir Comparativa</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <X className="h-5 w-5 text-ink-muted" />
          </button>
        </div>
        <p className="mb-4 text-sm text-ink-muted">
          {session?.name ?? 'Compartí'} tu comparativa de {favorites.length}{' '}
          {favorites.length === 1 ? 'salón' : 'salones'} con quien quieras invitar a decidir.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="mk-input flex-1 font-mono text-xs text-ink-muted"
          />
          <button
            type="button"
            onClick={copyLink}
            className={`mk-btn-primary shrink-0 px-4 ${copied ? '!bg-emerald-600' : ''}`}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </div>
    </div>
  )
}
