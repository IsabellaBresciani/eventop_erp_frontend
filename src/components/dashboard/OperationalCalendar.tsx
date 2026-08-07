import { ChevronLeft, ChevronRight, Plus, Settings } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  type CalendarViewMode,
  loadCalendarSettings,
} from '../../data/calendar-settings'
import { EVENT_STATUS_CONFIG, addDays, getPeriodLabel, getWeekStart, groupEventsByDate, toDateKey } from '../../data/dashboard'
import type { CalendarEvent } from '../../types/dashboard'

export type { CalendarViewMode }

interface OperationalCalendarProps {
  events: CalendarEvent[]
  selectedDate: string | null
  viewMode: CalendarViewMode
  currentDate: Date
  onViewModeChange: (mode: CalendarViewMode) => void
  onCurrentDateChange: (date: Date) => void
  onSelectDate: (date: string | null) => void
  onSelectEvent: (event: CalendarEvent) => void
  onNewEvent?: () => void
}

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const DEMO_TODAY = new Date(2026, 7, 3)

const VIEW_LABELS: Record<CalendarViewMode, string> = {
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
}

export function OperationalCalendar({
  events,
  selectedDate,
  viewMode,
  currentDate,
  onViewModeChange,
  onCurrentDateChange,
  onSelectDate,
  onSelectEvent,
  onNewEvent,
}: OperationalCalendarProps) {
  const [settings] = useState(loadCalendarSettings)

  const eventsByDate = useMemo(() => groupEventsByDate(events), [events])

  const navigate = (direction: -1 | 1) => {
    const next = new Date(currentDate)
    if (viewMode === 'month') {
      next.setMonth(next.getMonth() + direction)
    } else if (viewMode === 'week') {
      next.setDate(next.getDate() + direction * 7)
    } else {
      next.setDate(next.getDate() + direction)
    }
    onCurrentDateChange(next)
  }

  const handleDayClick = (dateStr: string, dayEvents: CalendarEvent[]) => {
    onSelectDate(dateStr)
    if (dayEvents.length === 1) {
      onSelectEvent(dayEvents[0])
    } else if (viewMode !== 'month') {
      onCurrentDateChange(new Date(`${dateStr}T12:00:00`))
      if (viewMode === 'week' && dayEvents.length > 1) {
        onViewModeChange('day')
      }
    }
  }

  const periodLabel = getPeriodLabel(viewMode, currentDate)
  const viewSubtitle = `Vista ${VIEW_LABELS[viewMode].toLowerCase()}`

  return (
    <section className="dash-card overflow-hidden">
      <div className="border-b border-black/[0.05] px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="dash-section-label">Calendario</p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-slate-900">
              {periodLabel}
            </h2>
            <p className="mt-0.5 text-[13px] text-slate-500">{viewSubtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onNewEvent && (
              <button type="button" onClick={onNewEvent} className="dash-btn-primary">
                <Plus className="h-4 w-4" />
                Nuevo evento
              </button>
            )}

            <ViewModeToggle viewMode={viewMode} onChange={onViewModeChange} />

            <div className="flex items-center rounded-apple bg-black/[0.04] p-0.5">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-[10px] p-2 text-slate-500 transition-colors hover:bg-white hover:text-slate-800"
                aria-label="Periodo anterior"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => navigate(1)}
                className="rounded-[10px] p-2 text-slate-500 transition-colors hover:bg-white hover:text-slate-800"
                aria-label="Periodo siguiente"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            <Link
              to="/dashboard/agenda"
              className="rounded-apple bg-black/[0.04] p-2.5 text-slate-600 transition-colors hover:bg-black/[0.06] hover:text-slate-800"
              aria-label="Configuración avanzada de agenda"
              title="Configuración avanzada de agenda"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 sm:px-6 sm:py-6">
        {settings.showLegend && (
          <div className="mb-5 flex flex-wrap gap-2">
            {Object.entries(EVENT_STATUS_CONFIG).map(([key, { label, color }]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.04] px-3 py-1.5 text-xs font-medium text-slate-600"
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                {label}
              </span>
            ))}
          </div>
        )}

        {viewMode === 'month' && (
          <MonthView
            currentDate={currentDate}
            eventsByDate={eventsByDate}
            selectedDate={selectedDate}
            largeCells={settings.largeCells}
            onDayClick={handleDayClick}
          />
        )}
        {viewMode === 'week' && (
          <WeekView
            currentDate={currentDate}
            eventsByDate={eventsByDate}
            selectedDate={selectedDate}
            onDayClick={handleDayClick}
            onSelectEvent={onSelectEvent}
          />
        )}
        {viewMode === 'day' && (
          <DayView
            currentDate={currentDate}
            eventsByDate={eventsByDate}
            onSelectEvent={onSelectEvent}
          />
        )}
      </div>
    </section>
  )
}

