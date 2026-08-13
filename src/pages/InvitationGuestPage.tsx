import { Calendar, Clock, Mail, MapPin, Plus, Trash2, User, Users } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import { generateQrCode, loadInvitationForGuest } from '../data/guest-invitation'
import { addRsvp } from '../data/invitations-storage'
import { getTemplate } from '../data/invitation-templates'
import type { GuestCompanion, GuestConfirmation } from '../types/guest-invitation'
import {
  SuccessView,
  Field,
  InfoRow,
  CountdownPill,
  formatDate,
  getDaysUntil,
  hoursUntilEvent,
} from '../components/invitation/guest/GuestWidgets'
import { useTranslation } from 'react-i18next'

type Step = 'info' | 'success'

export default function InvitationGuestPage() {
  const { t } = useTranslation()
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
    setCompanions((prev) => [...prev, { id: `c-${Date.now()}`, firstName: '', lastName: '' }])
  }

  const updateCompanion = (id: string, field: 'firstName' | 'lastName', value: string) => {
    setCompanions((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
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
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80">
            {t('invitationguestpage.ests_invitado')}
          </p>
          <h1 className={`mt-1 text-2xl font-bold leading-tight sm:text-3xl ${fontClass}`}>
            {invitation.eventTitle}
          </h1>
        </div>
      </div>

      <div className={`bg-gradient-to-b ${template.previewGradient} px-4 py-6 sm:px-6`}>
        {invitation.countdownEnabled && daysUntil > 0 && (
          <div className="mb-6 flex justify-center gap-3">
            <CountdownPill
              value={daysUntil}
              label={t('invitationguestpage.das')}
              color={template.accentColor}
            />
            <CountdownPill
              value={hoursUntilEvent()}
              label={t('invitationguestpage.hs')}
              color={template.accentColor}
            />
          </div>
        )}

        <section className="mb-6 space-y-3 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t('invitationguestpage.detalles_del_evento')}
          </h2>
          <InfoRow
            icon={Calendar}
            label={t('invitationguestpage.fecha')}
            value={formatDate(invitation.eventDate)}
          />
          <InfoRow
            icon={Clock}
            label={t('invitationguestpage.hora')}
            value={invitation.eventTime}
          />
          <InfoRow icon={MapPin} label={t('invitationguestpage.lugar')} value={invitation.venue} />
          <a
            href={invitation.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-surface-border bg-white py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-primary/30 hover:text-primary"
          >
            <MapPin className="h-4 w-4 text-primary" />
            {t('invitationguestpage.ver_en_google_maps')}
          </a>
        </section>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/60 bg-white p-5 shadow-sm"
        >
          <h2 className="mb-4 text-sm font-bold text-slate-900">
            {t('invitationguestpage.confirmar_asistencia')}
          </h2>

          <div className="space-y-3">
            <Field
              icon={User}
              placeholder={t('invitationguestpage.nombre')}
              value={firstName}
              onChange={setFirstName}
              error={errors.firstName}
            />
            <Field
              icon={User}
              placeholder={t('invitationguestpage.apellido')}
              value={lastName}
              onChange={setLastName}
              error={errors.lastName}
            />
            <Field
              icon={Mail}
              placeholder={t('invitationguestpage.email_para_enviarte_el_qr')}
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
                {t('invitationguestpage.acompaantes')}
                {companions.length})
              </p>
              <div className="space-y-2">
                {companions.map((companion, i) => (
                  <div key={companion.id} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t('invitationguestpage.nombre_acompaante')}
                      value={companion.firstName}
                      onChange={(e) => updateCompanion(companion.id, 'firstName', e.target.value)}
                      className={`input-field flex-1 py-2.5 text-sm ${errors[`companion-${i}`] ? 'input-field-error' : ''}`}
                    />
                    <input
                      type="text"
                      placeholder={t('invitationguestpage.apellido')}
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
            {t('invitationguestpage.agregar_acompaante_o_familiar')}
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
          {t('invitationguestpage.powered_by')}
          <span className="font-semibold text-primary">{t('invitationguestpage.eventop')}</span>
        </p>
      </div>
    </div>
  )
}
