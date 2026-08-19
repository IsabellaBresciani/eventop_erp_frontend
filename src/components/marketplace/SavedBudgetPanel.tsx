import { Calculator, Save } from 'lucide-react'
import { useMemo, useState } from 'react'
import { calculateBudgetLines, saveHostBudget } from '../../data/marketplace-venues'
import { formatPrice } from '../../data/salon-profile-defaults'
import type { SalonProfile } from '../../types/salon-profile'

interface SavedBudgetPanelProps {
  profile: SalonProfile
  salonId: string
}

export function SavedBudgetPanel({ profile, salonId }: SavedBudgetPanelProps) {
  const activeServices = (profile.services ?? []).filter((s) => s.status === 'ACTIVE')
  const [selected, setSelected] = useState<number[]>(() =>
    activeServices.slice(0, 2).map((s) => s.id),
  )
  const [guests, setGuests] = useState(50)
  const [eventDate, setEventDate] = useState('')
  const [saved, setSaved] = useState(false)

  const lines = useMemo(
    () => calculateBudgetLines(profile, selected, guests),
    [profile, selected, guests],
  )

  const total = lines.reduce((sum, line) => sum + line.total, 0)

  const toggleService = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )
    setSaved(false)
  }

  const handleSave = () => {
    saveHostBudget({
      salonId,
      salonName: profile.name,
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      guests,
      lines,
      total,
    })
    setSaved(true)
  }

  return (
    <div className="mk-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
          <Calculator className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-ink">Armá tu presupuesto</h3>
          <p className="text-[10px] text-ink-muted">Seleccioná servicios y guardalo</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-muted">Invitados</label>
          <input
            type="number"
            min={profile.capacityMin}
            max={profile.capacityMax}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="mk-input"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-muted">Fecha del evento</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="mk-input"
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold text-ink-muted">Servicios incluidos</p>
        {activeServices.map((service) => (
          <label
            key={service.id}
            className="flex cursor-pointer items-start gap-2 rounded-xl border border-surface-border p-3 text-sm"
          >
            <input
              type="checkbox"
              checked={selected.includes(service.id)}
              onChange={() => toggleService(service.id)}
              className="mt-0.5 accent-primary"
            />
            <span className="flex-1">
              <span className="font-medium text-ink">{service.name}</span>
              <span className="mt-0.5 block text-xs text-ink-muted">
                {formatPrice(service.basePrice, profile.currency)}
              </span>
            </span>
          </label>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-secondary/50 p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Total estimado</p>
        <p className="mt-1 text-2xl font-bold text-ink">{formatPrice(total, profile.currency)}</p>
        {lines.map((line) => (
          <p key={line.serviceId} className="mt-1 text-xs text-ink-muted">
            {line.serviceName}: {formatPrice(line.total, profile.currency)}
          </p>
        ))}
      </div>

      <button type="button" onClick={handleSave} className="mk-btn-primary mt-4 w-full">
        <Save className="h-4 w-4" />
        Guardar presupuesto
      </button>

      {saved && (
        <p className="mt-2 text-center text-xs text-emerald-600">
          Presupuesto guardado en tu cuenta.
        </p>
      )}
    </div>
  )
}
