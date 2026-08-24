import { MOCK_EVENTS } from './event-details'
import { loadEvents } from './events-storage'
import { DEFAULT_SALON_PROFILE, DEFAULT_VENUE_SERVICES } from './salon-profile-defaults'
import type {
  CalendarEvent,
  EventService,
  PaymentRecord,
} from '../types/dashboard'
import type {
  CatalogService,
  ClientLookup,
  EventWizardDraft,
  PaymentConcept,
  RegisteredClient,
  SelectedService,
  VenueSpace,
  WizardStepId,
} from '../types/event-wizard'
import type { SalonProfile } from '../types/salon-profile'

const PROFILE_KEY = 'eventop_salon_profile'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const EVENT_TYPE_OPTIONS = [
  'Baby Shower',
  'Bautismo',
  'Comunión',
  'Cumpleaños',
  'Egresaditos',
  'Evento escolar',
  'Boda',
  'XV Años',
  'Corporativo',
  'Otro',
]

export const DEFAULT_STAFF_TYPES = ['Animador', 'Panchero', 'Seguridad', 'Mozo', 'DJ']

export const VENUE_SPACES: VenueSpace[] = [
  { id: 'salon-principal', name: 'Salón principal', capacity: 150 },
  { id: 'jardin', name: 'Jardín', capacity: 120 },
  { id: 'terraza', name: 'Terraza', capacity: 80 },
  { id: 'quincho', name: 'Quincho', capacity: 60 },
]

const EXTRA_SERVICES: CatalogService[] = [
  {
    id: 'extra-animacion',
    name: 'Animación infantil',
    provider: 'Playtime Eventos',
    unitPrice: 85000,
    unitLabel: 'fijo',
  },
  {
    id: 'extra-panchos',
    name: 'Panchos',
    provider: 'El Panchero',
    unitPrice: 1800,
    unitLabel: 'por unidad',
  },
  {
    id: 'extra-seguridad',
    name: 'Seguridad',
    provider: 'SecureEvent',
    unitPrice: 32000,
    unitLabel: 'por persona',
  },
  {
    id: 'extra-candy',
    name: 'Candy bar',
    provider: 'Dulce Mesa',
    unitPrice: 38000,
    unitLabel: 'fijo',
  },
  {
    id: 'extra-foto',
    name: 'Fotografía',
    provider: 'Estudio Norte',
    unitPrice: 95000,
    unitLabel: 'fijo',
  },
]

const EXTRA_CLIENTS: RegisteredClient[] = [
  { email: 'carla.mendez@email.com', name: 'Carla Méndez', phone: '+54 11 5555-1020' },
  { email: 'juan.perez@email.com', name: 'Juan Pérez', phone: '+54 11 4444-7788' },
]

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim())
}

export function createWizardDraft(defaultDate?: string | null): EventWizardDraft {
  return {
    clientEmail: '',
    clientLookup: 'idle',
    client: null,
    inviteName: '',
    eventName: '',
    eventType: '',
    guests: '',
    internalNotes: '',
    startDate: defaultDate ?? '',
    endDate: '',
    startTime: '20:00',
    endTime: '04:00',
    venueId: '',
    selectedServices: [],
    staff: DEFAULT_STAFF_TYPES.map((type) => ({ type, quantity: 0 })),
    payments: [],
    publicDescription: '',
  }
}

export function loadSalonProfileForWizard(): SalonProfile {
  try {
    const stored = localStorage.getItem(PROFILE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<SalonProfile>
      return {
        ...DEFAULT_SALON_PROFILE,
        ...parsed,
        services: Array.isArray(parsed.services)
          ? parsed.services
          : DEFAULT_SALON_PROFILE.services,
      }
    }
  } catch {
    /* defaults */
  }
  return DEFAULT_SALON_PROFILE
}

