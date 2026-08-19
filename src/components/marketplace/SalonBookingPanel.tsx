import { Calendar, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatPrice } from '../../data/salon-profile-defaults'
import type { SalonProfile } from '../../types/salon-profile'

export type TimeSlot = 'manana' | 'tarde' | 'noche'

export interface SalonBookingSelection {
  date: string
  timeSlot: TimeSlot
  guests: number
}

interface SalonBookingPanelProps {
  profile: SalonProfile
  priceFrom: number
  onConsult: (selection: SalonBookingSelection) => void
  onScheduleVisit?: () => void
  className?: string
}

const TIME_SLOTS: { id: TimeSlot; label: string; hint?: string }[] = [
  { id: 'manana', label: 'Mañana' },
  { id: 'tarde', label: 'Tarde' },
  { id: 'noche', label: 'Noche', hint: '(Personalizado)' },
]

const GUEST_OPTIONS = [30, 50, 80, 100, 120, 150]

function formatMonthYear(date: Date) {
  return date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
}

function toIsoDate(date: Date) {
  return date.toISOString().split('T')[0]
}

export function SalonBookingPanel({
  profile,
  priceFrom,
  onConsult,
  onScheduleVisit,
  className = '',
}: SalonBookingPanelProps) {
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState('')
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('tarde')
  const [guests, setGuests] = useState(
    Math.min(50, profile.capacityMax),
  )

  const guestOptions = useMemo(
    () =>
      GUEST_OPTIONS.filter(
        (n) => n >= profile.capacityMin && n <= profile.capacityMax,
      ).concat(
        !GUEST_OPTIONS.includes(profile.capacityMax) ? [profile.capacityMax] : [],
      ),
    [profile.capacityMin, profile.capacityMax],
  )

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const startOffset = (firstDay.getDay() + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const cells: Array<{ date: Date | null; iso: string; disabled: boolean; occupied: boolean }> = []

    for (let i = 0; i < startOffset; i++) {
      cells.push({ date: null, iso: '', disabled: true, occupied: false })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const iso = toIsoDate(date)
      const disabled = date < today
      const occupied = !disabled && (day % 7 === 0 || day % 11 === 0)
      cells.push({ date, iso, disabled: disabled || occupied, occupied })
    }

    return cells
  }, [viewDate])

  const handleConsult = () => {
    onConsult({
      date: selectedDate,
      timeSlot,
      guests,
    })
  }

  return (
    <aside className={`mk-card p-6 lg:sticky lg:top-28 ${className}`}>
      <p className="text-sm text-ink-muted">Desde</p>
      <p className="mt-1 text-[1.75rem] font-semibold tracking-tight text-ink">
        {formatPrice(priceFrom, profile.currency)}
        <span className="ml-1 text-base font-normal text-ink-muted">por evento</span>
      </p>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold capitalize text-ink">{formatMonthYear(viewDate)}</p>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() =>
                setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
              }
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-[#f5f5f7]"
              aria-label="Mes anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
              }
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-[#f5f5f7]"
              aria-label="Mes siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-ink-muted">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-1">
          {calendarDays.map((cell, index) => {
            if (!cell.date) {
              return <span key={`empty-${index}`} />
            }

            const isSelected = cell.iso === selectedDate
            return (
              <button
                key={cell.iso}
                type="button"
                disabled={cell.disabled}
                onClick={() => setSelectedDate(cell.iso)}
                className={`flex h-9 items-center justify-center rounded-full text-sm transition-colors ${
                  isSelected
                    ? 'bg-primary font-semibold text-white'
                    : cell.occupied
                      ? 'bg-primary/10 text-primary/50 line-through'
                      : cell.disabled
                        ? 'text-ink-muted/40'
                        : 'text-ink hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {cell.date.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Horario del evento
        </p>
        <div className="grid gap-2">
          {TIME_SLOTS.map((slot) => {
            const active = timeSlot === slot.id
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => setTimeSlot(slot.id)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                  active
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-black/[0.08] bg-[#f5f5f7] text-ink hover:border-primary/20'
                }`}
              >
                <span>
                  {slot.label}{' '}
                  {slot.hint && <span className="font-normal text-ink-muted">{slot.hint}</span>}
                </span>
                {active && <Check className="h-4 w-4 shrink-0" />}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6">
        <label
          htmlFor="salon-guests"
          className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted"
        >
          Cantidad de invitados
        </label>
        <select
          id="salon-guests"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="mk-input"
        >
          {guestOptions.map((n) => (
            <option key={n} value={n}>
              Hasta {n} invitados
            </option>
          ))}
        </select>
      </div>

      <button type="button" onClick={handleConsult} className="mk-btn-primary mt-6 w-full !py-3.5">
        Consultar disponibilidad
      </button>

      {onScheduleVisit && (
        <button type="button" onClick={onScheduleVisit} className="mk-btn-soft mt-3 w-full !py-3">
          <Calendar className="h-4 w-4" />
          Agendar visita técnica
        </button>
      )}
    </aside>
  )
}
