import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { EventAuditSlideover } from '../components/dashboard/EventAuditSlideover'
import { OperationalCalendar } from '../components/dashboard/OperationalCalendar'
import { loadCalendarSettings } from '../data/calendar-settings'
import { EVENT_STATUS_CONFIG, groupEventsByDate, toDateKey } from '../data/dashboard'
import { loadEvents, saveEvents } from '../data/events-storage'
import { useAuthGuard } from '../hooks/useAuthGuard'
import type { CalendarEvent, EventStatus } from '../types/dashboard'

const DEMO_TODAY = new Date(2026, 7, 3)

export default function AgendaCalendarPage() {
  const { salon } = useAuthGuard()
  const [events, setEvents] = useState<CalendarEvent[]>(loadEvents)
  const [viewMode, setViewMode] = useState(() => loadCalendarSettings().defaultView)
  const [currentDate, setCurrentDate] = useState(DEMO_TODAY)
  const [selectedDate, setSelectedDate] = useState<string | null>(toDateKey(DEMO_TODAY))
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all')
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [slideoverOpen, setSlideoverOpen] = useState(false)

  const filteredEvents = useMemo(
    () =>
      statusFilter === 'all' ? events : events.filter((event) => event.status === statusFilter),
    [events, statusFilter],
  )

  const eventsByDate = useMemo(() => groupEventsByDate(filteredEvents), [filteredEvents])

  const dayEvents = useMemo(() => {
    if (!selectedDate) return []
    return [...(eventsByDate.get(selectedDate) ?? [])].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    )
  }, [eventsByDate, selectedDate])

  const dayLabel = selectedDate
    ? new Date(`${selectedDate}T12:00:00`).toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : 'Seleccioná un día'

  const openEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setSlideoverOpen(true)
  }

  const handleCloseSlideover = () => {
    setSlideoverOpen(false)
    setTimeout(() => setSelectedEvent(null), 350)
  }

  const handleEventUpdate = (updated: CalendarEvent) => {
    setEvents((current) => {
      const next = current.map((e) => (e.id === updated.id ? updated : e))
      saveEvents(next)
      return next
    })
    setSelectedEvent(updated)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <DashboardLayout
        salonName={salon}
        title="Ver Agenda"
        subtitle="Calendario mensual de tu salón y el detalle de cada día"
        action={
          <Link
            to="/dashboard/agenda"
            className="inline-flex items-center gap-2 rounded-apple border border-black/[0.06] bg-white px-4 py-2.5 text-sm font-semibold text-ink-muted shadow-soft transition-colors hover:bg-black/[0.03] hover:text-ink"
          >
            <Settings className="h-4 w-4" />
            Configuración avanzada
          </Link>
        }
      >
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-8">
            <OperationalCalendar
              events={filteredEvents}
              selectedDate={selectedDate}
              statusFilter={statusFilter}
              viewMode={viewMode}
              currentDate={currentDate}
              onViewModeChange={setViewMode}
              onCurrentDateChange={setCurrentDate}
              onSelectDate={(date) => setSelectedDate(date ?? selectedDate)}
              onSelectEvent={openEvent}
              onStatusFilterChange={setStatusFilter}
            />
          </div>

          <div className="lg:col-span-4">
            <section className="dash-card sticky top-24 overflow-hidden">
              <div className="border-b px-6 py-5" style={{ borderColor: 'var(--mk-border)' }}>
                <p className="dash-section-label">Agenda del día</p>
                <h2 className="dash-heading mt-1 capitalize">{dayLabel}</h2>
                <p className="mt-0.5 dash-caption">
                  {dayEvents.length === 0
                    ? 'Sin eventos programados'
                    : `${dayEvents.length} evento${dayEvents.length === 1 ? '' : 's'} programado${dayEvents.length === 1 ? '' : 's'}`}
                </p>
              </div>

              <div className="max-h-[520px] space-y-3 overflow-y-auto p-4">
                {dayEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-apple-lg border border-dashed border-black/[0.08] bg-black/[0.02] py-12 text-center">
                    <p className="text-sm font-medium text-ink-muted">
                      No hay eventos para este día
                    </p>
                    <p className="mt-1 text-xs text-apple-label">
                      Elegí otra fecha en el calendario
                    </p>
                  </div>
                ) : (
                  dayEvents.map((event) => {
                    const status = EVENT_STATUS_CONFIG[event.status]
                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => openEvent(event)}
                        className="flex w-full items-center gap-3 rounded-apple-lg border border-black/[0.05] bg-white p-3.5 text-left shadow-apple transition-all hover:shadow-card-hover"
                      >
                        <div
                          className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl text-white"
                          style={{ backgroundColor: status.color }}
                        >
                          <span className="text-[11px] font-bold">{event.startTime}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-ink">
                            {event.clientName}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-ink-muted">
                            {event.eventType} · {event.guests} invitados
                          </p>
                          <span
                            className="mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold text-white"
                            style={{ backgroundColor: status.color }}
                          >
                            {status.label}
                          </span>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </section>
          </div>
        </div>
      </DashboardLayout>

      <EventAuditSlideover
        event={selectedEvent}
        isOpen={slideoverOpen}
        onClose={handleCloseSlideover}
        onEventUpdate={handleEventUpdate}
      />
    </motion.div>
  )
}
