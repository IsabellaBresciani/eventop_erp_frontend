import { MOCK_EVENTS } from './dashboard'
import { buildDefaultConfig } from './invitation-templates'
import { INVITATION_STORAGE_PREFIX } from './invitations-storage'
import type { InvitationConfig } from '../types/invitation'

export const DEFAULT_VENUE_ADDRESS = 'Av. Libertador 12.450, Vicente López, Buenos Aires'
export const DEFAULT_MAPS_URL = 'https://maps.google.com/?q=Av.+Libertador+12450,+Vicente+López'

export function loadInvitationForGuest(eventId: string): InvitationConfig & {
  address: string
  mapsUrl: string
} {
  try {
    const stored = localStorage.getItem(`${INVITATION_STORAGE_PREFIX}${eventId}`)
    if (stored) {
      const config = JSON.parse(stored) as InvitationConfig
      return { ...config, address: DEFAULT_VENUE_ADDRESS, mapsUrl: DEFAULT_MAPS_URL }
    }
  } catch {}

  const event = MOCK_EVENTS.find((e) => e.id === eventId) ?? MOCK_EVENTS[0]
  const config = buildDefaultConfig(
    event.id,
    `${event.clientName} — ${event.eventType}`,
    event.date,
    `${event.startTime} hs`,
    'Quinta Los Olivos',
  )

  return {
    ...config,
    address: DEFAULT_VENUE_ADDRESS,
    mapsUrl: DEFAULT_MAPS_URL,
  }
}

export function generateQrCode(seed: string): string {
  return `EVT-${seed.slice(-8).toUpperCase()}`
}
