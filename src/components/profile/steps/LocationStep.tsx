import { MapPin, Navigation } from 'lucide-react'
import type { FieldErrors, SalonProfile } from '../../../types/salon-profile'
import { FormField, StepCard } from '../FormField'

interface LocationStepProps {
  profile: SalonProfile
  errors: FieldErrors
  onChange: (patch: Partial<SalonProfile>) => void
}

const ADDRESS_SUGGESTIONS = [
  'Av. Libertador 12.450, Vicente López',
  'Av. del Libertador 5800, Palermo',
  'Ruta 9 Km 52, Pilar',
  'Av. San Martín 2100, San Isidro',
]

export function LocationStep({ profile, errors, onChange }: LocationStepProps) {
  const movePin = (dx: number, dy: number) => {
    onChange({
      lat: Math.max(-90, Math.min(90, profile.lat + dy)),
      lng: Math.max(-180, Math.min(180, profile.lng + dx)),
    })
  }

  const pinX = ((profile.lng + 58.6) / 0.4) * 100
  const pinY = ((profile.lat + 34.7) / 0.4) * 100

  return (
    <StepCard
      title="Ubicación y Geocalización"
      description="Normalizá la dirección para mejorar el posicionamiento en búsquedas locales."
    >
      <div className="space-y-6">
        <FormField
          label="Dirección Inteligente"
          htmlFor="salon-address"
          required
          error={errors.address}
          isComplete={profile.address.trim().length >= 5}
          hint="Autocompletado integrado con mapas."
        >
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="salon-address"
              type="text"
              value={profile.address}
              onChange={(e) => onChange({ address: e.target.value })}
              list="address-suggestions"
              placeholder="Ingresá la dirección del salón"
              className="input-field pl-10"
            />
            <datalist id="address-suggestions">
              {ADDRESS_SUGGESTIONS.map((a) => (
                <option key={a} value={a} />
              ))}
            </datalist>
          </div>
        </FormField>

        <FormField
          label="Zona / Barrio"
          htmlFor="salon-neighborhood"
          required
          error={errors.neighborhood}
          isComplete={profile.neighborhood.trim().length >= 2}
        >
          <input
            id="salon-neighborhood"
            type="text"
            value={profile.neighborhood}
            onChange={(e) => onChange({ neighborhood: e.target.value })}
            placeholder="Ej: Vicente López, Zona Norte"
            className="input-field"
          />
        </FormField>

        <FormField label="Mapa Interactivo" hint="Arrastrá el pin para confirmar la posición exacta.">
          <div className="relative h-56 overflow-hidden rounded-xl border border-surface-border bg-gradient-to-br from-primary/5 via-surface to-emerald-50">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(#5e17eb 1px, transparent 1px), linear-gradient(90deg, #5e17eb 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="absolute left-3 top-3 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-medium text-slate-600 backdrop-blur-sm">
              {profile.lat.toFixed(4)}, {profile.lng.toFixed(4)}
            </div>

            <div
              className="absolute -translate-x-1/2 -translate-y-full cursor-grab transition-all active:cursor-grabbing"
              style={{
                left: `${Math.max(10, Math.min(90, pinX))}%`,
                top: `${Math.max(15, Math.min(85, 100 - pinY))}%`,
              }}
            >
              <MapPin className="h-8 w-8 text-primary drop-shadow-lg" fill="#5e17eb" />
            </div>

            <div className="absolute bottom-3 right-3 flex gap-1">
              {[
                { label: '←', action: () => movePin(-0.01, 0) },
                { label: '→', action: () => movePin(0.01, 0) },
                { label: '↑', action: () => movePin(0, 0.01) },
                { label: '↓', action: () => movePin(0, -0.01) },
              ].map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={btn.action}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-sm font-bold text-slate-600 shadow-sm backdrop-blur-sm hover:bg-primary hover:text-white"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </FormField>

        <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-3 text-sm text-primary">
          <Navigation className="h-4 w-4 shrink-0" />
          <span>La ubicación se sincroniza automáticamente con Google Maps en el Marketplace.</span>
        </div>
      </div>
    </StepCard>
  )
}
