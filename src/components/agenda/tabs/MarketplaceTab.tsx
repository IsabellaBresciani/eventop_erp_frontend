import { Clock, Shield } from 'lucide-react'
import type { AgendaSettings } from '../../../types/agenda-settings'
import { Label, SettingsCard } from '../SettingsCard'
import { useTranslation } from 'react-i18next'

interface MarketplaceTabProps {
  settings: AgendaSettings
  onChange: (patch: Partial<AgendaSettings>) => void
}

export function MarketplaceTab({ settings, onChange }: MarketplaceTabProps) {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <SettingsCard
        title={t('marketplacetab.margen_de_seguridad_buffer_time')}
        description="Horas obligatorias de limpieza y ventilación entre eventos consecutivos."
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Clock className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <Label htmlFor="buffer-hours">{t('marketplacetab.horas_de_buffer')}</Label>
            <div className="flex items-center gap-2">
              <input
                id="buffer-hours"
                type="number"
                min={0}
                max={12}
                value={settings.bufferHours}
                onChange={(e) => onChange({ bufferHours: Number(e.target.value) })}
                className="input-field w-24"
              />
              <span className="text-sm text-slate-500">
                {t('marketplacetab.horas_entre_eventos')}
              </span>
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title={t('marketplacetab.ventana_de_contratacin')}
        description="Controla cuándo y con cuánta anticipación se pueden realizar reservas."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="min-advance">{t('marketplacetab.antelacin_mnima')}</Label>
            <div className="flex gap-2">
              <input
                id="min-advance"
                type="number"
                min={1}
                value={settings.minAdvanceValue}
                onChange={(e) => onChange({ minAdvanceValue: Number(e.target.value) })}
                className="input-field flex-1"
              />
              <select
                value={settings.minAdvanceUnit}
                onChange={(e) => onChange({ minAdvanceUnit: e.target.value as 'hours' | 'days' })}
                className="input-field w-28"
              >
                <option value="hours">{t('marketplacetab.horas')}</option>
                <option value="days">{t('marketplacetab.das')}</option>
              </select>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              {t('marketplacetab.evita_reservas_de_ltimo_momento')}
            </p>
          </div>

          <div>
            <Label htmlFor="max-advance">{t('marketplacetab.antelacin_mxima')}</Label>
            <div className="flex items-center gap-2">
              <input
                id="max-advance"
                type="number"
                min={1}
                max={24}
                value={settings.maxAdvanceMonths}
                onChange={(e) => onChange({ maxAdvanceMonths: Number(e.target.value) })}
                className="input-field flex-1"
              />
              <span className="text-sm text-slate-500">{t('marketplacetab.meses')}</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              {t('marketplacetab.protege_contra_inflacin_a_largo_plazo')}
            </p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title={t('marketplacetab.vencimiento_automtico')}
        description="Temporizador de bloqueo temporal para liberar fechas sin seña registrada."
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <Label htmlFor="quote-expiry">{t('marketplacetab.bloqueo_temporal')}</Label>
            <div className="flex items-center gap-2">
              <input
                id="quote-expiry"
                type="number"
                min={12}
                max={168}
                value={settings.quoteExpiryHours}
                onChange={(e) => onChange({ quoteExpiryHours: Number(e.target.value) })}
                className="input-field w-24"
              />
              <span className="text-sm text-slate-500">
                {t('marketplacetab.horas_para_registrar_la_sea_del_presupue')}
              </span>
            </div>
          </div>
        </div>
      </SettingsCard>
    </div>
  )
}
