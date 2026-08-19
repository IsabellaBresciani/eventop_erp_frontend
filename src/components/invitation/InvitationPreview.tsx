import type { CSSProperties } from 'react'
import { TEXTURES } from '../../data/invitation-templates'
import type { InvitationConfig } from '../../types/invitation'

interface InvitationPreviewProps {
  config: InvitationConfig
}

export function InvitationPreview({ config }: InvitationPreviewProps) {
  const texture = TEXTURES.find((t) => t.id === config.texture) ?? TEXTURES[0]
  const isDark = config.texture === 'terciopelo'
  const message = applyDynamicFields(config.invitationMessage, config)

  const backgroundImage =
    config.texture === 'custom' && config.customTextureUrl
      ? `url(${config.customTextureUrl})`
      : texture.backgroundStyle

  const textStyle: CSSProperties = {
    fontFamily: `'${config.fontFamily}', 'Libre Caslon Text', serif`,
    color: isDark ? '#f5efe6' : config.textColor,
    textAlign: config.textAlign,
    fontWeight: config.textBold ? 700 : 400,
    fontStyle: config.textItalic ? 'italic' : 'normal',
    textDecoration: config.textUnderline ? 'underline' : 'none',
  }

  return (
    <div className="sticky top-24">
      <p className="mb-3 text-sm font-bold text-slate-900">Vista previa en tiempo real</p>

      <div className="mx-auto w-full max-w-[340px]">
        <div
          className="relative overflow-hidden rounded-[1.4rem] border border-black/5 p-8 shadow-elevated"
          style={{
            backgroundImage,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* subtle paper grain overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, #000 0px, transparent 1px, transparent 2px)',
            }}
          />

          <div className="relative flex flex-col items-center text-center">
            <div
              className={`mb-6 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                isDark
                  ? 'border-gold/40 text-gold bg-white/5'
                  : 'border-primary/20 bg-primary/5 text-primary'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              EvenTop
            </div>

            <p
              className="text-[10px] font-semibold uppercase tracking-[0.25em]"
              style={{ ...textStyle, fontWeight: 600 }}
            >
              {message}
            </p>

            <h2
              className="mt-3 text-xl leading-snug"
              style={{ ...textStyle, fontWeight: config.textBold ? 800 : 700 }}
            >
              {config.eventTitle}
            </h2>

            {config.hostNames && (
              <p
                className="mt-3 font-script text-3xl"
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  color: isDark ? '#e8c869' : config.textColor,
                }}
              >
                {config.hostNames}
              </p>
            )}

            <div
              className={`mt-6 w-full border-t ${isDark ? 'border-white/15' : 'border-black/10'}`}
            />

            <div className="mt-6 space-y-1" style={textStyle}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] opacity-80">
                {formatDayLabel(config.eventDate)}
              </p>
              <p className="text-[11px] uppercase tracking-[0.15em] opacity-70">
                {formatMonthYear(config.eventDate)} / {formatDay(config.eventDate)} /{' '}
                {config.eventTime}
              </p>
            </div>

            <div className="mt-6 space-y-1" style={textStyle}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-60">
                Lugar
              </p>
              <p className="text-sm font-semibold">{config.venue}</p>
              {config.venueAddress && (
                <p className="text-[11px] opacity-70">{config.venueAddress}</p>
              )}
            </div>

            {config.countdownEnabled && (
              <p
                className={`mt-4 text-[10px] font-semibold uppercase tracking-[0.15em] ${
                  isDark ? 'text-gold/80' : 'text-primary/70'
                }`}
              >
                Faltan {getDaysUntil(config.eventDate)} días
              </p>
            )}

            <button
              type="button"
              className={`mt-5 w-full max-w-[220px] rounded-full py-2.5 text-xs font-bold uppercase tracking-wider shadow-md transition-transform hover:scale-[1.02] ${
                isDark ? 'bg-gold text-ink' : 'bg-primary text-white'
              }`}
            >
              Confirmar Asistencia
            </button>

            {config.musicTrack !== 'none' && (
              <p
                className={`mt-3 text-[10px] ${isDark ? 'text-white/50' : 'text-slate-400'}`}
              >
                ♪ Música de fondo activa
              </p>
            )}
          </div>
        </div>

        <p className="mt-3 text-center text-[10px] text-slate-400">
          Así verán los invitados tu invitación
        </p>
      </div>
    </div>
  )
}

function applyDynamicFields(message: string, config: InvitationConfig): string {
  return message
    .replace(/\{\{fecha_evento\}\}/g, formatDate(config.eventDate))
    .replace(/\{\{hora_inicio\}\}/g, config.eventTime)
    .replace(/\{\{ubicacion_salon\}\}/g, config.venue)
}

function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function formatDayLabel(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('es-AR', { weekday: 'long' })
}

function formatMonthYear(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('es-AR', {
    month: 'long',
    year: 'numeric',
  })
}

function formatDay(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('es-AR', { day: 'numeric' })
}

function getDaysUntil(dateStr: string): number {
  const now = new Date('2026-08-18')
  const target = new Date(`${dateStr}T12:00:00`)
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
}
