import { motion } from 'framer-motion'
import { ImagePlus, Upload } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MOCK_EVENTS } from '../data/dashboard'
import {
  buildDefaultConfig,
  getTemplate,
} from '../data/invitation-templates'
import { useAuthGuard } from '../hooks/useAuthGuard'
import type { InvitationConfig, InvitationTemplateId } from '../types/invitation'
import { MUSIC_TRACKS } from '../types/invitation'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { InvitationPreview } from '../components/invitation/InvitationPreview'
import { LinkManager } from '../components/invitation/LinkManager'
import { TemplateCarousel } from '../components/invitation/TemplateCarousel'
import { Toggle } from '../components/agenda/SettingsCard'

const STORAGE_PREFIX = 'eventop_invitation_'

function loadConfig(eventId: string): InvitationConfig | null {
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${eventId}`)
    if (stored) return JSON.parse(stored) as InvitationConfig
  } catch {
    /* ignore */
  }
  return null
}

export default function InvitationEditorPage() {
  const { salon } = useAuthGuard()
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get('event') ?? 'evt-001'
  const fileRef = useRef<HTMLInputElement>(null)

  const event = MOCK_EVENTS.find((e) => e.id === eventId) ?? MOCK_EVENTS[0]

  const [config, setConfig] = useState<InvitationConfig>(() => {
    const saved = loadConfig(event.id)
    if (saved) return saved
    return buildDefaultConfig(
      event.id,
      `${event.clientName} — ${event.eventType}`,
      event.date,
      `${event.startTime} hs`,
      salon,
      mapEventTypeToTemplate(event.eventType),
    )
  })

  const [saved, setSaved] = useState(false)

  const updateConfig = useCallback((patch: Partial<InvitationConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }))
    setSaved(false)
  }, [])

  const selectTemplate = (templateId: InvitationTemplateId) => {
    const template = getTemplate(templateId)
    updateConfig({
      templateId,
      coverUrl: config.coverUrl === getTemplate(config.templateId).defaultCover
        ? template.defaultCover
        : config.coverUrl,
    })
  }

  const handleCoverUpload = (files: FileList | null) => {
    if (!files?.[0]) return
    updateConfig({ coverUrl: URL.createObjectURL(files[0]) })
  }

  const handleSave = () => {
    localStorage.setItem(`${STORAGE_PREFIX}${config.eventId}`, JSON.stringify(config))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-12"
    >
      <DashboardLayout
        salonName={salon}
        title="Editor de Invitaciones"
        subtitle="RF-201 · RF-202 · RF-203 — Personalizá la experiencia de tus invitados"
        action={
          <button
            type="button"
            onClick={handleSave}
            className={`dash-btn-primary ${saved ? 'bg-emerald-600 hover:bg-emerald-600' : ''}`}
          >
            {saved ? 'Guardado ✓' : 'Guardar cambios'}
          </button>
        }
      >
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="rounded-card border border-surface-border bg-white p-6 shadow-card">
              <TemplateCarousel
                selected={config.templateId}
                onSelect={selectTemplate}
              />
            </div>

            <div className="rounded-card border border-surface-border bg-white p-6 shadow-card">
              <h3 className="mb-5 text-sm font-bold text-slate-900">Panel de Personalización</h3>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Foto de portada
                  </label>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileRef.current?.click()}
                    onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
                    className="relative h-40 cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 transition-colors hover:border-primary/50"
                  >
                    <img
                      src={config.coverUrl}
                      alt="Portada"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 opacity-0 transition-opacity hover:opacity-100">
                      <Upload className="h-6 w-6 text-white" />
                      <span className="mt-1 text-xs font-medium text-white">Cambiar imagen</span>
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleCoverUpload(e.target.files)}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="event-title"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >
                    Título del evento
                  </label>
                  <input
                    id="event-title"
                    type="text"
                    value={config.eventTitle}
                    onChange={(e) => updateConfig({ eventTitle: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label
                    htmlFor="music-track"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >
                    Música de fondo
                  </label>
                  <select
                    id="music-track"
                    value={config.musicTrack}
                    onChange={(e) => updateConfig({ musicTrack: e.target.value })}
                    className="input-field"
                  >
                    {MUSIC_TRACKS.map((track) => (
                      <option key={track.id} value={track.id}>
                        {track.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Toggle
                  enabled={config.countdownEnabled}
                  onChange={(countdownEnabled) => updateConfig({ countdownEnabled })}
                  label="Cuenta regresiva (Countdown)"
                  description="Muestra los días restantes hasta el evento en la invitación"
                />
              </div>
            </div>

            <LinkManager url={config.publicUrl} />
          </div>

          <div className="lg:col-span-5">
            <InvitationPreview config={config} />

            <div className="mt-6 rounded-card border border-surface-border bg-white p-4 shadow-card">
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <ImagePlus className="h-4 w-4 text-primary" />
                  <span>
                    Evento: <strong className="text-slate-700">{event.id.toUpperCase()}</strong>
                  </span>
                </div>
                <a
                  href={`/inv/${event.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  Vista invitado →
                </a>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </motion.div>
  )
}

function mapEventTypeToTemplate(eventType: string): InvitationTemplateId {
  if (eventType.includes('Infantil') || eventType.includes('Cumpleaños')) return 'infantil'
  if (eventType.includes('XV')) return 'xv'
  if (eventType.includes('Corporativo')) return 'corporativo'
  return 'boda'
}
