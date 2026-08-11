import { ImageIcon, MapPin, Users } from 'lucide-react'
import {
  formatPrice,
  getServiceCategoryLabel,
  getServicePricingModelLabel,
  SALON_TYPE_OPTIONS,
} from '../../data/salon-profile-defaults'
import type { ProfileStep, SalonProfile } from '../../types/salon-profile'

export function ProfileSectionView({
  section,
  profile,
}: {
  section: ProfileStep
  profile: SalonProfile
}) {
  switch (section) {
    case 'general':
      return <GeneralView profile={profile} />
    case 'location':
      return <LocationView profile={profile} />
    case 'pricing':
      return <PricingView profile={profile} />
    case 'photos':
      return <PhotosView profile={profile} />
    case 'services':
      return <ServicesView profile={profile} />
  }
}

function EmptyHint({ children }: { children: string }) {
  return <p className="text-sm text-slate-400">{children}</p>
}

function GeneralView({ profile }: { profile: SalonProfile }) {
  const types = profile.types
    .map((t) => SALON_TYPE_OPTIONS.find((o) => o.id === t)?.label)
    .filter(Boolean)

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xl font-bold text-slate-900">{profile.name || 'Sin nombre'}</p>
        {types.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {types.map((label) => (
              <span
                key={label}
                className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
              >
                {label}
              </span>
            ))}
          </div>
        ) : (
          <EmptyHint>Sin tipos seleccionados</EmptyHint>
        )}
      </div>
      {profile.description ? (
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-600">
          {profile.description}
        </p>
      ) : (
        <EmptyHint>Sin descripción</EmptyHint>
      )}
    </div>
  )
}

function LocationView({ profile }: { profile: SalonProfile }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2.5">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div>
          <p className="text-[15px] font-medium text-slate-900">
            {profile.address || 'Sin dirección'}
          </p>
          {profile.neighborhood && (
            <p className="mt-0.5 text-sm text-slate-500">{profile.neighborhood}</p>
          )}
        </div>
      </div>
      <p className="text-xs text-slate-400">
        {profile.lat.toFixed(4)}, {profile.lng.toFixed(4)}
      </p>
    </div>
  )
}

function PricingView({ profile }: { profile: SalonProfile }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2 text-slate-700">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-[15px] font-medium">
            {profile.capacityMin}–{profile.capacityMax} personas
          </span>
        </div>
        <p className="text-[15px] font-semibold text-slate-900">
          {formatPrice(profile.pricePerHour, profile.currency)}
          <span className="ml-1 text-sm font-normal text-slate-400">/ hora</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-slate-600">
        <span>
          Cancelación{' '}
          <strong className="capitalize text-slate-800">{profile.cancellationPolicy}</strong>
        </span>
        <span className="text-slate-300">·</span>
        <span>
          Seña <strong className="text-slate-800">{profile.depositPercent}%</strong>
        </span>
      </div>

      {profile.packages.length > 0 && (
        <div className="space-y-2">
          {profile.packages.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{pkg.name}</p>
                <p className="text-sm font-medium text-primary">
                  {formatPrice(pkg.minPrice, profile.currency)} –{' '}
                  {formatPrice(pkg.maxPrice, profile.currency)}
                </p>
              </div>
              {pkg.description && (
                <p className="mt-1 text-xs text-slate-500">{pkg.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PhotosView({ profile }: { profile: SalonProfile }) {
  if (profile.photos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
        <ImageIcon className="h-8 w-8" />
        <p className="text-sm">Sin fotos</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {profile.photos.map((photo) => (
        <div key={photo.id} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
          <img src={photo.url} alt="" className="h-full w-full object-cover" />
          {photo.isCover && (
            <span className="absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              Portada
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

function ServicesView({ profile }: { profile: SalonProfile }) {
  if (profile.services.length === 0) {
    return <EmptyHint>Sin servicios cargados</EmptyHint>
  }

  return (
    <div className="space-y-2.5">
      {profile.services.map((service) => (
        <div
          key={service.id}
          className={`rounded-xl border px-4 py-3 ${
            service.status === 'ACTIVE'
              ? 'border-slate-100 bg-white'
              : 'border-slate-100 bg-slate-50 opacity-70'
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-900">{service.name}</p>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              {getServiceCategoryLabel(service.category)}
            </span>
            {service.status === 'INACTIVE' && (
              <span className="text-[10px] font-semibold uppercase text-slate-400">Inactivo</span>
            )}
          </div>
          {service.description && (
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">{service.description}</p>
          )}
          <p className="mt-1.5 text-xs font-medium text-slate-600">
            {formatPrice(service.basePrice, profile.currency)}
            <span className="font-normal text-slate-400">
              {' '}
              · {getServicePricingModelLabel(service.pricingModel)}
            </span>
          </p>
        </div>
      ))}
    </div>
  )
}
