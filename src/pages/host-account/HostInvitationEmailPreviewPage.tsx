import { motion } from 'framer-motion'
import { ArrowLeft, Send } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HostAccountLayout } from '../../components/marketplace/host-account/HostAccountLayout'
import { PremiumEmailPreview } from '../../components/invitation/PremiumEmailPreview'
import { DEFAULT_VENUE_ADDRESS } from '../../data/guest-invitation'
import { MOCK_EVENTS } from '../../data/event-details'
import { ensureInvitationConfig, loadInvitationConfig } from '../../data/invitations-storage'
import { useHostSession } from '../../hooks/useHostSession'

// ASSUMPTION: same single "host's own event" stand-in (evt-001) used across the
// invitations flow.
export default function HostInvitationEmailPreviewPage() {
  const { session } = useHostSession()
  const navigate = useNavigate()
  const event = useMemo(() => MOCK_EVENTS[0], [])
  const config = useMemo(
    () => loadInvitationConfig(event.id) ?? ensureInvitationConfig(event, session?.name ?? event.eventType),
    [event, session],
  )
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (!session) navigate('/marketplace/ingresar', { replace: true })
  }, [session, navigate])

  const handleSendTest = () => {
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  if (!session) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pb-12">
      <HostAccountLayout
        title="Vista previa de email"
        subtitle="Correo de invitación premium que reciben tus invitados"
        headerActions={
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/marketplace/cuenta/invitaciones/editor" className="dash-btn-secondary py-2 text-sm">
              <ArrowLeft className="h-4 w-4" />
              Volver al editor
            </Link>
            <button
              type="button"
              onClick={handleSendTest}
              className={`dash-btn-primary ${sent ? 'bg-emerald-600 hover:bg-emerald-600' : ''}`}
            >
              <Send className="h-4 w-4" />
              {sent ? 'Enviado ✓' : 'Enviar correo de prueba'}
            </button>
          </div>
        }
      >
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-center text-xs text-ink-muted">
            Así se ve la invitación en la bandeja de entrada de tus invitados (formato optimizado
            para clientes de correo, ~600px de ancho)
          </p>
          <PremiumEmailPreview config={config} address={DEFAULT_VENUE_ADDRESS} />
        </div>
      </HostAccountLayout>
    </motion.div>
  )
}
