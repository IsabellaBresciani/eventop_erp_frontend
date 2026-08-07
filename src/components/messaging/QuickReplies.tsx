import { Zap } from 'lucide-react'
import { QUICK_REPLY_TEMPLATES } from '../../data/messaging'

interface QuickRepliesProps {
  onSelect: (text: string) => void
}

export function QuickReplies({ onSelect }: QuickRepliesProps) {
  return (
    <div className="border-t border-surface-border bg-surface/30 p-3">
      <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        <Zap className="h-3 w-3" />
        Plantillas de respuesta
      </p>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_REPLY_TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => onSelect(tpl.text)}
            className="rounded-full border border-surface-border bg-white px-3 py-1 text-[11px] font-medium text-slate-600 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
          >
            {tpl.label}
          </button>
        ))}
      </div>
    </div>
  )
}
