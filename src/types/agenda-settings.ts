export type SlotGranularity = 15 | 30 | 45 | 60 | 120

export type VisitCapacity = 'individual' | 'group'

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface EventTemplate {
  id: string
  name: string
  durationHours: number
}

export interface VisitSlot {
  id: string
  day: Weekday
  startTime: string
  endTime: string
}

export interface StatusColor {
  key: string
  label: string
  color: string
}

export interface ScheduleException {
  id: string
  date: string
  label: string
}

export interface AgendaSettings {
  slotGranularity: SlotGranularity
  openDays: Record<Weekday, boolean>
  blockHolidays: boolean
  bufferHours: number
  minAdvanceValue: number
  minAdvanceUnit: 'hours' | 'days'
  maxAdvanceMonths: number
  quoteExpiryHours: number
  visitCapacity: VisitCapacity
  visitSlots: VisitSlot[]
  preQualification: {
    eventType: boolean
    guests: boolean
    budget: boolean
  }
  eventTemplates: EventTemplate[]
  statusColors: StatusColor[]
  reminderDays: number
  exceptions: ScheduleException[]
}

export type AgendaTab =
  | 'availability'
  | 'marketplace'
  | 'visits'
  | 'templates'
  | 'visual'
