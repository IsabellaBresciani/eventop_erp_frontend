import { Inbox, MessageSquare } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { HostAccountLayout } from '../../components/marketplace/host-account/HostAccountLayout'
import { getHostInquiries } from '../../data/marketplace-venues'
import type { HostInquiry, HostInquiryStatus } from '../../types/marketplace-host'

const STATUS_STYLES: Record<HostInquiryStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pendiente' },
  answered: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Respondida' },
  closed: { bg: 'bg-surface-muted', text: 'text-ink-muted', label: 'Cerrada' },
}

function formatDate(value: string): string {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function HostInquiriesPage() {
  const inquiries = useMemo<HostInquiry[]>(() => getHostInquiries(), [])
  const [selectedId, setSelectedId] = useState<string | null>(inquiries[0]?.id ?? null)

  const selected = inquiries.find((i) => i.id === selectedId) ?? null

  return (
    <HostAccountLayout
      title="Consultas"
      subtitle="Seguimiento de las consultas que enviaste a los salones"
    >
      {inquiries.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-3">
            {inquiries.map((inquiry) => {
              const style = STATUS_STYLES[inquiry.status]
              const active = inquiry.id === selectedId
              return (
                <button
                  key={inquiry.id}
                  type="button"
                  onClick={() => setSelectedId(inquiry.id)}
                  className={`mk-card block w-full p-4 text-left transition-colors ${
                    active ? 'border-primary/50 ring-1 ring-primary/30' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-ink">{inquiry.salonName}</p>
                    <span className={`shrink-0 rounded-full ${style.bg} ${style.text} px-2 py-0.5 text-[11px] font-semibold`}>
                      {style.label}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-ink-muted">{inquiry.subject}</p>
                  <p className="mt-2 text-[11px] text-ink-muted">{formatDate(inquiry.createdAt)}</p>
                </button>
              )
            })}
          </div>

          <div className="lg:sticky lg:top-24 lg:h-fit">
            {selected ? <InquiryDetail inquiry={selected} /> : <NoSelection />}
          </div>
        </div>
      )}
    </HostAccountLayout>
  )
}

function InquiryDetail({ inquiry }: { inquiry: HostInquiry }) {
  const style = STATUS_STYLES[inquiry.status]

  return (
    <div className="mk-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            {inquiry.salonName}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-ink">{inquiry.subject}</h2>
        </div>
        <span className={`rounded-full ${style.bg} ${style.text} px-3 py-1 text-xs font-semibold`}>
          {style.label}
        </span>
      </div>

      <div className="mt-4 space-y-4">
        <div className="rounded-2xl bg-secondary/20 p-4">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
            Tu consulta · {formatDate(inquiry.createdAt)}
          </p>
          <p className="whitespace-pre-line text-sm text-ink">{inquiry.message}</p>
        </div>

        {inquiry.status === 'answered' ? (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
              Respuesta del salón · {formatDate(inquiry.updatedAt)}
            </p>
            <p className="text-sm text-ink-muted">
              El salón todavía no publicó el contenido de su respuesta en esta vista de prueba, pero
              marcó tu consulta como respondida.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-surface-border p-4 text-center text-sm text-ink-muted">
            Todavía no recibiste respuesta. Te avisaremos apenas el salón conteste.
          </div>
        )}

        <Link to={`/marketplace/salones/${inquiry.salonId}`} className="mk-btn-soft w-full">
          Ver salón
        </Link>
      </div>
    </div>
  )
}

function NoSelection() {
  return (
    <div className="mk-card flex flex-col items-center justify-center gap-2 p-10 text-center text-sm text-ink-muted">
      <MessageSquare className="h-6 w-6 text-ink-muted" />
      Seleccioná una consulta para ver el detalle
    </div>
  )
}

function EmptyState() {
  return (
    <div className="mk-card flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Inbox className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-semibold text-ink">Todavía no enviaste consultas</h2>
      <p className="max-w-sm text-sm text-ink-muted">
        Cuando le escribas a un salón desde el marketplace, tu consulta y su respuesta van a aparecer
        acá para que puedas hacer seguimiento.
      </p>
      <Link to="/marketplace" className="mk-btn-primary mt-2">
        Explorar salones
      </Link>
    </div>
  )
}