export function getServiceCatalog(profile = loadSalonProfileForWizard()): CatalogService[] {
  const fromProfile = (profile.services.length ? profile.services : DEFAULT_VENUE_SERVICES)
    .filter((service) => service.status === 'ACTIVE')
    .map((service) => ({
      id: `profile-${service.id}`,
      name: service.name,
      provider: profile.name || 'El salón',
      unitPrice: service.basePrice,
      unitLabel:
        service.pricingModel === 'PER_PERSON'
          ? 'por persona'
          : service.pricingModel === 'PER_UNIT'
            ? 'por unidad'
            : 'fijo',
    }))

  const names = new Set(fromProfile.map((item) => item.name.toLowerCase()))
  const extras = EXTRA_SERVICES.filter((item) => !names.has(item.name.toLowerCase()))
  return [...fromProfile, ...extras]
}

export function getRegisteredClients(events: CalendarEvent[] = loadEvents()): RegisteredClient[] {
  const fromEvents = events
    .filter((event) => event.email.trim())
    .map((event) => ({
      email: event.email.trim().toLowerCase(),
      name: event.clientName,
      phone: event.phone,
    }))

  const byEmail = new Map<string, RegisteredClient>()
  ;[...fromEvents, ...EXTRA_CLIENTS].forEach((client) => {
    const key = client.email.toLowerCase()
    if (!byEmail.has(key)) byEmail.set(key, { ...client, email: key })
  })

  MOCK_EVENTS.forEach((event) => {
    const email = event.email.trim().toLowerCase()
    if (email && !byEmail.has(email)) {
      byEmail.set(email, { email, name: event.clientName, phone: event.phone })
    }
  })

  return [...byEmail.values()]
}

export function lookupClient(
  email: string,
  clients = getRegisteredClients(),
): { status: Exclude<ClientLookup, 'idle'>; client: RegisteredClient | null } {
  const normalized = email.trim().toLowerCase()
  const match = clients.find((client) => client.email === normalized)
  if (match) return { status: 'found', client: match }
  return { status: 'invite', client: null }
}

export function servicesTotal(services: SelectedService[]): number {
  return services.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
}

export function paymentsTotal(payments: PaymentConcept[]): number {
  return payments.reduce((sum, line) => sum + (Number.isFinite(line.amount) ? line.amount : 0), 0)
}

export function suggestedPayments(total: number, startDate: string): PaymentConcept[] {
  const deposit = Math.round(total * 0.3)
  const balance = Math.max(total - deposit, 0)
  const depositDate = startDate || todayISO()
  return [
    { id: `pay-${Date.now()}-1`, concept: 'Seña', amount: deposit, date: depositDate },
    { id: `pay-${Date.now()}-2`, concept: 'Saldo', amount: balance, date: startDate || depositDate },
  ]
}

