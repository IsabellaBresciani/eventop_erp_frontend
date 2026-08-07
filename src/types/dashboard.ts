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
  clientName: string
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
  isRecurring?: boolean
  services: EventService[]
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
