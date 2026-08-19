import { motion } from 'framer-motion'
import { ArrowLeft, Send } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { PremiumEmailPreview } from '../components/invitation/PremiumEmailPreview'
import { DEFAULT_VENUE_ADDRESS } from '../data/guest-invitation'
import { MOCK_EVENTS } from '../data/dashboard'
import { ensureInvitationConfig, loadInvitationConfig } from '../data/invitations-storage'
import { useAuthGuard } from '../hooks/useAuthGuard'

export default function InvitationEmailPreviewPage() {
  const { salon } = useAuthGuard({ allowedRoles: ['admin'] })
  const { eventId = 'evt-001' } = useParams<{ eventId: string }>()
  const event = MOCK_EVENTS.find((e) => e.id === eventId) ?? MOCK_EVENTS[0]
  const config = loadInvitationConfig(event.id) ?? ensureInvitationConfig(event, salon)
  const [sent, setSent] = useState(false)

  const handleSendTest = () => {
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pb-12">
      <DashboardLayout
        salonName={salon}
        title="Vista previa de email"
        subtitle="Correo de invitación premium que reciben tus invitados"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/dashboard/invitaciones/${event.id}`}
              className="dash-btn-secondary py-2 text-sm"
            >
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
          <p className="mb-4 text-center text-xs text-slate-500">
            Así se ve la invitación en la bandeja de entrada de tus invitados (formato optimizado
            para clientes de correo, ~600px de ancho)
          </p>
          <PremiumEmailPreview config={config} address={DEFAULT_VENUE_ADDRESS} />
        </div>
      </DashboardLayout>
    </motion.div>
  )
}
