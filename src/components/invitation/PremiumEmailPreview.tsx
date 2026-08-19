import { getTemplate } from '../../data/invitation-templates'
import type { InvitationConfig } from '../../types/invitation'

interface PremiumEmailPreviewProps {
  config: InvitationConfig
  address?: string
}

/**
 * Preview of the "Correo de Invitación Premium" transactional email.
 * Styled to read as a real HTML email: single column, ~600px wide,
 * table/div layout that would survive most email clients' CSS stripping.
 */
export function PremiumEmailPreview({ config, address }: PremiumEmailPreviewProps) {
  const template = getTemplate(config.templateId)

  const fontClass = {
    elegant: 'font-serif',
    playful: 'font-sans',
    glamour: 'font-serif tracking-wide',
    minimal: 'font-sans',
  }[template.fontStyle]

  const rsvpUrl = config.publicUrl || `https://eventop.app/inv/${config.eventId}`

  return (
    <div className="mx-auto w-full max-w-[600px] overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card">
      {/* Preheader / client chrome */}
      <div className="border-b border-surface-border bg-surface-muted px-5 py-2.5">
        <p className="text-[11px] font-semibold text-ink-muted">EvenTop Invitaciones</p>
        <p className="truncate text-[11px] text-slate-400">
          Estás invitado a {config.eventTitle} — confirmá tu asistencia
        </p>
      </div>

      {/* Header banner */}
      <div className="relative h-44 sm:h-52">
        <img
          src={config.coverUrl}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-center text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/85">
            Estás invitado
          </p>
          <h1 className={`mt-2 text-2xl font-bold leading-tight sm:text-3xl ${fontClass}`}>
            {config.eventTitle}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-8 sm:px-10">
        {config.hostNames && (
          <p className={`text-center text-sm text-ink-muted ${fontClass}`}>
            {config.hostNames}
          </p>
        )}

        {config.invitationMessage && (
          <p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-ink-muted">
            {config.invitationMessage}
          </p>
        )}

        {/* Date block — gold/accent highlight */}
        <div
          className="mx-auto mt-6 max-w-xs rounded-xl px-6 py-4 text-center"
          style={{ backgroundColor: `${template.accentColor}14` }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: template.accentColor }}
          >
            Fecha del evento
          </p>
          <p className="mt-1 text-lg font-bold text-ink">{formatDate(config.eventDate)}</p>
          <p className="text-sm text-ink-muted">{config.eventTime}</p>
        </div>

        {/* Venue */}
        <div className="mx-auto mt-5 max-w-xs text-center">
          <p className="text-sm font-semibold text-ink">{config.venue}</p>
          <p className="mt-0.5 text-xs text-ink-muted">
            {address ?? config.venueAddress ?? 'Ubicación a confirmar'}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <a
            href={rsvpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: template.accentColor }}
          >
            Confirmar Asistencia
          </a>
        </div>

        {config.rsvpDeadline && (
          <p className="mt-4 text-center text-[11px] text-slate-400">
            Por favor confirmá antes del {formatDate(config.rsvpDeadline)}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-surface-border bg-surface-muted px-6 py-5 text-center">
        <p className="text-xs font-semibold text-primary">EvenTop</p>
        <p className="mt-1 text-[10px] text-slate-400">
          Este correo fue enviado en nombre de {config.hostNames || 'el anfitrión'}. Si tenés
          dudas, respondé este email o contactá al organizador.
        </p>
      </div>
    </div>
  )
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    return new Date(`${dateStr}T12:00:00`).toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  } catch {
    return dateStr
  }
}
