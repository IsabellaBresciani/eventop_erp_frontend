import type { InvitationConfig } from '../../types/invitation'
import { Toggle } from '../agenda/SettingsCard'

interface AjustesPanelProps {
  config: InvitationConfig
  onChange: (patch: Partial<InvitationConfig>) => void
}

export function AjustesPanel({ config, onChange }: AjustesPanelProps) {
  return (
    <div className="space-y-5">
      <div>
        <label
          htmlFor="rsvp-deadline"
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          Límite para confirmar asistencia
        </label>
        <input
          id="rsvp-deadline"
          type="date"
          value={config.rsvpDeadline}
          onChange={(e) => onChange({ rsvpDeadline: e.target.value })}
          className="input-field"
        />
        <p className="mt-1 text-[11px] text-slate-400">
          Después de esta fecha el formulario de RSVP se cerrará automáticamente.
        </p>
      </div>

      <Toggle
        enabled={config.allowPlusOnes}
        onChange={(allowPlusOnes) => onChange({ allowPlusOnes })}
        label="Permitir acompañantes (+1)"
        description="Los invitados podrán sumar acompañantes al confirmar"
      />

      {config.allowPlusOnes && (
        <div>
          <label
            htmlFor="max-companions"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Máximo de acompañantes por invitado
          </label>
          <input
            id="max-companions"
            type="number"
            min={0}
            max={10}
            value={config.maxCompanions}
            onChange={(e) => onChange({ maxCompanions: Number(e.target.value) || 0 })}
            className="input-field"
          />
        </div>
      )}

      <Toggle
        enabled={config.countdownEnabled}
        onChange={(countdownEnabled) => onChange({ countdownEnabled })}
        label="Cuenta regresiva"
        description="Muestra los días restantes hasta el evento en la invitación"
      />
    </div>
  )
}
