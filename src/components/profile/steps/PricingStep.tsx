import { Plus, Trash2 } from 'lucide-react'
import type { FieldErrors, SalonProfile } from '../../../types/salon-profile'
import { FormField, StepCard } from '../FormField'
import { useTranslation } from 'react-i18next'

interface PricingStepProps {
  profile: SalonProfile
  errors: FieldErrors
  onChange: (patch: Partial<SalonProfile>) => void
  embedded?: boolean
  hideLabels?: boolean
}

export function PricingStep({ profile, errors, onChange, embedded, hideLabels }: PricingStepProps) {
  const { t } = useTranslation()
  const updatePackage = (id: string, field: string, value: string | number) => {
    onChange({
      packages: profile.packages.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    })
  }

  const addPackage = () => {
    onChange({
      packages: [
        ...profile.packages,
        {
          id: `pkg-${Date.now()}`,
          name: '',
          minPrice: 0,
          maxPrice: 0,
          description: '',
        },
      ],
    })
  }

  const removePackage = (id: string) => {
    onChange({ packages: profile.packages.filter((p) => p.id !== id) })
  }

  return (
    <StepCard title={t('pricingstep.precios')} embedded={embedded}>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label={t('pricingstep.capacidad_mnima')}
            htmlFor="capacity-min"
            required
            error={errors.capacityMin}
            hideLabel={hideLabels}
          >
            <div className="flex items-center gap-2">
              <input
                id="capacity-min"
                type="number"
                min={1}
                value={profile.capacityMin}
                onChange={(e) => onChange({ capacityMin: Number(e.target.value) })}
                placeholder={t('pricingstep.mn')}
                className="input-field"
              />
              <span className="text-sm text-slate-500">{t('pricingstep.personas')}</span>
            </div>
          </FormField>

          <FormField
            label={t('pricingstep.capacidad_mxima')}
            htmlFor="capacity-max"
            required
            error={errors.capacityMax}
            hideLabel={hideLabels}
          >
            <div className="flex items-center gap-2">
              <input
                id="capacity-max"
                type="number"
                min={1}
                value={profile.capacityMax}
                onChange={(e) => onChange({ capacityMax: Number(e.target.value) })}
                placeholder={t('pricingstep.mx')}
                className="input-field"
              />
              <span className="text-sm text-slate-500">{t('pricingstep.personas')}</span>
            </div>
          </FormField>
        </div>

        <FormField
          label={t('pricingstep.precio_base_por_hora')}
          required
          error={errors.pricePerHour}
          hideLabel={hideLabels}
        >
          <div className="flex gap-2">
            <select
              value={profile.currency}
              onChange={(e) => onChange({ currency: e.target.value as SalonProfile['currency'] })}
              className="input-field w-24 font-semibold text-primary"
            >
              <option value="ARS">{t('pricingstep.ars')}</option>
              <option value="USD">{t('pricingstep.usd')}</option>
            </select>
            <input
              type="number"
              min={0}
              value={profile.pricePerHour}
              onChange={(e) => onChange({ pricePerHour: Number(e.target.value) })}
              className="input-field flex-1 font-semibold text-primary"
              placeholder={t('pricingstep.precio_por_hora')}
            />
          </div>
        </FormField>

        <div>
          <div className="mb-3 flex items-center justify-end">
            <button type="button" onClick={addPackage} className="btn-ghost py-1 text-xs">
              <Plus className="h-3.5 w-3.5" />
              {t('pricingstep.agregar_paquete')}
            </button>
          </div>

          <div className="space-y-3">
            {profile.packages.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-xl border border-surface-border bg-surface/30 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <input
                    type="text"
                    value={pkg.name}
                    onChange={(e) => updatePackage(pkg.id, 'name', e.target.value)}
                    className="input-field border-0 bg-transparent px-0 font-semibold focus:shadow-none"
                    placeholder={t('pricingstep.nombre_del_paquete')}
                  />
                  <button
                    type="button"
                    onClick={() => removePackage(pkg.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <input
                    type="number"
                    value={pkg.minPrice}
                    onChange={(e) => updatePackage(pkg.id, 'minPrice', Number(e.target.value))}
                    placeholder={t('pricingstep.precio_mnimo')}
                    className="input-field"
                  />
                  <input
                    type="number"
                    value={pkg.maxPrice}
                    onChange={(e) => updatePackage(pkg.id, 'maxPrice', Number(e.target.value))}
                    placeholder={t('pricingstep.precio_mximo')}
                    className="input-field"
                  />
                </div>
                <input
                  type="text"
                  value={pkg.description}
                  onChange={(e) => updatePackage(pkg.id, 'description', e.target.value)}
                  placeholder={t('pricingstep.descripcin')}
                  className="input-field mt-2"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={t('pricingstep.poltica_de_cancelacin')} hideLabel={hideLabels}>
            <div className="grid grid-cols-2 gap-2">
              {(['flexible', 'strict'] as const).map((policy) => (
                <button
                  key={policy}
                  type="button"
                  onClick={() => onChange({ cancellationPolicy: policy })}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium capitalize transition-all ${
                    profile.cancellationPolicy === policy
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-surface-border hover:border-primary/20'
                  }`}
                >
                  {policy === 'flexible' ? 'Flexible' : 'Estricta'}
                </button>
              ))}
            </div>
          </FormField>

          <FormField
            label={t('pricingstep.depsito')}
            htmlFor="deposit-percent"
            hideLabel={hideLabels}
          >
            <div className="flex items-center gap-2">
              <input
                id="deposit-percent"
                type="number"
                min={0}
                max={100}
                value={profile.depositPercent}
                onChange={(e) => onChange({ depositPercent: Number(e.target.value) })}
                className="input-field w-24"
                placeholder="%"
              />
              <span className="text-sm text-slate-500">{t('pricingstep.sea')}</span>
            </div>
          </FormField>
        </div>
      </div>
    </StepCard>
  )
}
