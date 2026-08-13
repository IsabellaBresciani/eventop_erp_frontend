import { Bell, CalendarX, Plus, Trash2 } from 'lucide-react'
import type { AgendaSettings } from '../../../types/agenda-settings'
import { Label, SettingsCard } from '../SettingsCard'
import { useTranslation } from 'react-i18next'

interface VisualTabProps {
  settings: AgendaSettings
  onChange: (patch: Partial<AgendaSettings>) => void
}

export function VisualTab({ settings, onChange }: VisualTabProps) {
  const { t } = useTranslation()
  const updateColor = (key: string, color: string) => {
    onChange({
      statusColors: settings.statusColors.map((c) => (c.key === key ? { ...c, color } : c)),
    })
  }

  const addException = () => {
    onChange({
      exceptions: [
        ...settings.exceptions,
        { id: `exc-${Date.now()}`, date: '', label: 'Cierre especial' },
      ],
    })
  }

  const updateException = (id: string, field: 'date' | 'label', value: string) => {
    onChange({
      exceptions: settings.exceptions.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    })
  }

  const removeException = (id: string) => {
    onChange({ exceptions: settings.exceptions.filter((e) => e.id !== id) })
  }

  return (
    <div className="space-y-6">
      <SettingsCard
        title={t('visualtab.paleta_de_estados_rf007')}
        description="Personaliza los colores asociados a cada estado del calendario."
      >
        <div className="space-y-3">
          {settings.statusColors.map((status) => (
            <div
              key={status.key}
              className="flex items-center justify-between rounded-xl border border-surface-border px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded-lg shadow-sm"
                  style={{ backgroundColor: status.color }}
                />
                <span className="text-sm font-medium text-slate-800">{status.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={status.color}
                  onChange={(e) => updateColor(status.key, e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded-lg border border-surface-border bg-white"
                  aria-label={`Color para ${status.label}`}
                />
                <span className="font-mono text-xs text-slate-400">{status.color}</span>
              </div>
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard
        title={t('visualtab.recordatorios_automticos')}
        description="Disparadores de notificación para el administrador."
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bell className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <Label htmlFor="reminder-days">{t('visualtab.avisar_antes_del_evento')}</Label>
            <div className="flex items-center gap-2">
              <input
                id="reminder-days"
                type="number"
                min={1}
                max={30}
                value={settings.reminderDays}
                onChange={(e) => onChange({ reminderDays: Number(e.target.value) })}
                className="input-field w-20"
              />
              <span className="text-sm text-slate-500">
                {t('visualtab.das_antes_si_falta_confirmar_depsito')}
              </span>
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title={t('visualtab.excepciones_horarias')}
        description="Cierres específicos que anulan la configuración general."
      >
        <div className="space-y-3">
          {settings.exceptions.map((exc) => (
            <div
              key={exc.id}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-surface-border bg-surface/30 p-3"
            >
              <CalendarX className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                type="date"
                value={exc.date}
                onChange={(e) => updateException(exc.id, 'date', e.target.value)}
                className="input-field w-40"
              />
              <input
                type="text"
                value={exc.label}
                onChange={(e) => updateException(exc.id, 'label', e.target.value)}
                placeholder={t('visualtab.motivo_del_cierre')}
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={() => removeException(exc.id)}
                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                aria-label="Eliminar excepción"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addException} className="btn-secondary mt-3">
          <Plus className="h-4 w-4" />
          {t('visualtab.aadir_cierre_especfico')}
        </button>
      </SettingsCard>
    </div>
  )
}
