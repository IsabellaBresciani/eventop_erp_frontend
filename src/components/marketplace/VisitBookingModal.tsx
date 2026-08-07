import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, Clock, Users, X } from 'lucide-react'
import { useState } from 'react'
import { getVisitSlotsForDate } from '../../data/marketplace'
import { WEEKDAY_LABELS } from '../../data/agenda-defaults'
import type { AgendaSettings } from '../../types/agenda-settings'
import type { SalonProfile } from '../../types/salon-profile'

interface VisitBookingModalProps {
  isOpen: boolean
  onClose: () => void
  profile: SalonProfile
  agenda: AgendaSettings
}

export function VisitBookingModal({ isOpen, onClose, profile, agenda }: VisitBookingModalProps) {
  const [date, setDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const slots = getVisitSlotsForDate(agenda, date)
  const minDate = new Date('2026-08-05').toISOString().split('T')[0]

  const handleSubmit = () => {
    if (!date || !selectedSlot) return
    setSubmitted(true)
  }

  const reset = () => {
    setSubmitted(false)
    setDate('')
    setSelectedSlot(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm"
            onClick={reset}
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-card border border-surface-border bg-white p-6 shadow-2xl sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:-translate-x-1/2 sm:-translate-y-1/2"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Agendar Visita</h3>
                <p className="text-xs text-slate-500">RF-004 · {profile.name}</p>
              </div>
              <button type="button" onClick={reset} className="rounded-lg p-1.5 text-slate-400 hover:bg-surface">
                <X className="h-5 w-5" />
              </button>
            </div>

            {submitted ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <p className="font-semibold text-slate-900">¡Visita agendada!</p>
                <p className="mt-1 text-sm text-slate-500">
                  Te contactaremos para confirmar tu visita técnica.
                </p>
                <button type="button" onClick={reset} className="btn-primary mt-4 w-full">
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label htmlFor="visit-date" className="mb-1.5 block text-xs font-semibold text-slate-500">
                    Elegí una fecha
                  </label>
                  <input
                    id="visit-date"
                    type="date"
                    min={minDate}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value)
                      setSelectedSlot(null)
                    }}
                    className="input-field"
                  />
                </div>

                {date && (
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-semibold text-slate-500">
                      Franjas disponibles
                      {agenda.visitCapacity === 'group' && (
                        <span className="ml-1 text-primary">(Open House)</span>
                      )}
                    </p>
                    {slots.length > 0 ? (
                      <div className="space-y-2">
                        {slots.map((slot) => (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setSelectedSlot(slot.id)}
                            className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                              selectedSlot === slot.id
                                ? 'border-primary bg-primary/5'
                                : 'border-surface-border hover:border-primary/20'
                            }`}
                          >
                            <Clock className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-slate-800">
                                {WEEKDAY_LABELS[slot.day]} · {slot.startTime} – {slot.endTime}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
                        No hay visitas programadas ese día. Elegí otra fecha.
                      </p>
                    )}
                  </div>
                )}

                {agenda.preQualification.eventType && (
                  <p className="mb-4 flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Users className="h-3 w-3" />
                    Se solicitará tipo de evento e invitados al confirmar
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!date || !selectedSlot}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  Confirmar visita
                </button>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
