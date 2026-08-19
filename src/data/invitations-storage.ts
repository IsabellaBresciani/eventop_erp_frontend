import type { GuestConfirmation } from '../types/guest-invitation'
import type { InvitationConfig, InvitationTemplateId } from '../types/invitation'
import type { CalendarEvent } from '../types/dashboard'
import { MOCK_EVENTS } from './event-details'
import { buildDefaultConfig, getTemplate } from './invitation-templates'

export const INVITATION_STORAGE_PREFIX = 'eventop_invitation_'
export const RSVP_STORAGE_PREFIX = 'eventop_rsvps_'

export interface InvitationListItem {
  event: CalendarEvent
  config: InvitationConfig | null
  hasInvitation: boolean
  guestCount: number
  companionCount: number
  templateName: string
  coverUrl: string
}

function mapEventTypeToTemplate(eventType: string): InvitationTemplateId {
  if (eventType.includes('Infantil') || eventType.includes('Cumpleaños')) return 'infantil'
  if (eventType.includes('XV')) return 'xv'
  if (eventType.includes('Corporativo')) return 'corporativo'
  return 'boda'
}

export function loadInvitationConfig(eventId: string): InvitationConfig | null {
  try {
    const stored = localStorage.getItem(`${INVITATION_STORAGE_PREFIX}${eventId}`)
    if (stored) return JSON.parse(stored) as InvitationConfig
  } catch {
    /* ignore */
  }
  return null
}

export function saveInvitationConfig(config: InvitationConfig): void {
  localStorage.setItem(
    `${INVITATION_STORAGE_PREFIX}${config.eventId}`,
    JSON.stringify(config),
  )
}

export function ensureInvitationConfig(
  event: CalendarEvent,
  venue = 'Quinta Los Olivos',
): InvitationConfig {
  const defaults = buildDefaultConfig(
    event.id,
    `${event.clientName} — ${event.eventType}`,
    event.date,
    `${event.startTime} hs`,
    venue,
    mapEventTypeToTemplate(event.eventType),
  )

  const existing = loadInvitationConfig(event.id)
  if (existing) {
    // Merge to backfill any fields added after this config was first saved.
    return { ...defaults, ...existing }
  }

  saveInvitationConfig(defaults)
  return defaults
}

const SEED_RSVPS: Record<string, GuestConfirmation[]> = {
  'evt-001': [
    {
      id: 'g-001-1',
      firstName: 'Lucía',
      lastName: 'Fernández',
      email: 'lucia.f@email.com',
      companions: [{ id: 'c1', firstName: 'Diego', lastName: 'Fernández' }],
      qrCode: 'EVT-LUCIA001',
      confirmedAt: '2026-07-20T18:30:00',
    },
    {
      id: 'g-001-2',
      firstName: 'Martín',
      lastName: 'Pérez',
      email: 'martin.perez@email.com',
      companions: [],
      qrCode: 'EVT-MARTIN01',
      confirmedAt: '2026-07-22T10:15:00',
    },
    {
      id: 'g-001-3',
      firstName: 'Sofía',
      lastName: 'Ruiz',
      email: 'sofia.ruiz@email.com',
      companions: [
        { id: 'c2', firstName: 'Ana', lastName: 'Ruiz' },
        { id: 'c3', firstName: 'Tomás', lastName: 'Ruiz' },
      ],
      qrCode: 'EVT-SOFIA001',
      confirmedAt: '2026-07-25T21:00:00',
    },
  ],
  'evt-002': [
    {
      id: 'g-002-1',
      firstName: 'Carla',
      lastName: 'Gómez',
      email: 'carla.gomez@email.com',
      companions: [
        { id: 'c4', firstName: 'Mateo', lastName: 'Gómez' },
        { id: 'c5', firstName: 'Emma', lastName: 'Gómez' },
      ],
      qrCode: 'EVT-CARLA002',
      confirmedAt: '2026-07-28T14:00:00',
    },
    {
      id: 'g-002-2',
      firstName: 'Julián',
      lastName: 'Sosa',
      email: 'julian.sosa@email.com',
      companions: [],
      qrCode: 'EVT-JULIAN02',
      confirmedAt: '2026-07-29T09:40:00',
    },
  ],
  'evt-004': [
    {
      id: 'g-004-1',
      firstName: 'Valeria',
      lastName: 'Méndez',
      email: 'valeria.m@email.com',
      companions: [{ id: 'c6', firstName: 'Nicolás', lastName: 'Méndez' }],
      qrCode: 'EVT-VALER004',
      confirmedAt: '2026-07-18T16:20:00',
    },
  ],
}

