import type { CalendarViewMode } from './calendar-settings'
import type { CalendarEvent, DashboardMetrics, EventStatus } from '../types/dashboard'

export type { CalendarViewMode }

export { MOCK_EVENTS } from './event-details'

export const EVENT_STATUS_CONFIG = {
  presupuestado: { label: 'Presupuestado', color: '#6A24E3' },
  senado: { label: 'Señado', color: '#F5C518' },
  pagado: { label: 'Pagado', color: '#10b981' },
  reservado: { label: 'Reservado', color: '#8b5cf6' },
  cerrado: { label: 'Cerrado', color: '#6b7280' },
  suspendido: { label: 'Suspendido', color: '#ef4444' },
} as const

export const MOCK_METRICS: DashboardMetrics = {
  projectedIncome: 2840000,
  conversionRate: 68,
  occupancyRate: 78,
  soldDates: 14,
  totalDates: 18,
}

export function filterEvents(
  events: CalendarEvent[],
  filters: { query: string; status: EventStatus | 'all'; eventType: string | 'all' },
  selectedDate?: string | null,
  selectedEventId?: string | null,
): CalendarEvent[] {
  const query = filters.query.trim().toLowerCase()

  return events.filter((event) => {
    if (selectedEventId && event.id !== selectedEventId) return false
    if (selectedDate && event.date !== selectedDate) return false
    if (filters.status !== 'all' && event.status !== filters.status) return false
    if (filters.eventType !== 'all' && event.eventType !== filters.eventType) return false
    if (!query) return true

    const haystack = `${event.clientName} ${event.eventType} ${event.id}`.toLowerCase()
    return haystack.includes(query)
  })
}

export function groupEventsByDate(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>()

  events.forEach((event) => {
    const existing = map.get(event.date) ?? []
    existing.push(event)
    map.set(event.date, existing)
  })

  return map
}

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function getWeekStart(date: Date): Date {
  const result = new Date(date)
  const day = (result.getDay() + 6) % 7
  result.setDate(result.getDate() - day)
  result.setHours(0, 0, 0, 0)
  return result
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function getEventTypes(events: CalendarEvent[]): string[] {
  return [...new Set(events.map((event) => event.eventType))].sort()
}

export function getNextEvent(events: CalendarEvent[]): CalendarEvent | null {
  const now = new Date('2026-08-03')
  const upcoming = events
    .filter((e) => new Date(e.date) >= now && e.status !== 'cerrado' && e.status !== 'suspendido')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  return upcoming[0] ?? null
}

export function getCountdown(targetDate: string): { days: number; hours: number; minutes: number } {
  const now = new Date('2026-08-03T19:43:00')
  const target = new Date(`${targetDate}T20:00:00`)
  const diff = target.getTime() - now.getTime()

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return { days, hours, minutes }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount)
}

const DEMO_TODAY = new Date(2026, 7, 3)

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const OCCUPIED_STATUSES: EventStatus[] = [
  'presupuestado',
  'senado',
  'pagado',
  'reservado',
]

export interface StatComparison {
  changePercent: number | null
}

export interface PeriodDashboardStats {
  periodLabel: string
  occupancyRate: number
  occupiedDays: number
  totalDays: number
  billing: number
  nextEvent: CalendarEvent | null
  nextAvailableDate: string | null
  comparisons: {
    occupancy: StatComparison
    billing: StatComparison
    eventsCount: StatComparison
    freeDays: StatComparison
  }
}

export function getPeriodRange(
  viewMode: CalendarViewMode,
  anchor: Date,
): { start: Date; end: Date } {
  if (viewMode === 'month') {
    const start = new Date(anchor.getFullYear(), anchor.getMonth(), 1)
    const end = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0)
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
    return { start, end }
  }

  if (viewMode === 'week') {
    const start = getWeekStart(anchor)
    const end = addDays(start, 6)
    end.setHours(23, 59, 59, 999)
    return { start, end }
  }

  const start = new Date(anchor)
  start.setHours(0, 0, 0, 0)
  const end = new Date(anchor)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

