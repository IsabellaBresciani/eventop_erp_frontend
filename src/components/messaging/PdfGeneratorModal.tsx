import { AnimatePresence, motion } from 'framer-motion'
import { Check, FileText, Loader2, Mail, MessageCircle, X } from 'lucide-react'
import { useState } from 'react'
import { formatCurrency } from '../../data/dashboard'
import type { Inquiry } from '../../types/messaging'

interface PdfGeneratorModalProps {
  inquiry: Inquiry | null
  isOpen: boolean
  onClose: () => void
  onSent: (inquiryId: string) => void
}

export function PdfGeneratorModal({ inquiry, isOpen, onClose, onSent }: PdfGeneratorModalProps) {
  const [step, setStep] = useState<'preview' | 'sending' | 'done'>('preview')
  const [channel, setChannel] = useState<'email' | 'whatsapp' | 'both'>('both')

  if (!inquiry) return null

  const handleSend = async () => {
    setStep('sending')
    await new Promise((r) => setTimeout(r, 1500))
    setStep('done')
    onSent(inquiry.id)
    setTimeout(() => {
      setStep('preview')
      onClose()
    }, 2000)
  }

  const reset = () => {
    setStep('preview')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm"
            onClick={reset}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-lg -translate-y-1/2 rounded-card border border-surface-border bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-slate-900">Generar Presupuesto PDF</h3>
              </div>
              <button type="button" onClick={reset} className="rounded-lg p-1.5 text-slate-400 hover:bg-surface">
                <X className="h-5 w-5" />
              </button>
            </div>

            {step === 'preview' && (
              <>
                <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white p-5">
                  <div className="mb-3 flex items-center justify-between border-b border-surface-border pb-3">
                    <span className="text-lg font-bold text-primary">EvenTop</span>
                    <span className="text-xs text-slate-400">RF-006</span>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Presupuesto formal
                  </p>
                  <h4 className="mt-1 text-lg font-bold text-slate-900">{inquiry.clientName}</h4>
                  <div className="mt-3 space-y-1 text-sm text-slate-600">
                    <p>Evento: <strong>{inquiry.eventType}</strong></p>
                    <p>Fecha: <strong>{formatDate(inquiry.eventDate)}</strong></p>
                    <p>Invitados: <strong>{inquiry.guests}</strong></p>
                  </div>
                  <div className="mt-4 border-t border-surface-border pt-3">
                    <p className="text-2xl font-bold text-slate-900">
                      {formatCurrency(inquiry.estimatedBudget ?? 0)}
                    </p>
                    <p className="text-xs text-slate-500">Seña 30% · Validez 48hs</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold text-slate-500">Enviar por</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'email', label: 'Email', icon: Mail },
                        { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                        { id: 'both', label: 'Ambos', icon: FileText },
                      ] as const
                    ).map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setChannel(id)}
                        className={`flex flex-col items-center gap-1 rounded-xl border py-2.5 text-xs font-medium transition-all ${
                          channel === id
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-surface-border text-slate-600'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="button" onClick={handleSend} className="btn-primary mt-5 w-full">
                  <FileText className="h-4 w-4" />
                  Generar y enviar presupuesto
                </button>
              </>
            )}

            {step === 'sending' && (
              <div className="py-10 text-center">
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
                <p className="mt-4 font-medium text-slate-800">Generando PDF...</p>
                <p className="text-sm text-slate-500">Enviando a {inquiry.email}</p>
              </div>
            )}

            {step === 'done' && (
              <div className="py-10 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="font-bold text-slate-900">¡Presupuesto enviado!</p>
                <p className="mt-1 text-sm text-slate-500">
                  PDF enviado por {channel === 'both' ? 'email y WhatsApp' : channel}
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
