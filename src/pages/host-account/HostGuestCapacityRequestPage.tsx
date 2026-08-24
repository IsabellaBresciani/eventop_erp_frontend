import { AlertTriangle, CheckCircle2, FileText, ShieldCheck, XCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HostAccountLayout } from '../../components/marketplace/host-account/HostAccountLayout'
import { MOCK_EVENTS } from '../../data/event-details'
import { createCapacityRequest, loadCapacityRequests } from '../../data/guest-capacity-requests'
import { useHostSession } from '../../hooks/useHostSession'
import type { GuestCapacityRequestStatus } from '../../types/guest-capacity-request'

const STATUS_LABEL: Record<GuestCapacityRequestStatus, string> = {
  EN_REVISION: 'EN REVISIÓN',
  APROBADA: 'APROBADA',
  RECHAZADA: 'RECHAZADA',
}

const STATUS_STYLE: Record<GuestCapacityRequestStatus, string> = {
  EN_REVISION: 'bg-amber-50 text-amber-700',
  APROBADA: 'bg-emerald-50 text-emerald-700',
  RECHAZADA: 'bg-red-50 text-red-700',
}

function eventCode(eventId: string): string {
  const suffix = eventId.replace(/\D/g, '').padStart(3, '0').slice(-3)
  return `EVT-2023-${suffix}A`
}

// ASSUMPTION: same single "host's own event" stand-in (evt-001) used across the
// invitations flow.
export default function HostGuestCapacityRequestPage() {
  const { session } = useHostSession()
  const navigate = useNavigate()
  const event = useMemo(() => MOCK_EVENTS[0], [])
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!session) navigate('/marketplace/ingresar', { replace: true })
  }, [session, navigate])

  const requests = useMemo(() => {
    void tick
    return loadCapacityRequests(event.id)
  }, [event.id, tick])

  const maxCapacity = event.maxCapacity
  const currentGuests = event.confirmedGuests

  const [additionalGuests, setAdditionalGuests] = useState('')
  const [requiredDate, setRequiredDate] = useState('')
  const [reason, setReason] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)

  const canSubmit =
    acknowledged && additionalGuests.trim() !== '' && requiredDate.trim() !== '' && reason.trim() !== ''

  const submit = () => {
    if (!canSubmit) return
    createCapacityRequest(event.id, {
      additionalGuests: Number(additionalGuests) || 0,
      requiredApprovalDate: requiredDate,
      reason: reason.trim(),
    })
    setAdditionalGuests('')
    setRequiredDate('')
    setReason('')
    setAcknowledged(false)
    setTick((t) => t + 1)
  }

  if (!session) return null

  return (
    <HostAccountLayout
      title="Solicitud de ampliación de invitados"
      subtitle="Gestioná y solicitá aumentos en la capacidad máxima permitida para tu evento. Todas las solicitudes están sujetas a la aprobación de la administración del salón."
    >
      <div className="space-y-6">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
          Evento {eventCode(event.id)}
        </span>

        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
          <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Capacidad máxima alcanzada para tu evento
            </p>
            <p className="mt-0.5 text-sm font-bold text-amber-900">
              {currentGuests} / {maxCapacity} invitados actuales
            </p>
            <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-amber-700">
              Cualquier invitado adicional por encima del límite contratado puede implicar cargos
              extra de catering, logística y personal de salón. La aprobación está sujeta a
              disponibilidad.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h3 className="text-base font-semibold text-ink">Nueva solicitud</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-muted">
                    Cantidad adicional deseada
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={additionalGuests}
                    onChange={(e) => setAdditionalGuests(e.target.value)}
                    placeholder="Ej. 25"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-muted">
                    Fecha requerida de aprobación
                  </label>
                  <input
                    type="date"
                    value={requiredDate}
                    onChange={(e) => setRequiredDate(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-muted">
                    Motivo de la solicitud
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Ej. Familiares imprevistos o confirmaciones de último momento que superan el cupo actual."
                    rows={4}
                    className="input-field resize-none"
                  />
                </div>
                <label className="flex items-start gap-2.5 text-xs text-ink-muted">
                  <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-primary"
                  />
                  Entiendo que esta solicitud está sujeta a la disponibilidad del salón y aprobación
                  administrativa, y que puede generar costos adicionales.
                </label>
                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={submit}
                  className="dash-btn-primary w-full py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Enviar solicitud a administración
                </button>
              </div>
            </div>

            <div className="relative mt-6 overflow-hidden rounded-2xl border border-surface-border">
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b8?w=1200&h=500&fit=crop"
                alt=""
                className="h-48 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="flex items-center gap-1.5 text-sm font-bold text-white">
                  <ShieldCheck className="h-4 w-4" />
                  Política de aforo · Compromiso de calidad
                </p>
                <p className="mt-1 max-w-xl text-xs leading-relaxed text-white/85">
                  Los límites de capacidad garantizan una experiencia de calidad para todos los
                  invitados: tiempos de servicio, espacio de circulación y atención personalizada.
                  Por eso cada ampliación se evalúa junto al equipo operativo del salón.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h3 className="text-base font-semibold text-ink">Solicitudes recientes</h3>
              <div className="mt-4 space-y-3">
                {requests.map((req) => (
                  <div key={req.id} className="rounded-xl border border-surface-border p-3.5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-ink">{req.id}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLE[req.status]}`}
                      >
                        {STATUS_LABEL[req.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-primary">
                      +{req.additionalGuests} Invitados
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {new Date(req.createdAt).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    {req.status === 'APROBADA' && req.updatedBudgetUrl && (
                      <a
                        href={req.updatedBudgetUrl}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Ver presupuesto actualizado
                      </a>
                    )}
                    {req.status === 'RECHAZADA' && req.rejectionReason && (
                      <p className="mt-2 flex items-start gap-1 text-xs text-red-600">
                        <XCircle className="h-3.5 w-3.5 shrink-0" />
                        Motivo: {req.rejectionReason}
                      </p>
                    )}
                  </div>
                ))}
                {requests.length === 0 && (
                  <div className="rounded-xl border border-dashed border-surface-border bg-surface-muted px-4 py-8 text-center text-sm text-ink-muted">
                    <FileText className="mx-auto h-6 w-6 text-slate-300" />
                    Todavía no hay solicitudes de ampliación.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </HostAccountLayout>
  )
}
