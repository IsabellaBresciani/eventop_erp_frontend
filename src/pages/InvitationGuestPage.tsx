import { motion } from 'framer-motion'
import {
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Plus,
  Trash2,
  User,
  Users,
} from 'lucide-react'
import { type ComponentType, type FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  generateQrCode,
  loadInvitationForGuest,
} from '../data/guest-invitation'
import { addRsvp } from '../data/invitations-storage'
import { getTemplate } from '../data/invitation-templates'
import type { GuestCompanion, GuestConfirmation } from '../types/guest-invitation'
import { QrCodeDisplay } from '../components/invitation/QrCodeDisplay'

type Step = 'info' | 'success'

export default function InvitationGuestPage() {
  const { eventId = 'evt-001' } = useParams<{ eventId: string }>()
  const invitation = loadInvitationForGuest(eventId)
  const template = getTemplate(invitation.templateId)

  const [step, setStep] = useState<Step>('info')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [companions, setCompanions] = useState<GuestCompanion[]>([])
  const [confirmation, setConfirmation] = useState<GuestConfirmation | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fontClass = {
    elegant: 'font-serif',
    playful: 'font-sans',
    glamour: 'font-serif tracking-wide',
    minimal: 'font-sans',
  }[template.fontStyle]

  const addCompanion = () => {
    setCompanions((prev) => [
      ...prev,
      { id: `c-${Date.now()}`, firstName: '', lastName: '' },
    ])
  }

  const updateCompanion = (id: string, field: 'firstName' | 'lastName', value: string) => {
    setCompanions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    )
  }

  const removeCompanion = (id: string) => {
    setCompanions((prev) => prev.filter((c) => c.id !== id))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!firstName.trim()) newErrors.firstName = 'Ingresá tu nombre'
    if (!lastName.trim()) newErrors.lastName = 'Ingresá tu apellido'
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Ingresá un email válido'

    companions.forEach((c, i) => {
      if (!c.firstName.trim()) newErrors[`companion-${i}`] = 'Nombre requerido'
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1200))

    const qrCode = generateQrCode(`${eventId}-${firstName}-${Date.now()}`)
    const result: GuestConfirmation = {
      id: `g-${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      companions: companions.filter((c) => c.firstName.trim()),
      qrCode,
      confirmedAt: new Date().toISOString(),
    }

    setConfirmation(result)
    addRsvp(eventId, result)
    setStep('success')
    setIsSubmitting(false)
  }

  if (step === 'success' && confirmation) {
    return (
      <SuccessView
        confirmation={confirmation}
        invitation={invitation}
        template={template}
        fontClass={fontClass}
      />
    )
  }

  const daysUntil = getDaysUntil(invitation.eventDate)

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-52 sm:h-64">
        <img
          src={invitation.coverUrl}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80"
          >
            Estás invitado
          </p>
          <h1 className={`mt-1 text-2xl font-bold leading-tight sm:text-3xl ${fontClass}`}>
            {invitation.eventTitle}
          </h1>
        </div>
      </div>

      <div className={`bg-gradient-to-b ${template.previewGradient} px-4 py-6 sm:px-6`}>
        {invitation.countdownEnabled && daysUntil > 0 && (
          <div className="mb-6 flex justify-center gap-3">
            <CountdownPill value={daysUntil} label="días" color={template.accentColor} />
            <CountdownPill value={hoursUntilEvent()} label="hs" color={template.accentColor} />
          </div>
        )}

        <section className="mb-6 space-y-3 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Detalles del evento
          </h2>
          <InfoRow icon={Calendar} label="Fecha" value={formatDate(invitation.eventDate)} />
          <InfoRow icon={Clock} label="Hora" value={invitation.eventTime} />
          <InfoRow icon={MapPin} label="Lugar" value={invitation.venue} />
          <a
            href={invitation.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-surface-border bg-white py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-primary/30 hover:text-primary"
          >
            <MapPin className="h-4 w-4 text-primary" />
            Ver en Google Maps
          </a>
        </section>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/60 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-slate-900">Confirmar asistencia</h2>

          <div className="space-y-3">
            <Field
              icon={User}
              placeholder="Nombre"
              value={firstName}
              onChange={setFirstName}
              error={errors.firstName}
            />
            <Field
              icon={User}
              placeholder="Apellido"
              value={lastName}
              onChange={setLastName}
              error={errors.lastName}
            />
            <Field
              icon={Mail}
              placeholder="Email (para enviarte el QR)"
              type="email"
              value={email}
              onChange={setEmail}
              error={errors.email}
            />
          </div>

          {companions.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Users className="h-3.5 w-3.5" />
                Acompañantes ({companions.length})
              </p>
              <div className="space-y-2">
                {companions.map((companion, i) => (
                  <div key={companion.id} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nombre acompañante"
                      value={companion.firstName}
                      onChange={(e) => updateCompanion(companion.id, 'firstName', e.target.value)}
                      className={`input-field flex-1 py-2.5 text-sm ${errors[`companion-${i}`] ? 'input-field-error' : ''}`}
                    />
                    <input
                      type="text"
                      placeholder="Apellido"
                      value={companion.lastName}
                      onChange={(e) => updateCompanion(companion.id, 'lastName', e.target.value)}
                      className="input-field flex-1 py-2.5 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeCompanion(companion.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                      aria-label="Eliminar acompañante"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={addCompanion}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-surface-border py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-primary/30 hover:text-primary"
          >
            <Plus className="h-4 w-4" />
            Agregar acompañante o familiar
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition-all hover:brightness-110 disabled:opacity-70"
            style={{ backgroundColor: template.accentColor }}
          >
            {isSubmitting ? 'Confirmando...' : 'Confirmar asistencia'}
          </button>
        </form>

        <p className="mt-6 pb-8 text-center text-[10px] text-slate-400">
          Powered by <span className="font-semibold text-primary">EvenTop</span>
        </p>
      </div>
    </div>
  )
}

function SuccessView({
  confirmation,
  invitation,
  template,
  fontClass,
}: {
  confirmation: GuestConfirmation
  invitation: ReturnType<typeof loadInvitationForGuest>
  template: ReturnType<typeof getTemplate>
  fontClass: string
}) {
  const totalGuests = 1 + confirmation.companions.length

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`min-h-screen bg-gradient-to-b ${template.previewGradient} px-4 py-8 sm:px-6`}
    >
      <div className="mx-auto max-w-sm text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"
        >
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </motion.div>

        <h1 className={`text-2xl font-bold text-slate-900 ${fontClass}`}>
          ¡Confirmación exitosa!
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Gracias, <strong>{confirmation.firstName}</strong>. Tu asistencia quedó registrada.
        </p>

        <div className="mt-6 flex justify-center">
          <QrCodeDisplay code={confirmation.qrCode} />
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Presentá este código QR el día del evento para ingresar
          {totalGuests > 1 && ` (${totalGuests} personas en tu grupo)`}
        </p>

        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left">
          <div className="flex items-start gap-2">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">Email enviado</p>
              <p className="mt-0.5 text-xs text-emerald-700">
                Enviamos tu código QR a <strong>{confirmation.email}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-white/80 p-4 text-left text-sm text-slate-600 backdrop-blur-sm">
          <p className="font-semibold text-slate-800">{invitation.eventTitle}</p>
          <p className="mt-1 text-xs">{formatDate(invitation.eventDate)} · {invitation.eventTime}</p>
          <p className="mt-1 text-xs">{invitation.venue}</p>
        </div>

        <p className="mt-8 text-[10px] text-slate-400">
          RF-208 · EvenTop Invitaciones
        </p>
      </div>
    </motion.div>
  )
}

function Field({
  icon: Icon,
  placeholder,
  value,
  onChange,
  error,
  type = 'text',
}: {
  icon: ComponentType<{ className?: string }>
  placeholder: string
  value: string
  onChange: (v: string) => void
  error?: string
  type?: string
}) {
  return (
    <div>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`input-field py-2.5 pl-10 text-sm ${error ? 'input-field-error' : ''}`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  )
}

function CountdownPill({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-white/90 px-4 py-2 shadow-sm">
      <span className="text-xl font-bold" style={{ color }}>{value}</span>
      <span className="text-[10px] text-slate-400">{label}</span>
    </div>
  )
}

function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function getDaysUntil(dateStr: string): number {
  const now = new Date('2026-08-04')
  const target = new Date(`${dateStr}T12:00:00`)
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
}

function hoursUntilEvent(): number {
  return 14
}
