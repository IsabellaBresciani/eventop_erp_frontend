import { Calculator, Calendar, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { calculateBudgetEstimate } from '../../data/marketplace'
import type { AgendaSettings } from '../../types/agenda-settings'
import type { SalonProfile } from '../../types/salon-profile'
import { useTranslation } from 'react-i18next'

interface BudgetCalculatorProps {
  profile: SalonProfile
  agenda: AgendaSettings
}

export function BudgetCalculator({ profile, agenda }: BudgetCalculatorProps) {
  const { t } = useTranslation()
  const [guests, setGuests] = useState(80)
  const [date, setDate] = useState('')

  const estimate = useMemo(
    () => calculateBudgetEstimate(profile, agenda, guests, date),
    [profile, agenda, guests, date],
  )

  const minDate = new Date('2026-08-05').toISOString().split('T')[0]
  const maxDate = new Date('2027-08-04').toISOString().split('T')[0]

  return (
    <div className="rounded-card border border-surface-border bg-white p-5 shadow-card lg:sticky lg:top-24">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Calculator className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {t('budgetcalculator.presupuesto_rpido')}
          </h3>
          <p className="text-[10px] text-slate-400">
            {t('budgetcalculator.rf008_estimacin_instantnea')}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label
            htmlFor="calc-guests"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500"
          >
            <Users className="h-3.5 w-3.5" />
            {t('budgetcalculator.cantidad_de_invitados')}
          </label>
          <input
            id="calc-guests"
            type="number"
            min={profile.capacityMin}
            max={profile.capacityMax}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="input-field"
          />
          <input
            type="range"
            min={profile.capacityMin}
            max={profile.capacityMax}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="mt-2 w-full accent-primary"
          />
          <p className="mt-1 text-[10px] text-slate-400">
            {profile.capacityMin}–{profile.capacityMax} {t('budgetcalculator.personas')}
          </p>
        </div>

        <div>
          <label
            htmlFor="calc-date"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500"
          >
            <Calendar className="h-3.5 w-3.5" />
            {t('budgetcalculator.fecha_del_evento')}
          </label>
          <input
            id="calc-date"
            type="date"
            min={minDate}
            max={maxDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div
        className={`mt-4 rounded-xl p-4 ${
          estimate.available
            ? 'border border-primary/20 bg-primary/5'
            : 'border border-red-100 bg-red-50'
        }`}
      >
        {estimate.available ? (
          <>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              {t('budgetcalculator.estimado')}
              {estimate.hours}
              {t('budgetcalculator.h_de_evento')}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{estimate.formattedTotal}</p>
            <p className="mt-1 text-xs text-slate-500">
              {t('budgetcalculator.sea_sugerida')}
              {profile.depositPercent}%):{' '}
              <strong className="text-slate-700">{estimate.formattedDeposit}</strong>
            </p>
            <p className="mt-2 text-[10px] text-slate-400">
              {t('budgetcalculator.incluye_buffer_de')}
              {agenda.bufferHours}
              {t('budgetcalculator.h_precio_orientativo')}
            </p>
          </>
        ) : (
          <p className="text-sm font-medium text-red-600">{estimate.message ?? 'No disponible'}</p>
        )}
      </div>

      <button
        type="button"
        disabled={!estimate.available}
        className="btn-primary mt-4 w-full disabled:opacity-50"
      >
        {t('budgetcalculator.solicitar_presupuesto_formal')}
      </button>
    </div>
  )
}