export function todayISO(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function getVenueName(venueId: string): string {
  return VENUE_SPACES.find((space) => space.id === venueId)?.name ?? ''
}

export function getClientDisplayName(draft: EventWizardDraft): string {
  if (draft.clientLookup === 'found' && draft.client) return draft.client.name
  if (draft.inviteName.trim()) return draft.inviteName.trim()
  const local = draft.clientEmail.split('@')[0]?.replace(/[._-]/g, ' ').trim()
  return local ? capitalize(local) : ''
}

function capitalize(value: string): string {
  return value.replace(/\b\w/g, (char) => char.toUpperCase())
}

export function stepErrors(step: WizardStepId, draft: EventWizardDraft): Record<string, string> {
  const errors: Record<string, string> = {}

  if (step === 'client') {
    if (!isValidEmail(draft.clientEmail)) errors.clientEmail = 'Ingresá un email válido'
    else if (draft.clientLookup === 'idle') errors.clientEmail = 'Buscá el email para continuar'
  }

  if (step === 'event') {
    if (!draft.eventName.trim()) errors.eventName = 'Ingresá el nombre del evento'
    if (!draft.eventType) errors.eventType = 'Seleccioná el tipo de evento'
    if (draft.guests && (Number(draft.guests) < 1 || !Number.isFinite(Number(draft.guests)))) {
      errors.guests = 'Ingresá una cantidad válida'
    }
  }

  if (step === 'schedule') {
    if (!draft.startDate) errors.startDate = 'Seleccioná la fecha de inicio'
    if (draft.endDate && draft.startDate && draft.endDate < draft.startDate) {
      errors.endDate = 'La fecha de fin no puede ser anterior al inicio'
    }
    if (!draft.startTime) errors.startTime = 'Ingresá el horario de inicio'
    if (!draft.endTime) errors.endTime = 'Ingresá el horario de fin'
    if (!draft.venueId) errors.venueId = 'Seleccioná un salón o espacio'
  }

  if (step === 'payments') {
    if (draft.payments.length === 0) errors.payments = 'Agregá al menos un concepto de cobro'
    else if (draft.payments.some((item) => !item.concept.trim() || !item.date || item.amount < 0)) {
      errors.payments = 'Completá concepto, monto y fecha en cada cobro'
    }
  }

  return errors
}

export function isStepValid(step: WizardStepId, draft: EventWizardDraft): boolean {
  if (step === 'services' || step === 'staff' || step === 'details' || step === 'confirm') {
    return true
  }
  return Object.keys(stepErrors(step, draft)).length === 0
}

export function canOpenStep(targetIndex: number, draft: EventWizardDraft): boolean {
  const steps: WizardStepId[] = [
    'client',
    'event',
    'schedule',
    'services',
    'staff',
    'payments',
    'details',
    'confirm',
  ]
  for (let i = 0; i < targetIndex; i += 1) {
    if (!isStepValid(steps[i], draft)) return false
  }
  return true
}

export function buildCalendarEventFromWizard(draft: EventWizardDraft): CalendarEvent {
  const guests = draft.guests ? Number(draft.guests) : 0
  const total = servicesTotal(draft.selectedServices)
  const clientName = getClientDisplayName(draft) || draft.clientEmail
  const phone = draft.client?.phone ?? ''
  const email = draft.clientEmail.trim().toLowerCase()
  const slug = clientName.toLowerCase().replace(/\s+/g, '-').slice(0, 24)
  const id = `evt-${Date.now()}`

  const services: EventService[] = draft.selectedServices.map((line) => ({
    name: line.name,
    status: 'pendiente',
    unitPrice: line.unitPrice,
    quantity: line.quantity,
    provider: line.provider,
  }))

  const payments: PaymentRecord[] = draft.payments
    .filter((item) => item.amount > 0)
    .map((item, index) => ({
      id: item.id || `pay-${id}-${index}`,
      date: item.date,
      amount: item.amount,
      method: 'Pendiente',
      note: item.concept,
    }))

  return {
    id,
    date: draft.startDate,
    endDate: draft.endDate || undefined,
    clientName,
    eventName: draft.eventName.trim(),
    eventType: draft.eventType,
    status: 'presupuestado',
    startTime: draft.startTime,
    endTime: draft.endTime,
    bufferHours: 2,
    totalAmount: total,
    depositPaid: 0,
    guests,
    confirmedGuests: 0,
    maxCapacity: Math.max(guests + 20, 50),
    phone,
    email,
    venueSpace: getVenueName(draft.venueId),
    internalNotes: draft.internalNotes.trim() || undefined,
    publicDescription: draft.publicDescription.trim() || undefined,
    clientInvitePending: draft.clientLookup === 'invite',
    services,
    staffAssignments: draft.staff.filter((line) => line.quantity > 0),
    payments,
    auditLog: [
      {
        id: `al-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: 'Sistema',
        action: 'Evento creado',
        detail: 'Nuevo evento desde el asistente',
      },
    ],
    invitationUrl: `https://eventop.com/inv/${slug}`,
    assignedEmployeeIds: [],
  }
}
