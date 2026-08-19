import type { GuestCapacityRequest } from '../types/guest-capacity-request'

const STORAGE_PREFIX = 'eventop_capacity_requests_'
const SEED_FLAG_SUFFIX = '_seeded'

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

function storageKey(eventId: string) {
  return `${STORAGE_PREFIX}${eventId}`
}

function buildSeed(eventId: string): GuestCapacityRequest[] {
  return [
    {
      id: 'REQ-001',
      eventId,
      additionalGuests: 10,
      requiredApprovalDate: '2026-08-01',
      reason: 'Confirmaciones tardías de familiares directos.',
      status: 'APROBADA',
      createdAt: '2026-07-15T10:00:00',
      updatedBudgetUrl: '#',
    },
    {
      id: 'REQ-002',
      eventId,
      additionalGuests: 15,
      requiredApprovalDate: '2026-08-20',
      reason: 'Invitados adicionales por parte del novio, sumados a último momento.',
      status: 'EN_REVISION',
      createdAt: '2026-08-05T09:30:00',
    },
    {
      id: 'REQ-003',
      eventId,
      additionalGuests: 30,
      requiredApprovalDate: '2026-07-25',
      reason: 'Ampliación de lista corporativa.',
      status: 'RECHAZADA',
      createdAt: '2026-07-10T15:45:00',
      rejectionReason: 'El salón no cuenta con capacidad de catering disponible para esa fecha.',
    },
  ]
}

export function loadCapacityRequests(eventId: string): GuestCapacityRequest[] {
  const seededKey = `${storageKey(eventId)}${SEED_FLAG_SUFFIX}`
  const existing = readJson<GuestCapacityRequest[] | null>(storageKey(eventId), null)
  if (existing) return existing

  if (!localStorage.getItem(seededKey)) {
    const seed = buildSeed(eventId)
    writeJson(storageKey(eventId), seed)
    localStorage.setItem(seededKey, '1')
    return seed
  }

  return []
}

export function saveCapacityRequests(eventId: string, requests: GuestCapacityRequest[]): void {
  writeJson(storageKey(eventId), requests)
}

export function createCapacityRequest(
  eventId: string,
  input: { additionalGuests: number; requiredApprovalDate: string; reason: string },
): GuestCapacityRequest[] {
  const current = loadCapacityRequests(eventId)
  const nextNumber = current.length + 1
  const newRequest: GuestCapacityRequest = {
    id: `REQ-${String(nextNumber).padStart(3, '0')}`,
    eventId,
    additionalGuests: input.additionalGuests,
    requiredApprovalDate: input.requiredApprovalDate,
    reason: input.reason,
    status: 'EN_REVISION',
    createdAt: new Date().toISOString(),
  }
  const next = [newRequest, ...current]
  saveCapacityRequests(eventId, next)
  return next
}
