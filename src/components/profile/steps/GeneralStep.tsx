import { SALON_TYPE_OPTIONS } from '../../../data/salon-profile-defaults'
import type { FieldErrors, SalonProfile, SalonType } from '../../../types/salon-profile'
import { FormField, StepCard } from '../FormField'

interface GeneralStepProps {
  profile: SalonProfile
  errors: FieldErrors
  onChange: (patch: Partial<SalonProfile>) => void
}

export function GeneralStep({ profile, errors, onChange }: GeneralStepProps) {
  const toggleType = (type: SalonType) => {
    const types = profile.types.includes(type)
      ? profile.types.filter((t) => t !== type)
      : [...profile.types, type]
    onChange({ types })
  }

  return (
    <StepCard
      title="Información Básica e Identidad"
      description="Datos que definen la identidad de tu salón en el Marketplace."
    >
      <div className="space-y-6">
        <FormField
          label="Nombre del Salón"
          htmlFor="salon-name"
          required
          error={errors.name}
          isComplete={profile.name.trim().length >= 3}
        >
          <input
            id="salon-name"
            type="text"
            value={profile.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Ej: Quinta Los Olivos"
            className="input-field text-lg font-semibold"
          />
        </FormField>

        <FormField
          label="Tipo de Salón"
          required
          error={errors.types}
          isComplete={profile.types.length > 0}
          hint="Seleccioná uno o más tipos para optimizar los filtros de búsqueda."
        >
          <div className="flex flex-wrap gap-2">
            {SALON_TYPE_OPTIONS.map((opt) => {
              const selected = profile.types.includes(opt.id)
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleType(opt.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    selected
                      ? 'border-primary bg-primary text-white shadow-sm'
                      : 'border-surface-border bg-white text-slate-600 hover:border-primary/30 hover:text-primary'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </FormField>

        <FormField
          label="Descripción"
          htmlFor="salon-description"
          required
          error={errors.description}
          isComplete={profile.description.trim().length >= 20}
          hint="Redactá la propuesta de valor y los detalles únicos de tu espacio (mín. 20 caracteres)."
        >
          <textarea
            id="salon-description"
            value={profile.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={6}
            placeholder="Describí tu salón, sus ambientes, servicios destacados y qué lo hace especial..."
            className="input-field resize-none"
          />
          <p className="mt-1 text-right text-xs text-slate-400">
            {profile.description.length} caracteres
          </p>
        </FormField>
      </div>
    </StepCard>
  )
}
