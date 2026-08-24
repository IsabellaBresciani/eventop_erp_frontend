import { CalendarClock, CalendarDays, MapPin } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { HostAccountLayout } from '../../components/marketplace/host-account/HostAccountLayout'
import { getHostVisits } from '../../data/marketplace-venues'
import type { HostVisitRequest } from '../../types/marketplace-host'

interface AgendaEvent {
  id: string
  date: string
  title: string
  subtitle?: string
  kind: 'visita' | 'evento' | 'vencimiento'
  status?: string
  salonId?: string
}

function parseDate(value: string): Date | null {
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

const KIND_STYLES: Record<AgendaEvent['kind'], { bg: string; text: string; label: string }> = {
  visita: { bg: 'bg-primary/10', text: 'text-primary', label: 'Visita agendada' },
  evento: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Tu evento' },
  vencimiento: { bg: 'bg-rose-50', text: 'text-rose-700', label: 'Vencimiento' },
}

function useAgendaEvents(): AgendaEvent[] {
  return useMemo(() => {
    const visits: HostVisitRequest[] = getHostVisits()
    const visitEvents: AgendaEvent[] = visits
      .map((v): AgendaEvent | null => {
        const date = parseDate(v.date)
        if (!date) return null
        return {
          id: v.id,
          date: v.date,
          title: `Visita a ${v.salonName}`,
          subtitle: v.slot ? `Horario: ${v.slot}` : undefined,
          kind: 'visita',
          status: v.status,
          salonId: v.salonId,
        }
      })
      .filter((e): e is AgendaEvent => e !== null)

    return visitEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [])
}

export default function HostAgendaPage() {
  const events = useAgendaEvents()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = events.filter((e) => {
    const d = parseDate(e.date)
    return d && d.getTime() >= today.getTime()
  })
  const past = events.filter((e) => {
    const d = parseDate(e.date)
    return d && d.getTime() < today.getTime()
  })

  return (
    <HostAccountLayout
      title="Agenda"
      subtitle="Tus próximas visitas a salones y fechas importantes para tu evento"
    >
      {events.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {upcoming.length > 0 && (
              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
                  Próximas fechas
                </h2>
                <div className="space-y-3">
                  {upcoming.map((event) => (
                    <AgendaCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
                  Fechas pasadas
                </h2>
                <div className="space-y-3 opacity-70">
                  {past.map((event) => (
                    <AgendaCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <MonthGlance events={events} />
        </div>
      )}
    </HostAccountLayout>
  )
}

function AgendaCard({ event }: { event: AgendaEvent }) {
  const date = parseDate(event.date)
  const style = KIND_STYLES[event.kind]

  return (
    <div className="mk-card flex items-start gap-4 p-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.bg} ${style.text}`}>
        <CalendarClock className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full ${style.bg} ${style.text} px-2 py-0.5 text-[11px] font-semibold`}>
            {style.label}
          </span>
          {event.status && (
            <span className="rounded-full bg-secondary/40 px-2 py-0.5 text-[11px] font-medium text-ink-muted">
              {event.status}
            </span>
          )}
        </div>
        <p className="mt-1.5 font-semibold text-ink">{event.title}</p>
        {date && <p className="text-sm text-ink-muted">{formatDayLabel(date)}</p>}
        {event.subtitle && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {event.subtitle}
          </p>
        )}
        {event.salonId && (
          <Link
            to={`/marketplace/salones/${event.salonId}`}
            className="mt-2 inline-block text-xs font-semibold text-primary hover:underline"
          >
            Ver salón
          </Link>
        )}
      </div>
    </div>
  )
}

function MonthGlance({ events }: { events: AgendaEvent[] }) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = (firstDay.getDay() + 6) % 7 // Monday-first

  const markedDays = new Set(
    events
      .map((e) => parseDate(e.date))
      .filter((d): d is Date => Boolean(d) && d!.getFullYear() === year && d!.getMonth() === month)
      .map((d) => d.getDate()),
  )

  const cells: (number | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const monthLabel = now.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })

  return (
    <div className="sticky top-24 h-fit rounded-card border border-surface-border bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold capitalize text-ink">{monthLabel}</h3>
      </div>
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-ink-muted">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <span key={i} />
          const isToday = day === now.getDate()
          const marked = markedDays.has(day)
          return (
            <div
              key={i}
              className={`flex h-8 items-center justify-center rounded-lg text-[11px] font-medium ${
                marked
                  ? 'bg-primary text-white'
                  : isToday
                    ? 'border border-primary/40 text-primary'
                    : 'text-ink-muted'
              }`}
            >
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="mk-card flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CalendarDays className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-semibold text-ink">Todavía no tenés fechas agendadas</h2>
      <p className="max-w-sm text-sm text-ink-muted">
        Cuando agendes una visita a un salón o definas la fecha de tu evento, vas a verla acá para no
        perderte nada.
      </p>
      <Link to="/marketplace" className="mk-btn-primary mt-2">
        Explorar salones
      </Link>
    </div>
  )
}
