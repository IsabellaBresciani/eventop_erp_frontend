export type ReportId =
  'events-by-month' | 'status-funnel' | 'top-services' | 'sales-patterns' | 'pending-payments'

export interface ReportCardMeta {
  id: ReportId
  title: string
  description: string
  accent: string
}

export const REPORT_CARDS: ReportCardMeta[] = [
  {
    id: 'events-by-month',
    title: 'Eventos por mes',
    description: 'Cantidad y facturación mes a mes, comparativa año vs año.',
    accent: '#6A24E3',
  },
  {
    id: 'status-funnel',
    title: 'Embudo de estados',
    description: 'Conversión Presupuestado → Reservado → Señado → Pagado.',
    accent: '#8b5cf6',
  },
  {
    id: 'top-services',
    title: 'Servicios más vendidos',
    description: 'Ranking por cantidad y por facturación.',
    accent: '#10b981',
  },
  {
    id: 'sales-patterns',
    title: 'Patrones de venta',
    description: 'Cuándo se vende más: año, mes, día de semana y horario.',
    accent: '#F5C518',
  },
  {
    id: 'pending-payments',
    title: 'Cobros pendientes',
    description: 'Cuotas vencidas y por vencer.',
    accent: '#ef4444',
  },
]

export interface MonthYearPoint {
  month: string
  monthKey: string
  eventsCurrent: number
  eventsPrevious: number
  billingCurrent: number
  billingPrevious: number
}

export const EVENTS_BY_MONTH: MonthYearPoint[] = [
  {
    month: 'Ene',
    monthKey: '01',
    eventsCurrent: 4,
    eventsPrevious: 3,
    billingCurrent: 980000,
    billingPrevious: 720000,
  },
  {
    month: 'Feb',
    monthKey: '02',
    eventsCurrent: 5,
    eventsPrevious: 4,
    billingCurrent: 1120000,
    billingPrevious: 890000,
  },
  {
    month: 'Mar',
    monthKey: '03',
    eventsCurrent: 7,
    eventsPrevious: 5,
    billingCurrent: 1580000,
    billingPrevious: 1100000,
  },
  {
    month: 'Abr',
    monthKey: '04',
    eventsCurrent: 6,
    eventsPrevious: 6,
    billingCurrent: 1340000,
    billingPrevious: 1280000,
  },
  {
    month: 'May',
    monthKey: '05',
    eventsCurrent: 8,
    eventsPrevious: 6,
    billingCurrent: 1760000,
    billingPrevious: 1310000,
  },
  {
    month: 'Jun',
    monthKey: '06',
    eventsCurrent: 9,
    eventsPrevious: 7,
    billingCurrent: 1980000,
    billingPrevious: 1490000,
  },
  {
    month: 'Jul',
    monthKey: '07',
    eventsCurrent: 11,
    eventsPrevious: 8,
    billingCurrent: 2450000,
    billingPrevious: 1720000,
  },
  {
    month: 'Ago',
    monthKey: '08',
    eventsCurrent: 10,
    eventsPrevious: 9,
    billingCurrent: 2280000,
    billingPrevious: 1950000,
  },
  {
    month: 'Sep',
    monthKey: '09',
    eventsCurrent: 8,
    eventsPrevious: 7,
    billingCurrent: 1870000,
    billingPrevious: 1600000,
  },
  {
    month: 'Oct',
    monthKey: '10',
    eventsCurrent: 12,
    eventsPrevious: 9,
    billingCurrent: 2680000,
    billingPrevious: 2010000,
  },
  {
    month: 'Nov',
    monthKey: '11',
    eventsCurrent: 14,
    eventsPrevious: 11,
    billingCurrent: 3120000,
    billingPrevious: 2450000,
  },
  {
    month: 'Dic',
    monthKey: '12',
    eventsCurrent: 16,
    eventsPrevious: 13,
    billingCurrent: 3650000,
    billingPrevious: 2890000,
  },
]

export interface FunnelStep {
  status: string
  count: number
  conversionFromPrevious: number | null
  color: string
}

export const STATUS_FUNNEL: FunnelStep[] = [
  { status: 'Presupuestado', count: 120, conversionFromPrevious: null, color: '#6A24E3' },
  { status: 'Reservado', count: 78, conversionFromPrevious: 65, color: '#8b5cf6' },
  { status: 'Señado', count: 61, conversionFromPrevious: 78, color: '#F5C518' },
  { status: 'Pagado', count: 48, conversionFromPrevious: 79, color: '#10b981' },
]

export interface ServiceRanking {
  name: string
  quantity: number
  billing: number
}

