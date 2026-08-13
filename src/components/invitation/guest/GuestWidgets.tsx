import { type ComponentType } from 'react'
import { CheckCircle2, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { QrCodeDisplay } from '../QrCodeDisplay'
import type { GuestConfirmation } from '../../../types/guest-invitation'
import type { loadInvitationForGuest } from '../../../data/guest-invitation'
import type { getTemplate } from '../../../data/invitation-templates'
import { useTranslation } from 'react-i18next'

export function SuccessView({
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
  const { t } = useTranslation()
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
          {t('guestwidgets.confirmacin_exitosa')}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {t('guestwidgets.gracias')}
          <strong>{confirmation.firstName}</strong>
          {t('guestwidgets.tu_asistencia_qued_registrada')}
        </p>

        <div className="mt-6 flex justify-center">
          <QrCodeDisplay code={confirmation.qrCode} />
        </div>

        <p className="mt-4 text-xs text-slate-500">
          {t('guestwidgets.present_este_cdigo_qr_el_da_del_evento_p')}
          {totalGuests > 1 && ` (${totalGuests} personas en tu grupo)`}
        </p>

        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left">
          <div className="flex items-start gap-2">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                {t('guestwidgets.email_enviado')}
              </p>
              <p className="mt-0.5 text-xs text-emerald-700">
                {t('guestwidgets.enviamos_tu_cdigo_qr_a')}
                <strong>{confirmation.email}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-white/80 p-4 text-left text-sm text-slate-600 backdrop-blur-sm">
          <p className="font-semibold text-slate-800">{invitation.eventTitle}</p>
          <p className="mt-1 text-xs">
            {formatDate(invitation.eventDate)} · {invitation.eventTime}
          </p>
          <p className="mt-1 text-xs">{invitation.venue}</p>
        </div>

        <p className="mt-8 text-[10px] text-slate-400">
          {t('guestwidgets.rf208_eventop_invitaciones')}
        </p>
      </div>
    </motion.div>
  )
}

export function Field({
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

export function InfoRow({
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

export function CountdownPill({
  value,
  label,
  color,
}: {
  value: number
  label: string
  color: string
}) {

  return (
    <div className="flex flex-col items-center rounded-xl bg-white/90 px-4 py-2 shadow-sm">
      <span className="text-xl font-bold" style={{ color }}>
        {value}
      </span>
      <span className="text-[10px] text-slate-400">{label}</span>
    </div>
  )
}

export function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function getDaysUntil(dateStr: string): number {
  const now = new Date('2026-08-04')
  const target = new Date(`${dateStr}T12:00:00`)
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
}

export function hoursUntilEvent(): number {
  return 14
}