export function getPeriodLabel(viewMode: CalendarViewMode, date: Date): string {
  if (viewMode === 'month') {
    return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
  }

  if (viewMode === 'day') {
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const weekStart = getWeekStart(date)
  const weekEnd = addDays(weekStart, 6)
  const sameMonth = weekStart.getMonth() === weekEnd.getMonth()

  if (sameMonth) {
    return `${weekStart.getDate()} – ${weekEnd.getDate()} ${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getFullYear()}`
  }

  return `${weekStart.getDate()} ${MONTH_NAMES[weekStart.getMonth()].slice(0, 3)} – ${weekEnd.getDate()} ${MONTH_NAMES[weekEnd.getMonth()].slice(0, 3)} ${weekEnd.getFullYear()}`
}

function eachDayInRange(start: Date, end: Date): Date[] {
  const days: Date[] = []
  const cursor = new Date(start)

  while (cursor <= end) {
    days.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }

  return days
}

function isOccupiedEvent(event: CalendarEvent): boolean {
  return OCCUPIED_STATUSES.includes(event.status)
}

function isEventInRange(event: CalendarEvent, start: Date, end: Date): boolean {
  const eventDate = new Date(`${event.date}T12:00:00`)
  return eventDate >= start && eventDate <= end
}

interface MonthMetrics {
  occupancyRate: number
  billing: number
  eventsCount: number
  freeDays: number
}

function getMonthMetrics(events: CalendarEvent[], year: number, month: number): MonthMetrics {
  const anchor = new Date(year, month, 1)
  const { start, end } = getPeriodRange('month', anchor)
  const days = eachDayInRange(start, end)

  const occupiedDayKeys = new Set<string>()
  events.forEach((event) => {
    if (isEventInRange(event, start, end) && isOccupiedEvent(event)) {
      occupiedDayKeys.add(event.date)
    }
  })

  const occupiedDays = occupiedDayKeys.size
  const occupancyRate =
    days.length > 0 ? Math.round((occupiedDays / days.length) * 100) : 0

  const billing = events
    .filter((event) => isEventInRange(event, start, end) && event.status !== 'suspendido')
    .reduce((sum, event) => sum + event.depositPaid, 0)

  const eventsCount = events.filter(
    (event) =>
      isEventInRange(event, start, end) &&
      event.status !== 'cerrado' &&
      event.status !== 'suspendido',
  ).length

  const freeDays = days.length - occupiedDays

  return { occupancyRate, billing, eventsCount, freeDays }
}

function getPreviousMonth(year: number, month: number): { year: number; month: number } {
  if (month === 0) return { year: year - 1, month: 11 }
  return { year, month: month - 1 }
}

function getMonthOverMonthChange(current: number, previous: number): StatComparison {
  if (previous === 0) {
    if (current === 0) return { changePercent: 0 }
    return { changePercent: 100 }
  }

  return {
    changePercent: Math.round(((current - previous) / previous) * 100),
  }
}

export function getPeriodDashboardStats(
  events: CalendarEvent[],
  viewMode: CalendarViewMode,
  currentDate: Date,
): PeriodDashboardStats {
  const { start, end } = getPeriodRange(viewMode, currentDate)
  const periodLabel = getPeriodLabel(viewMode, currentDate)
  const days = eachDayInRange(start, end)
  const eventsByDate = groupEventsByDate(events)

  const occupiedDayKeys = new Set<string>()
  events.forEach((event) => {
    if (isEventInRange(event, start, end) && isOccupiedEvent(event)) {
      occupiedDayKeys.add(event.date)
    }
  })

  const occupancyRate =
    days.length > 0 ? Math.round((occupiedDayKeys.size / days.length) * 100) : 0

  const billing = events
    .filter((event) => isEventInRange(event, start, end) && event.status !== 'suspendido')
    .reduce((sum, event) => sum + event.depositPaid, 0)

  const nextEvent =
    events
      .filter(
        (event) =>
          new Date(`${event.date}T12:00:00`) >= DEMO_TODAY &&
          event.status !== 'cerrado' &&
          event.status !== 'suspendido',
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ?? null

  const searchStart = DEMO_TODAY > start ? DEMO_TODAY : start
  let nextAvailableDate: string | null = null

  for (let offset = 0; offset < 120; offset++) {
    const day = addDays(searchStart, offset)
    const key = toDateKey(day)
    const dayEvents = eventsByDate.get(key) ?? []
    const isBlocked = dayEvents.some(isOccupiedEvent)

    if (!isBlocked) {
      nextAvailableDate = key
      break
    }
  }

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const previous = getPreviousMonth(currentYear, currentMonth)
  const currentMetrics = getMonthMetrics(events, currentYear, currentMonth)
  const previousMetrics = getMonthMetrics(events, previous.year, previous.month)

  return {
    periodLabel,
    occupancyRate,
    occupiedDays: occupiedDayKeys.size,
    totalDays: days.length,
    billing,
    nextEvent,
    nextAvailableDate,
    comparisons: {
      occupancy: getMonthOverMonthChange(
        currentMetrics.occupancyRate,
        previousMetrics.occupancyRate,
      ),
      billing: getMonthOverMonthChange(currentMetrics.billing, previousMetrics.billing),
      eventsCount: getMonthOverMonthChange(
        currentMetrics.eventsCount,
        previousMetrics.eventsCount,
      ),
      freeDays: getMonthOverMonthChange(currentMetrics.freeDays, previousMetrics.freeDays),
    },
  }
}
