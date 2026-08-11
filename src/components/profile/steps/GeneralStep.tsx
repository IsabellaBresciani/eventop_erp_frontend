import { SALON_TYPE_OPTIONS } from '../../../data/salon-profile-defaults'
import type { FieldErrors, SalonProfile, SalonType } from '../../../types/salon-profile'
import { FormField, StepCard } from '../FormField'

interface GeneralStepProps {
  profile: SalonProfile
  errors: FieldErrors
  onChange: (patch: Partial<SalonProfile>) => void
  embedded?: boolean
  hideLabels?: boolean
}

export function GeneralStep({
  profile,
  errors,
  onChange,
  embedded,
  hideLabels,
}: GeneralStepProps) {
  const toggleType = (type: SalonType) => {
    const types = profile.types.includes(type)
      ? profile.types.filter((t) => t !== type)
      : [...profile.types, type]
    onChange({ types })
  }

  return (
    <StepCard title="General" embedded={embedded}>
      <div className="space-y-5">
        <FormField
          label="Nombre del Salón"
          htmlFor="salon-name"
          required
          error={errors.name}
          hideLabel={hideLabels}
        >
          <input
            id="salon-name"
            type="text"
            value={profile.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Nombre del salón"
            className="input-field text-lg font-semibold"
          />
        </FormField>

        <FormField label="Tipo de Salón" required error={errors.types} hideLabel={hideLabels}>
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
          hideLabel={hideLabels}
        >
          <textarea
            id="salon-description"
            value={profile.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={6}
            placeholder="Descripción del salón"
            className="input-field resize-none"
          />
        </FormField>
      </div>
    </StepCard>
  )
}