function seedKey(eventId: string) {
  return `${RSVP_STORAGE_PREFIX}${eventId}_seeded`
}

function normalizeGuest(guest: GuestConfirmation, index: number): GuestConfirmation {
  return {
    ...guest,
    id: guest.id || `g-${guest.qrCode || index}-${index}`,
    companions: guest.companions ?? [],
  }
}

export function loadRsvps(eventId: string): GuestConfirmation[] {
  try {
    const stored = localStorage.getItem(`${RSVP_STORAGE_PREFIX}${eventId}`)
    if (stored) {
      const parsed = JSON.parse(stored) as GuestConfirmation[]
      return parsed.map(normalizeGuest)
    }

    const seed = SEED_RSVPS[eventId]
    if (seed && !localStorage.getItem(seedKey(eventId))) {
      localStorage.setItem(`${RSVP_STORAGE_PREFIX}${eventId}`, JSON.stringify(seed))
      localStorage.setItem(seedKey(eventId), '1')
      return seed
    }
  } catch {
    /* ignore */
  }
  return (SEED_RSVPS[eventId] ?? []).map(normalizeGuest)
}

export function saveRsvps(eventId: string, guests: GuestConfirmation[]): void {
  localStorage.setItem(`${RSVP_STORAGE_PREFIX}${eventId}`, JSON.stringify(guests))
}

export function addRsvp(eventId: string, guest: GuestConfirmation): GuestConfirmation[] {
  const withId = normalizeGuest(guest, Date.now())
  const next = [...loadRsvps(eventId), withId]
  saveRsvps(eventId, next)
  return next
}

export function upsertRsvp(eventId: string, guest: GuestConfirmation): GuestConfirmation[] {
  const current = loadRsvps(eventId)
  const exists = current.some((g) => g.id === guest.id)
  const next = exists
    ? current.map((g) => (g.id === guest.id ? guest : g))
    : [...current, guest]
  saveRsvps(eventId, next)
  return next
}

export function deleteRsvp(eventId: string, guestId: string): GuestConfirmation[] {
  const next = loadRsvps(eventId).filter((g) => g.id !== guestId)
  saveRsvps(eventId, next)
  return next
}

export function createEmptyGuest(): GuestConfirmation {
  const id = `g-${Date.now()}`
  return {
    id,
    firstName: '',
    lastName: '',
    email: '',
    companions: [],
    qrCode: `EVT-${id.slice(-6).toUpperCase()}`,
    confirmedAt: new Date().toISOString(),
  }
}

export function getInvitationListItems(events: CalendarEvent[] = MOCK_EVENTS): InvitationListItem[] {
  return [...events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((event) => {
      const config = loadInvitationConfig(event.id)
      const rsvps = loadRsvps(event.id)
      const companionCount = rsvps.reduce((sum, g) => sum + g.companions.length, 0)
      const templateId = config?.templateId ?? mapEventTypeToTemplate(event.eventType)
      const template = getTemplate(templateId)

      return {
        event,
        config,
        hasInvitation: Boolean(config || event.invitationUrl),
        guestCount: rsvps.length,
        companionCount,
        templateName: template.name,
        coverUrl: config?.coverUrl ?? template.defaultCover,
      }
    })
}

export function formatInvitationDate(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`)
  return date.toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatConfirmedAt(iso: string): string {
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
