import { Plus, Trash2, Users } from 'lucide-react'
import { WEEKDAY_LABELS } from '../../../data/agenda-defaults'
import type { AgendaSettings, VisitCapacity, Weekday } from '../../../types/agenda-settings'
import { SettingsCard, Toggle } from '../SettingsCard'

interface VisitsTabProps {
  settings: AgendaSettings
  onChange: (patch: Partial<AgendaSettings>) => void
}

export function VisitsTab({ settings, onChange }: VisitsTabProps) {
  const updatePreQual = (key: keyof AgendaSettings['preQualification'], value: boolean) => {
    onChange({ preQualification: { ...settings.preQualification, [key]: value } })
  }

  const addSlot = () => {
    const newSlot = {
      id: `vs-${Date.now()}`,
      day: 'sat' as Weekday,
      startTime: '10:00',
      endTime: '12:00',
    }
    onChange({ visitSlots: [...settings.visitSlots, newSlot] })
  }

  const removeSlot = (id: string) => {
    onChange({ visitSlots: settings.visitSlots.filter((s) => s.id !== id) })
  }

  const updateSlot = (id: string, field: string, value: string) => {
    onChange({
      visitSlots: settings.visitSlots.map((s) =>
        s.id === id ? { ...s, [field]: value } : s,
      ),
    })
  }

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Capacidad de Visitas"
        description="Define cómo se reciben los clientes interesados en conocer el salón."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              { value: 'individual', label: 'Individuales', desc: 'Una visita por franja horaria' },
              { value: 'group', label: 'Open House', desc: 'Visitas grupales simultáneas' },
            ] as { value: VisitCapacity; label: string; desc: string }[]
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ visitCapacity: opt.value })}
              className={`rounded-xl border p-4 text-left transition-all ${
                settings.visitCapacity === opt.value
                  ? 'border-primary/40 bg-primary/5 ring-2 ring-primary/20'
                  : 'border-surface-border hover:border-primary/20'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className={`h-4 w-4 ${settings.visitCapacity === opt.value ? 'text-primary' : 'text-slate-400'}`} />
                <span className="text-sm font-semibold text-slate-900">{opt.label}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{opt.desc}</p>
            </button>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard
        title="Agenda de Visitas Técnicas"
        description="Franjas horarias donde se reciben clientes para mostrar el salón (RF-004)."
      >
        <div className="space-y-3">
          {settings.visitSlots.map((slot) => (
            <div
              key={slot.id}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-surface-border bg-surface/30 p-3"
            >
              <select
                value={slot.day}
                onChange={(e) => updateSlot(slot.id, 'day', e.target.value)}
                className="input-field w-36"
              >
                {(Object.keys(WEEKDAY_LABELS) as Weekday[]).map((d) => (
                  <option key={d} value={d}>
                    {WEEKDAY_LABELS[d]}
                  </option>
                ))}
              </select>
              <input
                type="time"
                value={slot.startTime}
                onChange={(e) => updateSlot(slot.id, 'startTime', e.target.value)}
                className="input-field w-32"
              />
              <span className="text-slate-400">a</span>
              <input
                type="time"
                value={slot.endTime}
                onChange={(e) => updateSlot(slot.id, 'endTime', e.target.value)}
                className="input-field w-32"
              />
              <button
                type="button"
                onClick={() => removeSlot(slot.id)}
                className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                aria-label="Eliminar franja"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addSlot} className="btn-secondary mt-3 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Agregar franja horaria
        </button>
      </SettingsCard>

      <SettingsCard
        title="Pre-Calificación"
        description="Datos obligatorios antes de agendar una visita técnica."
      >
        <div className="space-y-3">
          <Toggle
            enabled={settings.preQualification.eventType}
            onChange={(v) => updatePreQual('eventType', v)}
            label="Tipo de evento"
            description="El cliente debe indicar qué tipo de evento planea"
          />
          <Toggle
            enabled={settings.preQualification.guests}
            onChange={(v) => updatePreQual('guests', v)}
            label="Cantidad de invitados"
            description="Estimación de aforo requerido"
          />
          <Toggle
            enabled={settings.preQualification.budget}
            onChange={(v) => updatePreQual('budget', v)}
            label="Presupuesto estimado"
            description="Rango de inversión del cliente"
          />
        </div>
      </SettingsCard>
    </div>
  )
}
