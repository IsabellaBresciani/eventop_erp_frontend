import { MessageSquare, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { addHostInquiry } from '../../data/marketplace-venues'
import type { SalonBookingSelection } from './SalonBookingPanel'

interface InquiryModalProps {
  isOpen: boolean
  onClose: () => void
  salonId: string
  salonName: string
  booking?: SalonBookingSelection | null
}

const TIME_LABELS = {
  manana: 'Mañana',
  tarde: 'Tarde',
  noche: 'Noche (personalizado)',
}

function buildDefaultMessage(booking?: SalonBookingSelection | null) {
  if (!booking?.date) {
    return 'Hola, quisiera consultar disponibilidad y recibir más información sobre el salón.'
  }

  return `Hola, quisiera consultar disponibilidad para el ${booking.date} en horario ${TIME_LABELS[booking.timeSlot]} con aproximadamente ${booking.guests} invitados.`
}

export function InquiryModal({
  isOpen,
  onClose,
  salonId,
  salonName,
  booking,
}: InquiryModalProps) {
  const [sent, setSent] = useState(false)
  const [subject, setSubject] = useState('Consulta de disponibilidad')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (isOpen) {
      setSent(false)
      setSubject('Consulta de disponibilidad')
      setMessage(buildDefaultMessage(booking))
    }
  }, [isOpen, booking])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    addHostInquiry({
      salonId,
      salonName,
      subject,
      message,
    })
    setSent(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Cerrar" />
      <div className="relative w-full max-w-lg rounded-3xl border border-black/[0.06] bg-white p-6 shadow-elevated">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-ink-muted hover:bg-[#f5f5f7]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-ink">Consultar al salón</h3>
            <p className="text-xs text-ink-muted">{salonName}</p>
          </div>
        </div>

        {sent ? (
          <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
            Tu consulta fue enviada. Podés hacer seguimiento desde tu cuenta de anfitrión.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-muted">Asunto</label>
              <input
                name="subject"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mk-input"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-muted">Mensaje</label>
              <textarea
                name="message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mk-input"
              />
            </div>
            <button type="submit" className="mk-btn-primary w-full">
              Enviar consulta
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
