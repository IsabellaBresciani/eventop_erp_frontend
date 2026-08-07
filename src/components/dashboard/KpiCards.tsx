import { CalendarClock, MessageSquare, ToggleLeft, ToggleRight } from 'lucide-react'
import { type ComponentType, type ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CalendarEvent } from '../../types/dashboard'
import { getCountdown } from '../../data/dashboard'

interface KpiCardsProps {
  nextEvent: CalendarEvent | null
  pendingQueries: number
}

const CARD_THEMES = [
  'from-primary-50/80 to-white border-primary/10',
  'from-violet-50/60 to-white border-violet-100/60',
  'from-emerald-50/60 to-white border-emerald-100/60',
] as const

export function KpiCards({ nextEvent, pendingQueries }: KpiCardsProps) {
  const [weekendAvailable, setWeekendAvailable] = useState(true)
  const countdown = nextEvent ? getCountdown(nextEvent.date) : null

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <KpiCard icon={CalendarClock} title="Próximo evento" theme={CARD_THEMES[0]} onClick={() => {}}>
        {nextEvent ? (
          <>
            <p className="text-xl font-semibold tracking-tight text-slate-900">
              {nextEvent.clientName}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {nextEvent.eventType} · {formatEventDate(nextEvent.date)}
            </p>
            {countdown && (
              <div className="mt-4 flex gap-2">
                <CountdownUnit value={countdown.days} label="días" />
                <CountdownUnit value={countdown.hours} label="hs" />
                <CountdownUnit value={countdown.minutes} label="min" />
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-slate-500">No hay eventos próximos</p>
        )}
      </KpiCard>

      <KpiCard
        icon={MessageSquare}
        title="Consultas"
        theme={CARD_THEMES[1]}
        badge={pendingQueries > 0 ? pendingQueries : undefined}
        to="/dashboard/mensajeria"
      >
        <p className="text-3xl font-semibold tracking-tight text-slate-900">{pendingQueries}</p>
        <p className="mt-1 text-sm text-slate-500">
          {pendingQueries === 1 ? 'nueva consulta' : 'nuevas consultas'} · 3 presupuestos por enviar
        </p>
      </KpiCard>

      <KpiCard
        icon={weekendAvailable ? ToggleRight : ToggleLeft}
        title="Disponibilidad"
        theme={CARD_THEMES[2]}
        className="sm:col-span-2 lg:col-span-1"
        onClick={() => setWeekendAvailable(!weekendAvailable)}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-slate-900">Este fin de semana</p>
            <span
              className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                weekendAvailable
                  ? 'bg-emerald-100/80 text-emerald-700'
                  : 'bg-amber-100/80 text-amber-700'
              }`}
            >
              {weekendAvailable ? 'Libre' : 'Ocupado'}
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setWeekendAvailable(!weekendAvailable)
            }}
            className={`relative h-8 w-[3.25rem] shrink-0 rounded-full transition-colors duration-300 ${
              weekendAvailable ? 'bg-primary' : 'bg-slate-200'
            }`}
            aria-label="Toggle disponibilidad fin de semana"
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-soft transition-transform duration-300 ${
                weekendAvailable ? 'left-[1.35rem]' : 'left-1'
              }`}
            />
          </button>
        </div>
      </KpiCard>
    </div>
  )
}

function KpiCard({
  icon: Icon,
  title,
  children,
  badge,
  className = '',
  theme,
  onClick,
  to,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  children: ReactNode
  badge?: number
  className?: string
  theme: string
  onClick?: () => void
  to?: string
}) {
  const cardClass = `group w-full rounded-bento border bg-gradient-to-br p-6 text-left shadow-soft transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-elevated ${theme} ${className}`

  const content = (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-primary shadow-soft">
            <Icon className="h-[18px] w-[18px]" />
          </div>
          <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
            {title}
          </span>
        </div>
        {badge !== undefined && (
          <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-white shadow-soft">
            {badge}
          </span>
        )}
      </div>
      {children}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={`block ${cardClass}`}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={cardClass}>
      {content}
    </button>
  )
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white/70 px-3.5 py-2 shadow-soft">
      <span className="text-lg font-semibold text-primary">{value}</span>
      <span className="text-[10px] font-medium text-slate-400">{label}</span>
    </div>
  )
}

function formatEventDate(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`)
  return date.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })
}
