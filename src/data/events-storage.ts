import type { CalendarEvent } from '../types/dashboard'
import { MOCK_EVENTS } from './event-details'

const STORAGE_KEY = 'eventop_calendar_events'

/** Asignaciones demo iniciales */
const DEFAULT_ASSIGNMENTS: Record<string, string[]> = {
  'evt-001': ['emp-001', 'emp-002'],
  'evt-003': ['emp-001'],
  'evt-005': ['emp-002'],
  'evt-007': ['emp-001', 'emp-002'],
}

export function loadEvents(): CalendarEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as CalendarEvent[]
  } catch {
    /* use defaults */
  }

  return MOCK_EVENTS.map((event) => ({
    ...event,
    assignedEmployeeIds: DEFAULT_ASSIGNMENTS[event.id] ?? [],
  }))
}

export function saveEvents(events: CalendarEvent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}
