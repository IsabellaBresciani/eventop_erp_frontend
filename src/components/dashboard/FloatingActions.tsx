import { CalendarOff, Plus, QrCode } from 'lucide-react'
import { type ComponentType, useState } from 'react'
import { Link } from 'react-router-dom'

interface FloatingActionsProps {
  onNewEvent: () => void
}

export function FloatingActions({ onNewEvent }: FloatingActionsProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="fixed bottom-8 right-8 z-30 flex flex-col items-end gap-3">
      <div
        className={`flex flex-col items-end gap-2 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          expanded ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
        }`}
      >
        <FloatingShortcut
          icon={Plus}
          label="Nuevo evento"
          onClick={() => {
            setExpanded(false)
            onNewEvent()
          }}
          accent
        />
        <FloatingShortcut
          icon={CalendarOff}
          label="Bloquear fecha"
          onClick={() => setExpanded(false)}
        />
        <Link
          to="/dashboard/checkin"
          onClick={() => setExpanded(false)}
          className="flex items-center gap-3 rounded-apple-lg border py-2.5 pl-3 pr-5 shadow-apple backdrop-blur-2xl transition-all hover:-translate-y-0.5"
          style={{
            borderColor: 'var(--mk-border)',
            background: 'rgba(255, 255, 255, 0.92)',
          }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
            <QrCode className="h-4 w-4" />
          </div>
          <span className="text-[13px] font-medium text-ink">Validar QR</span>
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={`dash-fab ${expanded ? 'rotate-45' : ''}`}
        aria-label={expanded ? 'Cerrar acciones' : 'Acciones rápidas'}
      >
        <Plus className="h-6 w-6" strokeWidth={2} />
      </button>
    </div>
  )
}

function FloatingShortcut({
  icon: Icon,
  label,
  onClick,
  accent = false,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  onClick: () => void
  accent?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-apple-lg border py-2.5 pl-3 pr-5 shadow-apple backdrop-blur-2xl transition-all hover:-translate-y-0.5"
      style={{
        borderColor: 'var(--mk-border)',
        background: 'rgba(255, 255, 255, 0.92)',
      }}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-[10px] ${
          accent ? 'bg-primary text-white' : 'bg-black/[0.05] text-ink-muted'
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-[13px] font-medium text-ink">{label}</span>
    </button>
  )
}
