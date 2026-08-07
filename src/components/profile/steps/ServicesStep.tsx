import {
  Car,
  ChefHat,
  Radio,
  Wifi,
} from 'lucide-react'
import { type ComponentType } from 'react'
import type { SalonProfile } from '../../../types/salon-profile'
import { StepCard } from '../FormField'

const AMENITY_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  catering: ChefHat,
  parking: Car,
  sound: Radio,
}

interface ServicesStepProps {
  profile: SalonProfile
  onChange: (patch: Partial<SalonProfile>) => void
}

export function ServicesStep({ profile, onChange }: ServicesStepProps) {
  const toggleAmenity = (id: string, field: 'enabled' | 'included') => {
    onChange({
      amenities: profile.amenities.map((a) =>
        a.id === id ? { ...a, [field]: !a[field] } : a,
      ),
    })
  }

  return (
    <StepCard
      title="Amenidades y Servicios"
      description="RF-009 — Activá los servicios incluidos o adicionales de tu salón."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {profile.amenities.map((amenity) => {
          const Icon = AMENITY_ICONS[amenity.id] ?? Wifi
          return (
            <div
              key={amenity.id}
              className={`rounded-xl border p-4 transition-all ${
                amenity.enabled
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-surface-border bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    amenity.enabled ? 'bg-primary text-white' : 'bg-surface text-slate-400'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{amenity.label}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleAmenity(amenity.id, 'enabled')}
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                        amenity.enabled
                          ? 'bg-primary text-white'
                          : 'bg-surface text-slate-500 hover:bg-primary/10 hover:text-primary'
                      }`}
                    >
                      {amenity.enabled ? 'Activo' : 'Inactivo'}
                    </button>

                    {amenity.enabled && (
                      <button
                        type="button"
                        onClick={() => toggleAmenity(amenity.id, 'included')}
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                          amenity.included
                            ? 'bg-emerald-500 text-white'
                            : 'border border-surface-border bg-white text-slate-500'
                        }`}
                      >
                        {amenity.included ? 'Incluido' : 'Adicional'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Los servicios activos aparecerán en tu vitrina del Marketplace
      </p>
    </StepCard>
  )
}