function ViewModeToggle({
  viewMode,
  onChange,
}: {
  viewMode: CalendarViewMode
  onChange: (mode: CalendarViewMode) => void
}) {
  return (
    <div className="segmented-control">
      {(['month', 'week', 'day'] as CalendarViewMode[]).map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => onChange(mode)}
          className={`segmented-item ${viewMode === mode ? 'segmented-item-active' : ''}`}
        >
          {VIEW_LABELS[mode]}
        </button>
      ))}
    </div>
  )
}

function MonthView({
  currentDate,
  eventsByDate,
  selectedDate,
  largeCells,
  onDayClick,
}: {
  currentDate: Date
  eventsByDate: Map<string, CalendarEvent[]>
  selectedDate: string | null
  largeCells: boolean
  onDayClick: (dateStr: string, dayEvents: CalendarEvent[]) => void
}) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startOffset = (firstDay.getDay() + 6) % 7
    const days: (number | null)[] = []

    for (let i = 0; i < startOffset; i++) days.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(d)

    return days
  }, [month, year])

  const todayKey = toDateKey(DEMO_TODAY)

  return (
    <div className={`grid grid-cols-7 ${largeCells ? 'gap-1.5 sm:gap-2' : 'gap-1 sm:gap-1.5'}`}>
      {WEEKDAYS.map((d) => (
        <div
          key={d}
          className={`pb-1 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${
            largeCells ? 'text-xs' : ''
          }`}
        >
          {d}
        </div>
      ))}

      {calendarDays.map((day, i) => {
        if (day === null) {
          return <div key={`empty-${i}`} className="min-h-[3.5rem]" />
        }

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const dayEvents = eventsByDate.get(dateStr) ?? []
        const isToday = dateStr === todayKey
        const isSelected = dateStr === selectedDate
        const hasEvents = dayEvents.length > 0
        const singleEvent = dayEvents.length === 1 ? dayEvents[0] : null
        const statusColor = singleEvent ? EVENT_STATUS_CONFIG[singleEvent.status].color : undefined

        return (
          <button
            key={day}
            type="button"
            onClick={() => onDayClick(dateStr, dayEvents)}
            className={`group relative flex flex-col rounded-[12px] p-1.5 text-left transition-all duration-200 sm:p-2 ${
              largeCells ? 'min-h-[5.5rem] sm:min-h-[6.5rem]' : 'min-h-[4rem] sm:min-h-[4.75rem]'
            } ${hasEvents ? 'cursor-pointer hover:shadow-apple' : 'cursor-default'} ${
              isSelected ? 'ring-2 ring-primary ring-offset-1 ring-offset-white' : ''
            } ${!hasEvents ? 'bg-black/[0.025] hover:bg-black/[0.04]' : 'border border-black/[0.04] bg-white'}`}
            style={
              singleEvent && statusColor
                ? { backgroundColor: `${statusColor}10`, borderColor: `${statusColor}22` }
                : hasEvents && dayEvents.length > 1
                  ? { backgroundColor: 'rgba(94, 23, 235, 0.05)', borderColor: 'rgba(94, 23, 235, 0.1)' }
                  : undefined
            }
          >
            <div className="flex items-start justify-between">
              <span
                className={`flex items-center justify-center rounded-full font-semibold ${
                  largeCells ? 'h-7 w-7 text-sm' : 'h-6 w-6 text-xs'
                } ${isToday ? 'bg-primary text-white shadow-soft' : 'text-slate-700'}`}
              >
                {day}
              </span>

              {dayEvents.length > 1 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                  {dayEvents.length}
                </span>
              )}
            </div>

            <div className="mt-auto flex flex-col gap-0.5 pt-1">
              {singleEvent && (
                <span
                  className="truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium text-white"
                  style={{ backgroundColor: statusColor }}
                >
                  {singleEvent.clientName.split(' ')[0]}
                </span>
              )}
              {dayEvents.length > 1 &&
                dayEvents.slice(0, 2).map((event) => (
                  <span
                    key={event.id}
                    className="truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium text-white"
                    style={{ backgroundColor: EVENT_STATUS_CONFIG[event.status].color }}
                  >
                    {event.clientName.split(' ')[0]}
                  </span>
                ))}
            </div>
          </button>
        )
      })}
    </div>
  )
}