export const TOP_SERVICES_BY_QTY: ServiceRanking[] = [
  { name: 'Catering completo', quantity: 42, billing: 3780000 },
  { name: 'DJ + sonido', quantity: 38, billing: 2280000 },
  { name: 'Decoración floral', quantity: 29, billing: 1450000 },
  { name: 'Barra libre', quantity: 24, billing: 1920000 },
  { name: 'Fotografía', quantity: 21, billing: 1260000 },
]

export const TOP_SERVICES_BY_BILLING: ServiceRanking[] = [
  { name: 'Catering completo', quantity: 42, billing: 3780000 },
  { name: 'DJ + sonido', quantity: 38, billing: 2280000 },
  { name: 'Barra libre', quantity: 24, billing: 1920000 },
  { name: 'Decoración floral', quantity: 29, billing: 1450000 },
  { name: 'Fotografía', quantity: 21, billing: 1260000 },
]

export interface PatternBucket {
  label: string
  value: number
  share: number
}

export const SALES_PATTERNS = {
  byYear: [
    { label: '2024', value: 86, share: 38 },
    { label: '2025', value: 104, share: 46 },
    { label: '2026 YTD', value: 37, share: 16 },
  ] as PatternBucket[],
  byMonth: [
    { label: 'Nov', value: 14, share: 18 },
    { label: 'Dic', value: 16, share: 20 },
    { label: 'Oct', value: 12, share: 15 },
    { label: 'Jul', value: 11, share: 14 },
    { label: 'Ago', value: 10, share: 13 },
  ] as PatternBucket[],
  byWeekday: [
    { label: 'Sáb', value: 34, share: 28 },
    { label: 'Vie', value: 26, share: 22 },
    { label: 'Dom', value: 18, share: 15 },
    { label: 'Jue', value: 14, share: 12 },
    { label: 'Mié', value: 12, share: 10 },
  ] as PatternBucket[],
  byHour: [
    { label: '10–12', value: 22, share: 18 },
    { label: '12–14', value: 28, share: 23 },
    { label: '16–18', value: 31, share: 26 },
    { label: '18–20', value: 24, share: 20 },
    { label: '20–22', value: 15, share: 13 },
  ] as PatternBucket[],
}

export interface PendingPayment {
  id: string
  clientName: string
  eventType: string
  eventDate: string
  installment: string
  amount: number
  dueDate: string
  status: 'vencida' | 'por_vencer'
  daysOffset: number
}

export const PENDING_PAYMENTS: PendingPayment[] = [
  {
    id: 'pp-1',
    clientName: 'Martín López',
    eventType: 'Cumpleaños Infantil',
    eventDate: '2026-08-08',
    installment: 'Saldo final',
    amount: 224000,
    dueDate: '2026-08-01',
    status: 'vencida',
    daysOffset: -9,
  },
  {
    id: 'pp-2',
    clientName: 'Camila Ríos',
    eventType: 'XV Años',
    eventDate: '2026-08-15',
    installment: 'Cuota 2/3',
    amount: 180000,
    dueDate: '2026-08-05',
    status: 'vencida',
    daysOffset: -5,
  },
  {
    id: 'pp-3',
    clientName: 'Estudio Creativo Luna',
    eventType: 'Corporativo',
    eventDate: '2026-08-08',
    installment: 'Seña 30%',
    amount: 54000,
    dueDate: '2026-08-12',
    status: 'por_vencer',
    daysOffset: 2,
  },
  {
    id: 'pp-4',
    clientName: 'Roberto Díaz',
    eventType: 'Boda',
    eventDate: '2026-09-12',
    installment: 'Cuota 1/2',
    amount: 320000,
    dueDate: '2026-08-18',
    status: 'por_vencer',
    daysOffset: 8,
  },
  {
    id: 'pp-5',
    clientName: 'Ana Torres',
    eventType: 'Cumpleaños',
    eventDate: '2026-08-22',
    installment: 'Saldo',
    amount: 95000,
    dueDate: '2026-08-20',
    status: 'por_vencer',
    daysOffset: 10,
  },
]

export function reportSummary(id: ReportId): string {
  switch (id) {
    case 'events-by-month':
      return '+18% facturación vs 2025'
    case 'status-funnel':
      return '40% cierra en Pagado'
    case 'top-services':
      return 'Catering lidera en $ y qty'
    case 'sales-patterns':
      return 'Pico: sábados 16–18 hs'
    case 'pending-payments':
      return `${PENDING_PAYMENTS.filter((p) => p.status === 'vencida').length} vencidas · ${PENDING_PAYMENTS.filter((p) => p.status === 'por_vencer').length} por vencer`
  }
}
