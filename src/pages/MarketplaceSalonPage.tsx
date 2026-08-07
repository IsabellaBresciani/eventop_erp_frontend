import {
  BadgeCheck,
  Calendar,
  Car,
  ChefHat,
  MapPin,
  Radio,
  Shield,
  Star,
  Wifi,
} from 'lucide-react'
import { type ComponentType, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  loadMarketplaceAgenda,
  loadMarketplaceProfile,
} from '../data/marketplace'
import { formatPrice, SALON_TYPE_OPTIONS } from '../data/salon-profile-defaults'
import { BudgetCalculator } from '../components/marketplace/BudgetCalculator'
import { ImmersiveGallery } from '../components/marketplace/ImmersiveGallery'
import { VisitBookingModal } from '../components/marketplace/VisitBookingModal'

const AMENITY_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  catering: ChefHat,
  parking: Car,
  sound: Radio,
}

export default function MarketplaceSalonPage() {
  const profile = loadMarketplaceProfile()
  const agenda = loadMarketplaceAgenda()
  const [visitOpen, setVisitOpen] = useState(false)

  const typeLabels = profile.types
    .map((t) => SALON_TYPE_OPTIONS.find((o) => o.id === t)?.label)
    .filter(Boolean)

  const activeAmenities = profile.amenities.filter((a) => a.enabled)

  return (
    <div className="min-h-screen bg-surface">
      <ImmersiveGallery profile={profile} />

      <div className="section-container py-6 lg:py-10">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            <BadgeCheck className="h-3.5 w-3.5" />
            Salón Verificado por EvenTop
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            4.9
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap gap-2">
              {typeLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                >
                  {label}
                </span>
              ))}
            </div>

            <p className="mt-4 leading-relaxed text-slate-600">{profile.description}</p>

            <div className="mt-4 flex items-start gap-2 text-sm text-slate-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p>{profile.address}</p>
                <p className="text-slate-400">{profile.neighborhood}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(profile.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-xs font-medium text-primary hover:underline"
                >
                  Ver en Google Maps →
                </a>
              </div>
            </div>

            {activeAmenities.length > 0 && (
              <section className="mt-8">
                <h2 className="mb-4 text-sm font-bold text-slate-900">Servicios y amenidades</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {activeAmenities.map((amenity) => {
                    const Icon = AMENITY_ICONS[amenity.id] ?? Wifi
                    return (
                      <div
                        key={amenity.id}
                        className="flex items-center gap-3 rounded-xl border border-surface-border bg-white p-3"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{amenity.label}</p>
                          <p className="text-[10px] text-slate-400">
                            {amenity.included ? 'Incluido' : 'Adicional'}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {profile.packages.length > 0 && (
              <section className="mt-8">
                <h2 className="mb-4 text-sm font-bold text-slate-900">Paquetes destacados</h2>
                <div className="space-y-3">
                  {profile.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="rounded-xl border border-surface-border bg-white p-4 transition-shadow hover:shadow-card"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-900">{pkg.name}</h3>
                        <span className="text-sm font-bold text-primary">
                          {formatPrice(pkg.minPrice, profile.currency)} –{' '}
                          {formatPrice(pkg.maxPrice, profile.currency)}
                        </span>
                      </div>
                      {pkg.description && (
                        <p className="mt-1 text-sm text-slate-500">{pkg.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-8 flex items-center gap-2 rounded-xl bg-surface px-4 py-3 text-xs text-slate-500">
              <Shield className="h-4 w-4 text-primary" />
              Política de cancelación:{' '}
              <strong className="capitalize text-slate-700">{profile.cancellationPolicy}</strong>
              · Seña del {profile.depositPercent}%
            </div>
          </div>

          <div className="lg:col-span-5">
            <BudgetCalculator profile={profile} agenda={agenda} />

            <button
              type="button"
              onClick={() => setVisitOpen(true)}
              className="btn-secondary mt-4 w-full"
            >
              <Calendar className="h-4 w-4" />
              Agendar Visita Técnica
            </button>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-surface-border bg-white/90 p-4 backdrop-blur-xl lg:hidden">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setVisitOpen(true)}
            className="btn-secondary flex-1 py-3 text-sm"
          >
            Agendar Visita
          </button>
          <button type="button" className="btn-primary flex-1 py-3 text-sm">
            Cotizar evento
          </button>
        </div>
      </div>

      <VisitBookingModal
        isOpen={visitOpen}
        onClose={() => setVisitOpen(false)}
        profile={profile}
        agenda={agenda}
      />

      <footer className="border-t border-surface-border bg-white py-6 pb-24 lg:pb-6">
        <div className="section-container flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <Link to="/" className="font-semibold text-primary hover:underline">
            EvenTop Marketplace
          </Link>
          <span>Vitrina pública · RF-001 · RF-004 · RF-008</span>
        </div>
      </footer>
    </div>
  )
}
