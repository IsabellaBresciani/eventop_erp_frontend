export type CalendarViewMode = 'month' | 'week' | 'day'

export interface CalendarSettings {
  defaultView: CalendarViewMode
  largeCells: boolean
  showLegend: boolean
  weekStartsOnMonday: boolean
}

export const DEFAULT_CALENDAR_SETTINGS: CalendarSettings = {
  defaultView: 'month',
  largeCells: true,
  showLegend: true,
  weekStartsOnMonday: true,
}

const STORAGE_KEY = 'eventop_calendar_settings'

export function loadCalendarSettings(): CalendarSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return { ...DEFAULT_CALENDAR_SETTINGS, ...JSON.parse(stored) }
  } catch {}
  return DEFAULT_CALENDAR_SETTINGS
}

export function saveCalendarSettings(settings: CalendarSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}
