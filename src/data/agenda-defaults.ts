import type { AgendaSettings } from '../types/agenda-settings'

export const WEEKDAY_LABELS: Record<string, string> = {
  mon: 'Lunes',
  tue: 'Martes',
  wed: 'Miércoles',
  thu: 'Jueves',
  fri: 'Viernes',
  sat: 'Sábado',
  sun: 'Domingo',
}

export const WEEKDAY_SHORT: Record<string, string> = {
  mon: 'Lun',
  tue: 'Mar',
  wed: 'Mié',
  thu: 'Jue',
  fri: 'Vie',
  sat: 'Sáb',
  sun: 'Dom',
}

export const SLOT_OPTIONS = [
  { value: 15, label: '15 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '1 hora' },
  { value: 120, label: '2 horas' },
] as const

export const DEFAULT_AGENDA_SETTINGS: AgendaSettings = {
  slotGranularity: 30,
  openDays: {
    mon: false,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: true,
    sun: true,
  },
  blockHolidays: true,
  bufferHours: 2,
  minAdvanceValue: 48,
  minAdvanceUnit: 'hours',
  maxAdvanceMonths: 12,
  quoteExpiryHours: 48,
  visitCapacity: 'individual',
  visitSlots: [
    { id: 'vs-1', day: 'tue', startTime: '10:00', endTime: '12:00' },
    { id: 'vs-2', day: 'thu', startTime: '16:00', endTime: '18:00' },
    { id: 'vs-3', day: 'sat', startTime: '11:00', endTime: '13:00' },
  ],
  preQualification: {
    eventType: true,
    guests: true,
    budget: false,
  },
  eventTemplates: [
    { id: 'tpl-1', name: 'Cumpleaños Infantil', durationHours: 3 },
    { id: 'tpl-2', name: 'Boda / XV', durationHours: 8 },
    { id: 'tpl-3', name: 'Corporativo', durationHours: 5 },
  ],
  statusColors: [
    { key: 'senado', label: 'Señado', color: '#f59e0b' },
    { key: 'pagado', label: 'Pagado', color: '#10b981' },
    { key: 'suspendido', label: 'Suspendido', color: '#ef4444' },
  ],
  reminderDays: 5,
  exceptions: [{ id: 'exc-1', date: '2026-12-24', label: 'Nochebuena' }],
}

export const AGENDA_TABS = [
  { id: 'availability' as const, label: 'Disponibilidad', description: 'Horarios y slots' },
  { id: 'marketplace' as const, label: 'Marketplace', description: 'Reglas de reserva' },
  { id: 'visits' as const, label: 'Visitas', description: 'RF-004' },
  { id: 'templates' as const, label: 'Plantillas', description: 'Tipos de evento' },
  { id: 'visual' as const, label: 'Visual', description: 'Colores y alertas' },
]
