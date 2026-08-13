import { Calendar, Clock, MapPin, Music } from 'lucide-react'
import { type ComponentType } from 'react'
import { getTemplate } from '../../data/invitation-templates'
import type { InvitationConfig } from '../../types/invitation'
import { useTranslation } from 'react-i18next'

interface InvitationPreviewProps {
  config: InvitationConfig
}

export function InvitationPreview({ config }: InvitationPreviewProps) {
  const { t } = useTranslation()
  const template = getTemplate(config.templateId)
  const daysUntil = getDaysUntil(config.eventDate)

  const fontClass = {
    elegant: 'font-serif',
    playful: 'font-sans',
    glamour: 'font-serif tracking-wide',
    minimal: 'font-sans tracking-tight',
  }[template.fontStyle]

  return (
    <div className="sticky top-24">
      <p className="mb-3 text-sm font-bold text-slate-900">
        {t('invitationpreview.vista_previa_en_tiempo_real')}
      </p>

      <div className="mx-auto w-full max-w-[280px]">
        <div className="rounded-[2rem] border-[6px] border-slate-800 bg-slate-800 p-1.5 shadow-2xl">
          <div className="overflow-hidden rounded-[1.4rem] bg-white">
            <div className="relative h-36">
              <img
                src={config.coverUrl}
                alt={t('invitationpreview.portada')}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p
                className={`absolute bottom-3 left-3 right-3 text-center text-sm font-bold text-white ${fontClass}`}
              >
                {config.eventTitle}
              </p>
            </div>

            <div className={`bg-gradient-to-b ${template.previewGradient} px-4 py-5`}>
              <p
                className="text-center text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: template.accentColor }}
              >
                {t('invitationpreview.ests_invitado')}
              </p>

              {config.countdownEnabled && daysUntil > 0 && (
                <div className="mt-3 flex justify-center gap-2">
                  <CountdownUnit
                    value={daysUntil}
                    label={t('invitationpreview.das')}
                    color={template.accentColor}
                  />
                  <CountdownUnit
                    value={12}
                    label={t('invitationpreview.hs')}
                    color={template.accentColor}
                  />
                  <CountdownUnit
                    value={45}
                    label={t('invitationpreview.min')}
                    color={template.accentColor}
                  />
                </div>
              )}

              <div className="mt-4 space-y-2">
                <PreviewRow icon={Calendar} text={formatDate(config.eventDate)} />
                <PreviewRow icon={Clock} text={config.eventTime} />
                <PreviewRow icon={MapPin} text={config.venue} />
              </div>

              {config.musicTrack !== 'none' && (
                <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
                  <Music className="h-3 w-3" />
                  {t('invitationpreview.msica_de_fondo_activa')}
                </div>
              )}

              <button
                type="button"
                className="mt-4 w-full rounded-xl py-2.5 text-xs font-bold text-white shadow-md"
                style={{ backgroundColor: template.accentColor }}
              >
                {t('invitationpreview.confirmar_asistencia')}
              </button>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-[10px] text-slate-400">
          {t('invitationpreview.as_vern_los_invitados_tu_invitacin')}
        </p>
      </div>
    </div>
  )
}

function CountdownUnit({ value, label, color }: { value: number; label: string; color: string }) {

  return (
    <div className="flex flex-col items-center rounded-lg bg-white/80 px-2.5 py-1.5 shadow-sm">
      <span className="text-sm font-bold" style={{ color }}>
        {value}
      </span>
      <span className="text-[8px] text-slate-400">{label}</span>
    </div>
  )
}

function PreviewRow({
  icon: Icon,
  text,
}: {
  icon: ComponentType<{ className?: string }>
  text: string
}) {

  return (
    <div className="flex items-center gap-2 text-[11px] text-slate-600">
      <Icon className="h-3 w-3 shrink-0 text-slate-400" />
      <span>{text}</span>
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
