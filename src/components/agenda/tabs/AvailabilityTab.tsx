import { ChevronDown } from 'lucide-react'
import { SLOT_OPTIONS, WEEKDAY_LABELS } from '../../../data/agenda-defaults'
import type { AgendaSettings, Weekday } from '../../../types/agenda-settings'
import { Label, SettingsCard, Toggle } from '../SettingsCard'

interface AvailabilityTabProps {
  settings: AgendaSettings
  onChange: (patch: Partial<AgendaSettings>) => void
}

export function AvailabilityTab({ settings, onChange }: AvailabilityTabProps) {
  const toggleDay = (day: Weekday) => {
    onChange({
      openDays: { ...settings.openDays, [day]: !settings.openDays[day] },
    })
  }

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Granularidad del Slot"
        description="Define la escala visual del calendario operativo y del Marketplace."
      >
        <Label htmlFor="slot-granularity">Intervalo de tiempo</Label>
        <div className="relative">
          <select
            id="slot-granularity"
            value={settings.slotGranularity}
            onChange={(e) =>
              onChange({ slotGranularity: Number(e.target.value) as AgendaSettings['slotGranularity'] })
            }
            className="input-field appearance-none pr-10"
          >
            {SLOT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Disponibilidad Semanal"
        description="Los días desmarcados se bloquean automáticamente en el Marketplace."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(WEEKDAY_LABELS) as Weekday[]).map((day) => {
            const isOpen = settings.openDays[day]
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                  isOpen
                    ? 'border-primary/30 bg-primary/5 hover:border-primary/50'
                    : 'border-surface-border bg-surface/50 hover:border-slate-300'
                }`}
              >
                <span className={`text-sm font-medium ${isOpen ? 'text-primary' : 'text-slate-400'}`}>
                  {WEEKDAY_LABELS[day]}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    isOpen ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isOpen ? 'Abierto' : 'Bloqueado'}
                </span>
              </button>
            )
          })}
        </div>
        {!settings.openDays.mon && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Los lunes están bloqueados y no aparecerán como disponibles en el Marketplace.
          </p>
        )}
      </SettingsCard>

      <SettingsCard
        title="Feriados Nacionales"
        description="Importa y bloquea automáticamente los días festivos de Argentina."
      >
        <Toggle
          enabled={settings.blockHolidays}
          onChange={(blockHolidays) => onChange({ blockHolidays })}
          label="Bloquear feriados automáticamente"
          description="Incluye feriados nacionales oficiales en el calendario del salón y del Marketplace."
        />
      </SettingsCard>
    </div>
  )
}
