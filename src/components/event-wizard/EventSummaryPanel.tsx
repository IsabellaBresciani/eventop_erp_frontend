import { formatCurrency } from '../../data/dashboard'
import {
  getClientDisplayName,
  getVenueName,
  paymentsTotal,
  servicesTotal,
} from '../../data/event-wizard'
import type { EventWizardDraft } from '../../types/event-wizard'

interface EventSummaryPanelProps {
  draft: EventWizardDraft
}

export function EventSummaryPanel({ draft }: EventSummaryPanelProps) {
  const total = servicesTotal(draft.selectedServices)
  const clientName = getClientDisplayName(draft)
  const venue = getVenueName(draft.venueId)
  const scheduled = paymentsTotal(draft.payments)
  const staffCount = draft.staff.reduce((sum, line) => sum + line.quantity, 0)

  return (
    <aside className="dash-card flex h-fit flex-col overflow-hidden lg:sticky lg:top-6">
      <div className="border-b px-5 py-4" style={{ borderColor: 'var(--mk-border)' }}>
        <p className="dash-section-label">Resumen</p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-ink">Tu evento</h2>
      </div>

      <div className="space-y-4 px-5 py-4">
        <SummaryRow label="Cliente" value={clientName || draft.clientEmail || 'Sin asignar'} />
        {draft.clientLookup === 'invite' && draft.clientEmail && (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-[12px] text-amber-800">
            Se enviará una invitación a {draft.clientEmail}
          </p>
        )}
        <SummaryRow label="Evento" value={draft.eventName || 'Sin nombre'} />
        <SummaryRow label="Tipo" value={draft.eventType || '—'} />
        <SummaryRow label="Fecha" value={formatSchedule(draft) || 'Pendiente'} />
        <SummaryRow label="Salón" value={venue || 'Sin elegir'} />
        <SummaryRow
          label="Invitados"
          value={draft.guests ? `${draft.guests}` : 'No indicados'}
        />
      </div>

      <div className="border-t px-5 py-4" style={{ borderColor: 'var(--mk-border)' }}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
          Servicios
        </p>
        {draft.selectedServices.length === 0 ? (
          <p className="mt-2 text-[13px] text-ink-muted">Ninguno seleccionado</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {draft.selectedServices.map((line) => (
              <li key={line.catalogId} className="flex items-start justify-between gap-3 text-[13px]">
                <span className="text-ink">
                  {line.name}
                  <span className="block text-[11px] text-ink-muted">
                    {line.quantity} × {formatCurrency(line.unitPrice)}
                  </span>
                </span>
                <span className="shrink-0 font-medium text-ink">
                  {formatCurrency(line.unitPrice * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
        )}
        {staffCount > 0 && (
          <p className="mt-3 text-[12px] text-ink-muted">
            Personal: {staffCount} prestador{staffCount === 1 ? '' : 'es'}
          </p>
        )}
      </div>

      <div
        className="border-t px-5 py-4"
        style={{ borderColor: 'var(--mk-border)', background: 'var(--mk-bg-input)' }}
      >
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
              Total
            </p>
            {draft.payments.length > 0 && scheduled !== total && (
              <p className="mt-1 text-[11px] text-amber-700">
                Plan de cobros: {formatCurrency(scheduled)}
              </p>
            )}
          </div>
          <p className="text-xl font-semibold tracking-tight text-primary">{formatCurrency(total)}</p>
        </div>
      </div>
    </aside>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">{label}</p>
      <p className="mt-0.5 text-[13px] font-medium text-ink">{value}</p>
    </div>
  )
}

function formatSchedule(draft: EventWizardDraft): string {
  if (!draft.startDate) return ''
  const start = formatDate(draft.startDate)
  const end = draft.endDate && draft.endDate !== draft.startDate ? ` → ${formatDate(draft.endDate)}` : ''
  const time = draft.startTime && draft.endTime ? ` · ${draft.startTime} a ${draft.endTime}` : ''
  return `${start}${end}${time}`
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day) return iso
  return new Date(year, month - 1, day).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
  })
}
