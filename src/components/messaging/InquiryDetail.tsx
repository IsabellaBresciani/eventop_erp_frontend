import {
  Archive,
  ArchiveRestore,
  FileText,
  Inbox,
  Mail,
  MessageCircle,
  MoreHorizontal,
} from 'lucide-react'
import { useState } from 'react'
import { formatCurrency } from '../../data/dashboard'
import {
  buildMailtoUrl,
  buildWhatsAppUrl,
  defaultReplyDraft,
  formatInquiryDate,
  INQUIRY_STATUS_CONFIG,
} from '../../data/messaging'
import { INQUIRY_SOURCE_LABELS, type Inquiry, type InquiryStatus } from '../../types/messaging'
import { PdfGeneratorModal } from './PdfGeneratorModal'

interface InquiryDetailProps {
  inquiry: Inquiry | null
  onStatusChange: (inquiryId: string, status: InquiryStatus) => void
}

const STATUS_ACTIONS: { id: InquiryStatus; label: string }[] = [
  { id: 'leida', label: 'Marcar leída' },
  { id: 'en_seguimiento', label: 'En seguimiento' },
  { id: 'respondida', label: 'Respondida' },
  { id: 'archivada', label: 'Archivar' },
]

export function InquiryDetail({ inquiry, onStatusChange }: InquiryDetailProps) {
  const [pdfOpen, setPdfOpen] = useState(false)
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)

  if (!inquiry) {
    return (
      <div className="flex h-full items-center justify-center rounded-card border border-surface-border bg-white shadow-card">
        <div className="text-center">
          <Inbox className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">Seleccioná una consulta para ver el detalle</p>
        </div>
      </div>
    )
  }

  const status = INQUIRY_STATUS_CONFIG[inquiry.status]
  const draft = defaultReplyDraft(inquiry)
  const whatsappUrl = buildWhatsAppUrl(inquiry.phone, draft)
  const mailtoUrl = buildMailtoUrl(
    inquiry.email,
    `Consulta ${inquiry.eventType} — ${inquiry.clientName}`,
    draft,
  )

  const markInProgressIfNeeded = () => {
    if (inquiry.status === 'nueva' || inquiry.status === 'leida') {
      onStatusChange(inquiry.id, 'en_seguimiento')
    }
  }

  const handlePdfSent = () => {
    onStatusChange(inquiry.id, 'respondida')
  }

  const toggleArchive = () => {
    onStatusChange(
      inquiry.id,
      inquiry.status === 'archivada' ? 'leida' : 'archivada',
    )
  }

  return (
    <>
      <div className="flex h-full flex-col rounded-card border border-surface-border bg-white shadow-card">
        <div className="border-b border-surface-border px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{inquiry.clientName}</h2>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
                <span className="rounded-full bg-surface px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                  {INQUIRY_SOURCE_LABELS[inquiry.source]}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {inquiry.eventType} · {inquiry.guests} invitados · {formatInquiryDate(inquiry.eventDate)}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Recibida {formatReceivedAt(inquiry.receivedAt)} · {inquiry.lastActivity}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {inquiry.estimatedBudget != null && (
                <span className="text-sm font-bold text-primary">
                  Est. {formatCurrency(inquiry.estimatedBudget)}
                </span>
              )}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setStatusMenuOpen((o) => !o)}
                  className="inline-flex items-center gap-1 rounded-lg border border-surface-border px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-surface"
                  aria-expanded={statusMenuOpen}
                  aria-haspopup="menu"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  Estado
                </button>
                {statusMenuOpen && (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-10 cursor-default"
                      aria-label="Cerrar menú"
                      onClick={() => setStatusMenuOpen(false)}
                    />
                    <div
                      role="menu"
                      className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-surface-border bg-white py-1 shadow-lg"
                    >
                      {STATUS_ACTIONS.filter((a) => a.id !== inquiry.status).map((action) => (
                        <button
                          key={action.id}
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            onStatusChange(inquiry.id, action.id)
                            setStatusMenuOpen(false)
                          }}
                          className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-surface"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={toggleArchive}
                className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-surface"
                title={inquiry.status === 'archivada' ? 'Desarchivar' : 'Archivar'}
              >
                {inquiry.status === 'archivada' ? (
                  <ArchiveRestore className="h-4 w-4" />
                ) : (
                  <Archive className="h-4 w-4" />
                )}
                {inquiry.status === 'archivada' ? 'Desarchivar' : 'Archivar'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Mensaje del cliente
            </h3>
            <div className="mt-2 rounded-xl border border-surface-border bg-surface/40 px-4 py-3">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                {inquiry.message}
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Contacto
            </h3>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                {inquiry.email}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5 text-slate-400" />
                {inquiry.phone}
              </span>
            </div>
          </section>

          <section className="rounded-xl border border-dashed border-primary/25 bg-primary/[0.03] p-4">
            <h3 className="text-sm font-bold text-slate-900">Responder por fuera de EvenTop</h3>
            <p className="mt-1 text-xs text-slate-500">
              Abrí WhatsApp o el correo con un borrador listo. El seguimiento queda en esta bandeja.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={markInProgressIfNeeded}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" />
                Responder por WhatsApp
              </a>
              <a
                href={mailtoUrl}
                onClick={markInProgressIfNeeded}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-surface"
              >
                <Mail className="h-4 w-4" />
                Responder por email
              </a>
            </div>
          </section>
        </div>

        <div className="border-t border-surface-border p-4">
          <button
            type="button"
            onClick={() => setPdfOpen(true)}
            className="btn-primary w-full sm:w-auto"
          >
            <FileText className="h-4 w-4" />
            Generar presupuesto PDF
          </button>
        </div>
      </div>

      <PdfGeneratorModal
        inquiry={inquiry}
        isOpen={pdfOpen}
        onClose={() => setPdfOpen(false)}
        onSent={handlePdfSent}
      />
    </>
  )
}

function formatReceivedAt(ts: string): string {
  return new Date(ts).toLocaleString('es-AR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
