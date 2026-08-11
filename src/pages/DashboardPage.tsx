import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { EventAuditSlideover } from '../components/dashboard/EventAuditSlideover'
import { EventListPanel, type EventListFilters } from '../components/dashboard/EventListPanel'
import { FloatingActions } from '../components/dashboard/FloatingActions'
import {
  buildCalendarEventFromForm,
  NewEventModal,
  type NewEventFormData,
} from '../components/dashboard/NewEventModal'
import { OperationalCalendar } from '../components/dashboard/OperationalCalendar'
import { PeriodSummaryCards } from '../components/dashboard/PeriodSummaryCards'
import { loadCalendarSettings } from '../data/calendar-settings'
import {
  filterEvents,
  getEventTypes,
  getPeriodDashboardStats,
} from '../data/dashboard'
import { loadEvents, saveEvents } from '../data/events-storage'
import { useAuthGuard } from '../hooks/useAuthGuard'
import type { CalendarViewMode } from '../data/dashboard'
import type { CalendarEvent } from '../types/dashboard'

const DEFAULT_FILTERS: EventListFilters = {
  query: '',
  status: 'all',
  eventType: 'all',
}

const DEMO_TODAY = new Date(2026, 7, 3)

const VIEW_LABELS: Record<CalendarViewMode, string> = {
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
}

export default function DashboardPage() {
  const { salon } = useAuthGuard({ allowedRoles: ['admin'] })
  const [searchParams, setSearchParams] = useSearchParams()
  const [events, setEvents] = useState<CalendarEvent[]>(loadEvents)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [slideoverOpen, setSlideoverOpen] = useState(false)
  const [newEventOpen, setNewEventOpen] = useState(false)
  const [filters, setFilters] = useState<EventListFilters>(DEFAULT_FILTERS)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<CalendarViewMode>(
    () => loadCalendarSettings().defaultView,
  )
  const [currentDate, setCurrentDate] = useState(DEMO_TODAY)

  useEffect(() => {
    if (searchParams.get('nuevo') === '1') {
      setNewEventOpen(true)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const filteredEvents = useMemo(
    () => filterEvents(events, filters, selectedDate, selectedEventId),
    [events, filters, selectedDate, selectedEventId],
  )
  const eventTypes = useMemo(() => getEventTypes(events), [events])

  const periodStats = useMemo(
    () => getPeriodDashboardStats(events, viewMode, currentDate),
    [events, viewMode, currentDate],
  )

  const handleCalendarSelectEvent = (event: CalendarEvent) => {
    setSelectedDate(event.date)
    setSelectedEventId(event.id)
    setSelectedEvent(event)
    setSlideoverOpen(true)
  }

  const handleListSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setSlideoverOpen(true)
  }

  const handleSelectDate = (date: string | null) => {
    setSelectedDate(date)
    setSelectedEventId(null)
  }

  const handleClearCalendarFilter = () => {
    setSelectedDate(null)
    setSelectedEventId(null)
  }

  const handleCloseSlideover = () => {
    setSlideoverOpen(false)
    setTimeout(() => setSelectedEvent(null), 350)
  }

  const handleFiltersChange = (patch: Partial<EventListFilters>) => {
    setFilters((current) => ({ ...current, ...patch }))
  }

  const handleEventUpdate = (updated: CalendarEvent) => {
    setEvents((current) => {
      const next = current.map((e) => (e.id === updated.id ? updated : e))
      saveEvents(next)
      return next
    })
    setSelectedEvent(updated)
  }

  const handleCreateEvent = (data: NewEventFormData) => {
    const newEvent = buildCalendarEventFromForm(data)
    setEvents((current) => {
      const next = [...current, newEvent]
      saveEvents(next)
      return next
    })
    setSelectedDate(data.date)
    setSelectedEventId(newEvent.id)
    setCurrentDate(new Date(`${data.date}T12:00:00`))
    setSelectedEvent(newEvent)
    setSlideoverOpen(true)
  }

  const openNewEvent = () => setNewEventOpen(true)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <DashboardLayout salonName={salon}>
        <div className="space-y-10">
          <header className="space-y-1.5">
            <p className="text-subtle">{formatToday()}</p>
            <h1 className="text-display">
              Hola, <span className="text-primary">{salon}</span>
            </h1>
          </header>

          <PeriodSummaryCards stats={periodStats} viewModeLabel={VIEW_LABELS[viewMode]} />

          <OperationalCalendar
            events={filterEvents(events, filters)}
            selectedDate={selectedDate}
            statusFilter={filters.status}
            viewMode={viewMode}
            currentDate={currentDate}
            onViewModeChange={setViewMode}
            onCurrentDateChange={setCurrentDate}
            onSelectDate={handleSelectDate}
            onSelectEvent={handleCalendarSelectEvent}
            onStatusFilterChange={(status) => handleFiltersChange({ status })}
            onNewEvent={openNewEvent}
          />

          <EventListPanel
            events={filteredEvents}
            filters={filters}
            selectedDate={selectedDate}
            onFiltersChange={handleFiltersChange}
            selectedEventId={selectedEventId}
            onClearCalendarFilter={handleClearCalendarFilter}
            onSelectEvent={handleListSelectEvent}
            eventTypes={eventTypes}
          />
        </div>
      </DashboardLayout>

      <FloatingActions onNewEvent={openNewEvent} />

      <NewEventModal
        isOpen={newEventOpen}
        onClose={() => setNewEventOpen(false)}
        onCreate={handleCreateEvent}
        defaultDate={selectedDate}
      />

      <EventAuditSlideover
        event={selectedEvent}
        isOpen={slideoverOpen}
        onClose={handleCloseSlideover}
        onEventUpdate={handleEventUpdate}
      />
    </motion.div>
  )
}

function formatToday(): string {
  return DEMO_TODAY.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}
