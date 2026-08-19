import { motion } from 'framer-motion'
import { ArrowLeft, Eye, Save, Send, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HostAccountLayout } from '../../components/marketplace/host-account/HostAccountLayout'
import { AjustesPanel } from '../../components/invitation/AjustesPanel'
import { DatosPanel } from '../../components/invitation/DatosPanel'
import { DesignPanel } from '../../components/invitation/DesignPanel'
import { InvitationPreview } from '../../components/invitation/InvitationPreview'
import { LinkManager } from '../../components/invitation/LinkManager'
import { TemplateCarousel } from '../../components/invitation/TemplateCarousel'
import { MOCK_EVENTS } from '../../data/event-details'
import { getTemplate } from '../../data/invitation-templates'
import { ensureInvitationConfig, saveInvitationConfig } from '../../data/invitations-storage'
import { useHostSession } from '../../hooks/useHostSession'
import type { InvitationConfig, InvitationTemplateId } from '../../types/invitation'

type EditorTab = 'diseno' | 'datos' | 'ajustes'

const TABS: { id: EditorTab; label: string }[] = [
  { id: 'diseno', label: 'Diseño' },
  { id: 'datos', label: 'Datos' },
  { id: 'ajustes', label: 'Ajustes' },
]

// ASSUMPTION: same single-event stand-in used in HostInvitationsPage — evt-001's
// mock data with the invitation config namespaced to that event id.
export default function HostInvitationEditorPage() {
  const { session } = useHostSession()
  const navigate = useNavigate()
  const event = useMemo(() => MOCK_EVENTS[0], [])

  const [config, setConfig] = useState<InvitationConfig>(() =>
    ensureInvitationConfig(event, session?.name ?? event.eventType),
  )
  const [saved, setSaved] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [tab, setTab] = useState<EditorTab>('diseno')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (!session) navigate('/marketplace/ingresar', { replace: true })
  }, [session, navigate])

  const updateConfig = useCallback((patch: Partial<InvitationConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }))
    setSaved(false)
    setDirty(true)
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

  const handleSave = () => {
    saveInvitationConfig(config)
    setSaved(true)
    setDirty(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleSend = () => {
    saveInvitationConfig(config)
    setDirty(false)
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  if (!session) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pb-12">
      <HostAccountLayout
        title="Editor de invitación"
        subtitle={config.eventTitle}
        headerActions={
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/marketplace/cuenta/invitaciones" className="dash-btn-secondary py-2 text-sm">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>

            <span
              className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold sm:inline-flex ${
                dirty ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${dirty ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              {dirty ? 'Borrador Autoguardado' : 'Todo guardado'}
            </span>

            <a
              href={`/inv/${event.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="dash-btn-secondary py-2 text-sm"
            >
              <Eye className="h-4 w-4" />
              Previsualizar
            </a>

            <Link to="/marketplace/cuenta/invitaciones/email-preview" className="dash-btn-secondary py-2 text-sm">
              Vista previa de email
            </Link>

            <button
              type="button"
              onClick={handleSave}
              className={`dash-btn-secondary py-2 text-sm ${saved ? 'text-emerald-600' : ''}`}
            >
              <Save className="h-4 w-4" />
              {saved ? 'Guardado ✓' : 'Guardar'}
            </button>

            <button
              type="button"
              onClick={handleSend}
              className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-ink/90"
            >
              <Send className="h-4 w-4" />
              {sent ? 'Enviado ✓' : 'Enviar a Invitados'}
            </button>
          </div>
        }
      >
        <div className="mb-4 flex items-center gap-2 sm:hidden">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
              dirty ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${dirty ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            {dirty ? 'Borrador Autoguardado' : 'Todo guardado'}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-4">
            <div className="rounded-card border border-surface-border bg-white p-6 shadow-card">
              <TemplateCarousel selected={config.templateId} onSelect={selectTemplate} />
            </div>

            <LinkManager url={config.publicUrl} />
          </div>

          <div className="flex justify-center lg:col-span-4">
            <InvitationPreview config={config} />
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-card border border-surface-border bg-white shadow-card">
              <div className="flex border-b border-surface-border px-2 pt-2">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`relative flex-1 rounded-t-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                      tab === t.id ? 'text-primary' : 'text-slate-400 hover:text-ink-muted'
                    }`}
                  >
                    {t.label}
                    {tab === t.id && (
                      <span className="absolute inset-x-2 -bottom-[1px] h-0.5 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {tab === 'diseno' && <DesignPanel config={config} onChange={updateConfig} />}
                {tab === 'datos' && <DatosPanel config={config} onChange={updateConfig} />}
                {tab === 'ajustes' && <AjustesPanel config={config} onChange={updateConfig} />}
              </div>
            </div>
          </div>
        </div>
      </HostAccountLayout>

      {sent && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-ink px-4 py-3 text-sm text-white shadow-elevated">
          <Send className="h-4 w-4 text-gold" />
          Invitación enviada a la lista de invitados
          <button
            type="button"
            onClick={() => setSent(false)}
            className="text-white/60 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </motion.div>
  )
}
