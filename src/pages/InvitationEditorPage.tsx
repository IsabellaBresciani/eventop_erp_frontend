import { motion } from 'framer-motion'
import { ArrowLeft, ImagePlus, Upload } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MOCK_EVENTS } from '../data/dashboard'
import { getTemplate } from '../data/invitation-templates'
import { ensureInvitationConfig, saveInvitationConfig } from '../data/invitations-storage'
import { useAuthGuard } from '../hooks/useAuthGuard'
import type { InvitationConfig, InvitationTemplateId } from '../types/invitation'
import { MUSIC_TRACKS } from '../types/invitation'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { InvitationPreview } from '../components/invitation/InvitationPreview'
import { LinkManager } from '../components/invitation/LinkManager'
import { TemplateCarousel } from '../components/invitation/TemplateCarousel'
import { Toggle } from '../components/agenda/SettingsCard'
import { useTranslation } from 'react-i18next'

export default function InvitationEditorPage() {
  const { t } = useTranslation()
  const { salon } = useAuthGuard({ allowedRoles: ['admin'] })
  const { eventId = 'evt-001' } = useParams<{ eventId: string }>()
  const fileRef = useRef<HTMLInputElement>(null)

  const event = MOCK_EVENTS.find((e) => e.id === eventId) ?? MOCK_EVENTS[0]

  const [config, setConfig] = useState<InvitationConfig>(() => ensureInvitationConfig(event, salon))
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const nextEvent = MOCK_EVENTS.find((e) => e.id === eventId) ?? MOCK_EVENTS[0]
    setConfig(ensureInvitationConfig(nextEvent, salon))
    setSaved(false)
  }, [eventId, salon])

  const updateConfig = useCallback((patch: Partial<InvitationConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }))
    setSaved(false)
  }, [])

  const selectTemplate = (templateId: InvitationTemplateId) => {
    const template = getTemplate(templateId)
    updateConfig({
      templateId,
      coverUrl:
        config.coverUrl === getTemplate(config.templateId).defaultCover
          ? template.defaultCover
          : config.coverUrl,
    })
  }

  const handleCoverUpload = (files: FileList | null) => {
    if (!files?.[0]) return
    updateConfig({ coverUrl: URL.createObjectURL(files[0]) })
  }

  const handleSave = () => {
    saveInvitationConfig(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pb-12">
      <DashboardLayout
        salonName={salon}
        title={t('invitationeditorpage.editar_invitacin')}
        subtitle={config.eventTitle}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/dashboard/invitaciones" className="dash-btn-secondary py-2 text-sm">
              <ArrowLeft className="h-4 w-4" />
              {t('invitationeditorpage.volver')}
            </Link>
            <button
              type="button"
              onClick={handleSave}
              className={`dash-btn-primary ${saved ? 'bg-emerald-600 hover:bg-emerald-600' : ''}`}
            >
              {saved ? 'Guardado ✓' : 'Guardar cambios'}
            </button>
          </div>
        }
      >
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="rounded-card border border-surface-border bg-white p-6 shadow-card">
              <TemplateCarousel selected={config.templateId} onSelect={selectTemplate} />
            </div>

            <div className="rounded-card border border-surface-border bg-white p-6 shadow-card">
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {t('invitationeditorpage.foto_de_portada')}
                  </label>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileRef.current?.click()}
                    onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
                    className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 transition-colors hover:bg-primary/10"
                  >
                    <div className="h-16 w-24 overflow-hidden rounded-lg bg-slate-100">
                      <img src={config.coverUrl} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                        <Upload className="h-4 w-4 text-primary" />
                        {t('invitationeditorpage.cambiar_portada')}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {t('invitationeditorpage.jpg_o_png')}
                      </p>
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
                    htmlFor="inv-title"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >
                    {t('invitationeditorpage.ttulo_del_evento')}
                  </label>
                  <input
                    id="inv-title"
                    type="text"
                    value={config.eventTitle}
                    onChange={(e) => updateConfig({ eventTitle: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="inv-date"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                    >
                      {t('invitationeditorpage.fecha')}
                    </label>
                    <input
                      id="inv-date"
                      type="date"
                      value={config.eventDate}
                      onChange={(e) => updateConfig({ eventDate: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="inv-time"
                      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                    >
                      {t('invitationeditorpage.horario')}
                    </label>
                    <input
                      id="inv-time"
                      type="text"
                      value={config.eventTime}
                      onChange={(e) => updateConfig({ eventTime: e.target.value })}
                      className="input-field"
                      placeholder={t('invitationeditorpage.2000_hs')}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="inv-venue"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >
                    {t('invitationeditorpage.lugar')}
                  </label>
                  <input
                    id="inv-venue"
                    type="text"
                    value={config.venue}
                    onChange={(e) => updateConfig({ venue: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label
                    htmlFor="inv-music"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >
                    {t('invitationeditorpage.msica_de_fondo')}
                  </label>
                  <select
                    id="inv-music"
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
                  label={t('invitationeditorpage.cuenta_regresiva')}
                  description="Muestra los días restantes hasta el evento"
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
                    {t('invitationeditorpage.evento')}
                    <strong className="text-slate-700">{event.clientName}</strong>
                  </span>
                </div>
                <a
                  href={`/inv/${event.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  {t('invitationeditorpage.vista_invitado')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </motion.div>
  )
}
