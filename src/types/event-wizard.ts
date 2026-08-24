export const WIZARD_STEPS = [
  { id: 'client', label: 'Cliente', hint: 'Email del anfitrión' },
  { id: 'event', label: 'Evento', hint: 'Nombre y tipo' },
  { id: 'schedule', label: 'Fecha y salón', hint: 'Cuándo y dónde' },
  { id: 'services', label: 'Servicios', hint: 'Catálogo y precios' },
  { id: 'staff', label: 'Personal', hint: 'Prestadores' },
  { id: 'payments', label: 'Plan de cobros', hint: 'Seña, saldo y cuotas' },
  { id: 'details', label: 'Detalle', hint: 'Descripción pública' },
  { id: 'confirm', label: 'Confirmar', hint: 'Revisión final' },
] as const

export type WizardStepId = (typeof WIZARD_STEPS)[number]['id']

export interface RegisteredClient {
  email: string
  name: string
  phone: string
}

export interface CatalogService {
  id: string
  name: string
  provider: string
  unitPrice: number
  unitLabel: string
}

export interface VenueSpace {
  id: string
  name: string
  capacity: number
}

export interface SelectedService {
  catalogId: string
  name: string
  provider: string
  unitPrice: number
  quantity: number
}

export interface StaffLine {
  type: string
  quantity: number
}

export interface PaymentConcept {
  id: string
  concept: string
  amount: number
  date: string
}

export type ClientLookup = 'idle' | 'found' | 'invite'

export interface EventWizardDraft {
  clientEmail: string
  clientLookup: ClientLookup
  client: RegisteredClient | null
  inviteName: string
  eventName: string
  eventType: string
  guests: string
  internalNotes: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  venueId: string
  selectedServices: SelectedService[]
  staff: StaffLine[]
  payments: PaymentConcept[]
  publicDescription: string
}