function WeekView({
  currentDate,
  eventsByDate,
  selectedDate,
  onDayClick,
  onSelectEvent,
}: {
  currentDate: Date
  eventsByDate: Map<string, CalendarEvent[]>
  selectedDate: string | null
  onDayClick: (dateStr: string, dayEvents: CalendarEvent[]) => void
  onSelectEvent: (event: CalendarEvent) => void
}) {
  const weekStart = getWeekStart(currentDate)
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const todayKey = toDateKey(DEMO_TODAY)

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
      {days.map((day) => {
        const dateStr = toDateKey(day)
        const dayEvents = eventsByDate.get(dateStr) ?? []
        const isToday = dateStr === todayKey
        const isSelected = dateStr === selectedDate

        return (
          <div
            key={dateStr}
            className={`flex min-h-[220px] flex-col rounded-apple-lg border p-3 transition-all ${
              isSelected
                ? 'border-primary/25 bg-primary/5 shadow-apple'
                : isToday
                  ? 'border-primary/15 bg-white shadow-apple'
                  : 'border-black/[0.05] bg-black/[0.02]'
            }`}
          >
            <button
              type="button"
              onClick={() => onDayClick(dateStr, dayEvents)}
              className="mb-2 flex items-center justify-between rounded-[10px] px-1 py-1 text-left hover:bg-black/[0.04]"
            >
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400">
                  {WEEKDAYS[(day.getDay() + 6) % 7]}
                </p>
                <p className={`text-lg font-bold ${isToday ? 'text-primary' : 'text-slate-800'}`}>
                  {day.getDate()}
                </p>
              </div>
              {dayEvents.length > 0 && (
                <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white">
                  {dayEvents.length}
                </span>
              )}
            </button>

            <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
              {dayEvents.length === 0 ? (
                <p className="px-1 text-[10px] text-slate-400">Sin eventos</p>
              ) : (
                dayEvents.map((event) => {
                  const status = EVENT_STATUS_CONFIG[event.status]
                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => onSelectEvent(event)}
                      className="rounded-apple border border-black/[0.04] bg-white p-2.5 text-left shadow-apple transition-all hover:shadow-card-hover"
                    >
                      <p className="truncate text-[11px] font-semibold text-slate-800">
                        {event.clientName}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        {event.startTime} · {event.eventType}
                      </p>
                      <span
                        className="mt-1 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-semibold text-white"
                        style={{ backgroundColor: status.color }}
                      >
                        {status.label}
                      </span>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DayView({
  currentDate,
  eventsByDate,
  onSelectEvent,
}: {
  currentDate: Date
  eventsByDate: Map<string, CalendarEvent[]>
  onSelectEvent: (event: CalendarEvent) => void
}) {
  const dateStr = toDateKey(currentDate)
  const dayEvents = [...(eventsByDate.get(dateStr) ?? [])].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  )

  return (
    <div className="space-y-3">
      <div className="rounded-apple-lg border border-black/[0.05] bg-black/[0.02] px-5 py-4">
        <p className="text-sm font-semibold capitalize text-slate-800">
          {currentDate.toLocaleDateString('es-AR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          {dayEvents.length === 1
            ? '1 evento programado'
            : `${dayEvents.length} eventos programados`}
        </p>
      </div>

      {dayEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-apple-lg border border-dashed border-black/[0.08] bg-black/[0.02] py-16 text-center">
          <p className="text-sm font-medium text-slate-600">No hay eventos este día</p>
          <p className="mt-1 text-xs text-slate-400">Navegá a otra fecha o cambiá los filtros</p>
        </div>
      ) : (
        dayEvents.map((event) => {
          const status = EVENT_STATUS_CONFIG[event.status]
          return (
            <button
              key={event.id}
              type="button"
              onClick={() => onSelectEvent(event)}
              className="flex w-full items-center gap-4 rounded-apple-lg border border-black/[0.05] bg-white p-5 text-left shadow-apple transition-all hover:shadow-card-hover"
            >
              <div
                className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: status.color }}
              >
                <span className="text-xs font-bold">{event.startTime}</span>
                <span className="text-[9px] opacity-80">{event.endTime}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-slate-900">{event.clientName}</p>
                <p className="mt-0.5 text-sm text-slate-500">
                  {event.eventType} · {event.guests} invitados
                </p>
                <span
                  className="mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
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
  )
}
