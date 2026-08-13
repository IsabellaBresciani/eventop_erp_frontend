import { SALON_TYPE_OPTIONS } from '../../../data/salon-profile-defaults'
import type { FieldErrors, SalonProfile, SalonType } from '../../../types/salon-profile'
import { FormField, StepCard } from '../FormField'
import { useTranslation } from 'react-i18next'

interface GeneralStepProps {
  profile: SalonProfile
  errors: FieldErrors
  onChange: (patch: Partial<SalonProfile>) => void
  embedded?: boolean
  hideLabels?: boolean
}

export function GeneralStep({ profile, errors, onChange, embedded, hideLabels }: GeneralStepProps) {
  const { t } = useTranslation()
  const toggleType = (type: SalonType) => {
    const types = profile.types.includes(type)
      ? profile.types.filter((t) => t !== type)
      : [...profile.types, type]
    onChange({ types })
  }

  return (
    <StepCard title={t('generalstep.general')} embedded={embedded}>
      <div className="space-y-5">
        <FormField
          label={t('generalstep.nombre_del_saln')}
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
            placeholder={t('generalstep.nombre_del_saln_1')}
            className="input-field text-lg font-semibold"
          />
        </FormField>

        <FormField
          label={t('generalstep.tipo_de_saln')}
          required
          error={errors.types}
          hideLabel={hideLabels}
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
          label={t('generalstep.descripcin')}
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
            placeholder={t('generalstep.descripcin_del_saln')}
            className="input-field resize-none"
          />
        </FormField>
      </div>
    </StepCard>
  )
}
