import { Check, Copy, Link2, MessageCircle, Share2 } from 'lucide-react'
import { useState } from 'react'

interface LinkManagerProps {
  url: string
}

export function LinkManager({ url }: LinkManagerProps) {
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`¡Estás invitado! Confirmá tu asistencia aquí: ${url}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const shareGeneric = () => {
    if (navigator.share) {
      navigator.share({ title: 'Invitación EvenTop', url })
    } else {
      copyLink()
    }
  }

  return (
    <div className="rounded-card border border-surface-border bg-white p-5 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <Link2 className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold text-slate-900">Gestor de Enlace (RF-204)</h3>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={url}
          className="input-field flex-1 font-mono text-xs text-slate-600"
        />
        <button
          type="button"
          onClick={copyLink}
          className={`btn-primary shrink-0 px-4 ${copied ? 'bg-emerald-600' : ''}`}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={shareWhatsApp}
          className="btn-secondary flex-1 py-2.5 text-xs"
        >
          <MessageCircle className="h-4 w-4 text-emerald-600" />
          WhatsApp
        </button>
        <button
          type="button"
          onClick={shareGeneric}
          className="btn-secondary flex-1 py-2.5 text-xs"
        >
          <Share2 className="h-4 w-4 text-primary" />
          Compartir
        </button>
      </div>
    </div>
  )
}
