import { AnimatePresence, motion } from 'framer-motion'
import { CalendarPlus, X } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import type { CalendarEvent } from '../../types/dashboard'

export interface NewEventFormData {
  clientName: string
  eventType: string
  date: string
  startTime: string
  endTime: string
  guests: number
  totalAmount: number
}

interface NewEventModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: NewEventFormData) => void
  defaultDate?: string | null
}

const EVENT_TYPES = ['Boda', 'XV Años', 'Cumpleaños', 'Cumpleaños Infantil', 'Corporativo']

export function NewEventModal({ isOpen, onClose, onCreate, defaultDate }: NewEventModalProps) {
  const [clientName, setClientName] = useState('')
  const [eventType, setEventType] = useState(EVENT_TYPES[0])
  const [date, setDate] = useState(defaultDate ?? '')
  const [startTime, setStartTime] = useState('20:00')
  const [endTime, setEndTime] = useState('04:00')
  const [guests, setGuests] = useState(80)
  const [totalAmount, setTotalAmount] = useState(500000)

  useEffect(() => {
    if (isOpen && defaultDate) setDate(defaultDate)
  }, [isOpen, defaultDate])

  const resetForm = () => {
    setClientName('')
    setEventType(EVENT_TYPES[0])
    setDate(defaultDate ?? '')
    setStartTime('20:00')
    setEndTime('04:00')
    setGuests(80)
    setTotalAmount(500000)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!clientName.trim() || !date) return

    onCreate({
      clientName: clientName.trim(),
      eventType,
      date,
      startTime,
      endTime,
      guests,
      totalAmount,
    })
    resetForm()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="dash-overlay z-50"
            onClick={handleClose}
            aria-label="Cerrar"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="dash-modal fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 p-6 sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <CalendarPlus className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-ink">Nuevo evento</h2>
                  <p className="text-sm text-ink-muted">Cargá los datos básicos del evento</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-2 text-apple-label transition-colors hover:bg-black/[0.04] hover:text-ink-muted"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Cliente">
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Nombre y apellido"
                  className="input-field"
                  required
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Tipo de evento">
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="input-field"
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Fecha">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-field"
                    required
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Hora inicio">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="input-field"
                    required
                  />
                </Field>
                <Field label="Hora fin">
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="input-field"
                    required
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Invitados estimados">
                  <input
                    type="number"
                    min={1}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="input-field"
                    required
                  />
                </Field>
                <Field label="Presupuesto (ARS)">
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    className="input-field"
                    required
                  />
                </Field>
              </div>

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={handleClose} className="btn-secondary px-5 py-2.5">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary px-5 py-2.5">
                  Crear evento
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-ink-muted">{label}</span>
      {children}
    </label>
  )
}

export function buildCalendarEventFromForm(data: NewEventFormData): CalendarEvent {
  const id = `evt-${Date.now()}`
  const slug = data.clientName.toLowerCase().replace(/\s+/g, '-').slice(0, 24)

  return {
    id,
    date: data.date,
    clientName: data.clientName,
    eventType: data.eventType,
    status: 'presupuestado',
    startTime: data.startTime,
    endTime: data.endTime,
    bufferHours: 2,
    totalAmount: data.totalAmount,
    depositPaid: 0,
    guests: data.guests,
    confirmedGuests: 0,
    maxCapacity: Math.max(data.guests + 20, 50),
    phone: '',
    email: '',
    services: [],
    payments: [],
    auditLog: [
      {
        id: `al-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: 'Sistema',
        action: 'Evento creado',
        detail: 'Nuevo evento desde el dashboard',
      },
    ],
    invitationUrl: `https://eventop.com/inv/${slug}`,
    assignedEmployeeIds: [],
  }
}
