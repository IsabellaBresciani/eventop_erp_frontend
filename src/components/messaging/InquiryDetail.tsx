import { FileText, Mail, MessageSquare, Phone, Send } from 'lucide-react'
import { useState } from 'react'
import { formatCurrency } from '../../data/dashboard'
import { INQUIRY_STATUS_CONFIG } from '../../data/messaging'
import type { Inquiry } from '../../types/messaging'
import { PdfGeneratorModal } from './PdfGeneratorModal'
import { QuickReplies } from './QuickReplies'

interface InquiryDetailProps {
  inquiry: Inquiry | null
  onSendMessage: (inquiryId: string, text: string) => void
  onStatusChange: (inquiryId: string, status: Inquiry['status']) => void
}

export function InquiryDetail({ inquiry, onSendMessage, onStatusChange }: InquiryDetailProps) {
  const [replyText, setReplyText] = useState('')
  const [pdfOpen, setPdfOpen] = useState(false)

  if (!inquiry) {
    return (
      <div className="flex h-full items-center justify-center rounded-card border border-surface-border bg-white shadow-card">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">Seleccioná una consulta para ver el detalle</p>
        </div>
      </div>
    )
  }

  const status = INQUIRY_STATUS_CONFIG[inquiry.status]

  const handleSend = () => {
    if (!replyText.trim()) return
    onSendMessage(inquiry.id, replyText.trim())
    setReplyText('')
    if (inquiry.status === 'nueva') {
      onStatusChange(inquiry.id, 'seguimiento')
    }
  }

  const handlePdfSent = () => {
    onStatusChange(inquiry.id, 'presupuesto_enviado')
  }

  return (
    <>
      <div className="flex h-full flex-col rounded-card border border-surface-border bg-white shadow-card">
        <div className="border-b border-surface-border px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{inquiry.clientName}</h2>
              <p className="text-sm text-slate-500">
                {inquiry.eventType} · {inquiry.guests} invitados ·{' '}
                {formatDate(inquiry.eventDate)}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1 hover:text-primary">
                  <Mail className="h-3 w-3" /> {inquiry.email}
                </a>
                <a href={`tel:${inquiry.phone}`} className="flex items-center gap-1 hover:text-primary">
                  <Phone className="h-3 w-3" /> {inquiry.phone}
                </a>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${status.bg} ${status.text}`}>
                {status.label}
              </span>
              {inquiry.estimatedBudget && (
                <span className="text-sm font-bold text-primary">
                  Est. {formatCurrency(inquiry.estimatedBudget)}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPdfOpen(true)}
            className="btn-primary mt-4 w-full sm:w-auto"
          >
            <FileText className="h-4 w-4" />
            Generar Presupuesto PDF (RF-006)
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {inquiry.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'salon' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  msg.sender === 'salon'
                    ? 'rounded-br-md bg-primary text-white'
                    : 'rounded-bl-md bg-surface text-slate-800'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p
                  className={`mt-1 text-[10px] ${
                    msg.sender === 'salon' ? 'text-primary-100' : 'text-slate-400'
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <QuickReplies onSelect={(text) => setReplyText(text)} />

        <div className="border-t border-surface-border p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribí tu respuesta..."
              className="input-field flex-1"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!replyText.trim()}
              className="btn-primary shrink-0 px-4 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
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

function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
  })
}

function formatTime(ts: string): string {
  return new Date(ts).toLocaleString('es-AR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
