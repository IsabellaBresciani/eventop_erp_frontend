import { BadgeCheck, ExternalLink, MapPin, Star, Users } from 'lucide-react'
import { type ComponentType } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice, SALON_TYPE_OPTIONS } from '../../data/salon-profile-defaults'
import type { SalonProfile } from '../../types/salon-profile'

interface MarketplacePreviewProps {
  profile: SalonProfile
  progress: number
}

export function MarketplacePreview({ profile, progress }: MarketplacePreviewProps) {
  const cover = profile.photos.find((p) => p.isCover) ?? profile.photos[0]
  const typeLabels = profile.types
    .map((t) => SALON_TYPE_OPTIONS.find((o) => o.id === t)?.label)
    .filter(Boolean)

  return (
    <div className="sticky top-24 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Live Preview</h3>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              progress >= 80
                ? 'bg-emerald-50 text-emerald-700'
                : progress >= 50
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-primary/10 text-primary'
            }`}
          >
            Perfil al {progress}%
          </span>
          <Link
            to="/marketplace/salones/salon-olivos"
            target="_blank"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-primary/5 hover:text-primary"
            title="Ver vitrina pública"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-surface-border bg-white shadow-card-hover">
        <div className="relative h-44 bg-surface">
          {cover ? (
            <img src={cover.url} alt={profile.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Sin foto de portada
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="rounded-xl border border-white/20 bg-white/20 px-3 py-1.5 backdrop-blur-md">
              <p className="text-lg font-bold text-white drop-shadow">
                {profile.name || 'Nombre del salón'}
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-white/20 bg-white/20 px-2 py-1 backdrop-blur-md">
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-300" />
              <span className="text-[10px] font-semibold text-white">Verificado</span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {typeLabels.length > 0 ? (
              typeLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary"
                >
                  {label}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">Sin tipo seleccionado</span>
            )}
          </div>

          <p className="line-clamp-3 text-xs leading-relaxed text-slate-600">
            {profile.description || 'Agregá una descripción para tu vitrina...'}
          </p>

          <div className="mt-4 space-y-2 border-t border-surface-border pt-4">
            <PreviewRow
              icon={MapPin}
              label={profile.neighborhood || profile.address || 'Ubicación pendiente'}
            />
            <PreviewRow
              icon={Users}
              label={
                profile.capacityMax > 0
                  ? `${profile.capacityMin}–${profile.capacityMax} invitados`
                  : 'Capacidad no definida'
              }
            />
            <PreviewRow
              icon={Star}
              label={
                profile.pricePerHour > 0
                  ? `Desde ${formatPrice(profile.pricePerHour, profile.currency)}/hora`
                  : 'Precio no definido'
              }
            />
          </div>

          {profile.packages.length > 0 && (
            <div className="mt-4 rounded-xl bg-surface p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Paquete destacado
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {profile.packages[0].name}
              </p>
              <p className="text-xs text-primary">
                {formatPrice(profile.packages[0].minPrice, profile.currency)} –{' '}
                {formatPrice(profile.packages[0].maxPrice, profile.currency)}
              </p>
            </div>
          )}

          <button type="button" className="btn-primary mt-4 w-full py-2.5 text-xs">
            Agendar Visita
          </button>
        </div>
      </div>

      {progress < 100 && (
        <p className="text-center text-[11px] text-slate-400">
          Completá tu perfil para mejorar el posicionamiento en el Marketplace
        </p>
      )}
    </div>
  )
}

function PreviewRow({
  icon: Icon,
  label,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-600">
      <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
      <span className="truncate">{label}</span>
    </div>
  )
}
