export type EventStatus =
  | 'presupuestado'
  | 'senado'
  | 'pagado'
  | 'reservado'
  | 'cerrado'
  | 'suspendido'

export type ServicePrepStatus = 'pendiente' | 'en_proceso' | 'listo'

export interface EventService {
  name: string
  status: ServicePrepStatus
  unitPrice?: number
  quantity?: number
  provider?: string
}

export interface StaffAssignment {
  type: string
  quantity: number
}

export interface PaymentRecord {
  id: string
  date: string
  amount: number
  method: string
  note?: string
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  user: string
  action: string
  detail?: string
}


export interface CalendarEvent {
  id: string
  date: string
  endDate?: string
  clientName: string
  eventName?: string
  eventType: string
  status: EventStatus
  startTime: string
  endTime: string
  bufferHours: number
  totalAmount: number
  depositPaid: number
  depositDate?: string
  depositMethod?: string
  guests: number
  confirmedGuests: number
  maxCapacity: number
  phone: string
  email: string
  venueSpace?: string
  internalNotes?: string
  publicDescription?: string
  clientInvitePending?: boolean
  isRecurring?: boolean
  services: EventService[]
  staffAssignments?: StaffAssignment[]
  payments: PaymentRecord[]
  auditLog: AuditLogEntry[]
  invitationUrl?: string
  assignedEmployeeIds?: string[]
}

export interface Alert {
  id: string
  type: 'urgent' | 'warning' | 'info'
  message: string
  time?: string
}

export interface DashboardMetrics {
  projectedIncome: number
  conversionRate: number
  occupancyRate: number
  soldDates: number
  totalDates: number
}
