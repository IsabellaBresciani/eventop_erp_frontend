import { motion } from 'framer-motion'
import {
  Calendar,
  CalendarCheck2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Copy,
  ExternalLink,
  Pencil,
  Users,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HostAccountLayout } from '../../components/marketplace/host-account/HostAccountLayout'
import { GuestListTable } from '../../components/invitation/GuestListTable'
import { MOCK_EVENTS } from '../../data/event-details'
import {
  ensureInvitationConfig,
  formatInvitationDate,
  loadRsvps,
} from '../../data/invitations-storage'
import { getHostBudgets, getHostVisits } from '../../data/marketplace-venues'
import { useHostSession } from '../../hooks/useHostSession'
import type { CalendarEvent } from '../../types/dashboard'
import type { GuestConfirmation } from '../../types/guest-invitation'

/**
 * ASSUMPTION: there is no dedicated "host's own booked event" record yet in the
 * mock data layer. We derive a single plausible event for the logged-in host by:
 *  1. Looking for a confirmed visit or an accepted budget (via getHostVisits /
 *     getHostBudgets) to source a salon name + date if available.
 *  2. Falling back to MOCK_EVENTS[0] (evt-001) as the underlying event record,
 *     since invitation/RSVP mock data is already seeded against that id.
 * The host's own name (from useHostSession) overrides the mock clientName so the
 * screen reads as "your event" rather than a random client's.
 */
function useHostEvent(): CalendarEvent {
  const { session } = useHostSession()

  return useMemo(() => {
    const base = MOCK_EVENTS[0]
    const visits = getHostVisits()
    const budgets = getHostBudgets()
    const confirmedVisit = visits.find((v) => v.status === 'confirmed')
    const acceptedBudget = budgets.find((b) => b.status === 'accepted')

    return {
      ...base,
      clientName: session?.name ?? base.clientName,
      date: acceptedBudget?.eventDate ?? confirmedVisit?.date ?? base.date,
      maxCapacity: acceptedBudget ? acceptedBudget.guests || base.maxCapacity : base.maxCapacity,
    }
  }, [session])
}

function BlockedInvitations() {
  const stages = [
    { label: 'Explorar', done: true },
    { label: 'Reservar', done: true },
    { label: 'Invitaciones', done: false },
  ]

  return (
    <div className="mx-auto max-w-xl space-y-6 rounded-2xl border border-surface-border bg-white p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => (
          <div key={stage.label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                  stage.done
                    ? 'bg-emerald-500 text-white'
                    : 'border-2 border-primary bg-primary/10 text-primary'
                }`}
              >
                {stage.done ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
              </div>
              <p className={`text-[11px] font-medium ${stage.done ? 'text-emerald-600' : 'text-primary'}`}>
                {stage.label}
              </p>
            </div>
            {index < stages.length - 1 && (
              <div className={`mx-2 h-0.5 flex-1 rounded-full ${stage.done ? 'bg-emerald-400' : 'bg-surface-muted'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-surface-border bg-surface-muted px-6 py-10 text-center">
        <Compass className="mx-auto h-8 w-8 text-slate-300" />
        <p className="mt-3 text-sm font-semibold text-ink">Todavía no tenés un evento reservado</p>
        <p className="mx-auto mt-1.5 max-w-sm text-xs text-ink-muted">
          Para crear tu invitación primero necesitás explorar salones y reservar tu evento. Una vez
          confirmada la reserva, vas a poder generar la invitación digital de tu fiesta.
        </p>
        <Link to="/marketplace" className="dash-btn-primary mt-4 inline-flex py-2 text-sm">
          Explorar salones
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}

export default function HostInvitationsPage() {
  const { session } = useHostSession()
  const navigate = useNavigate()
  const event = useHostEvent()
  const [copied, setCopied] = useState(false)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!session) navigate('/marketplace/ingresar', { replace: true })
  }, [session, navigate])

  const config = useMemo(() => {
    void tick
    return ensureInvitationConfig(event, event.eventType)
  }, [event, tick])

  const guests = useMemo(() => {
    void tick
    return loadRsvps(event.id)
  }, [event.id, tick])

  // Prototype assumption: presence of the seeded mock event stands in for "host has
  // a confirmed booking." Swap this for a real booking-status check once available.
  const hasBookedEvent = Boolean(event)

  const totalPeople = guests.reduce((sum, g) => sum + 1 + g.companions.length, 0)
  const pendingRsvp = guests.filter((g) => (g.rsvpStatus ?? (g.confirmedAt ? 'Confirmado' : 'Pendiente')) === 'Pendiente').length

  const publicUrl =
    config.publicUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/inv/${event.id}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const handleGuestsChange = (_next: GuestConfirmation[]) => {
    setTick((t) => t + 1)
  }

  if (!session) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <HostAccountLayout
        title="Invitaciones"
        subtitle="Gestioná la invitación digital de tu evento y la lista de invitados confirmados"
      >
        {!hasBookedEvent ? (
          <BlockedInvitations />
        ) : (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-surface-border bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <p className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                  <CalendarCheck2 className="h-3.5 w-3.5 text-primary" />
                  Invitados totales
                </p>
                <p className="mt-1 text-2xl font-bold text-ink">{totalPeople}</p>
              </div>
              <div className="rounded-2xl border border-surface-border bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <p className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Capacidad del salón
                </p>
                <p className="mt-1 text-2xl font-bold text-ink">{event.maxCapacity}</p>
              </div>
              <div className="rounded-2xl border border-surface-border bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <p className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  RSVP pendientes
                </p>
                <p className="mt-1 text-2xl font-bold text-ink">{pendingRsvp}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="relative h-36 bg-surface-muted sm:h-44">
                <img src={config.coverUrl} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-lg font-bold text-white sm:text-xl">{config.eventTitle}</p>
                  <p className="text-sm text-white/80">
                    {formatInvitationDate(event.date)} · {event.startTime} hs
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-b border-surface-border px-4 py-3 sm:px-5">
                <Link to="/marketplace/cuenta/invitaciones/editor" className="dash-btn-primary py-2 text-sm">
                  <Pencil className="h-3.5 w-3.5" />
                  Editar invitación
                </Link>
                <button type="button" onClick={copyLink} className="dash-btn-secondary py-2 text-sm">
                  <Copy className="h-3.5 w-3.5" />
                  {copied ? 'Copiado' : 'Copiar enlace'}
                </button>
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dash-btn-secondary py-2 text-sm"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Vista pública
                </a>
                <Link
                  to="/marketplace/cuenta/invitaciones/email-preview"
                  className="dash-btn-secondary py-2 text-sm"
                >
                  Vista previa de email
                </Link>
                <Link
                  to="/marketplace/cuenta/invitaciones/ampliar-cupo"
                  className="dash-btn-secondary py-2 text-sm"
                >
                  <Users className="h-3.5 w-3.5" />
                  Ampliar cupo
                </Link>
              </div>

              <div className="px-4 py-5 sm:px-5">
                <GuestListTable
                  eventId={event.id}
                  guests={guests}
                  onChange={handleGuestsChange}
                  venueCapacity={event.maxCapacity}
                />
              </div>
            </div>

            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              Evento: {config.eventTitle} · {formatInvitationDate(event.date)}
            </p>
          </div>
        )}
      </HostAccountLayout>
    </motion.div>
  )
}
