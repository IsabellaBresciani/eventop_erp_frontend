import type { CheckinEvent, EventGuest } from '../types/checkin'

export const DEFAULT_CHECKIN_EVENT: CheckinEvent = {
  id: 'evt-001',
  name: 'Boda Valentina & Martín',
  clientName: 'Valentina García',
  maxCapacity: 120,
  preCheckedInCount: 82,
  guests: [
    {
      id: 'g-01',
      firstName: 'Ana',
      lastName: 'Rodríguez',
      qrCode: 'EVT-A1B2C3D4',
      checkedIn: true,
      plusOnes: 1,
    },
    {
      id: 'g-02',
      firstName: 'Carlos',
      lastName: 'Méndez',
      qrCode: 'EVT-E5F6G7H8',
      checkedIn: true,
      plusOnes: 0,
    },
    {
      id: 'g-03',
      firstName: 'Laura',
      lastName: 'Fernández',
      qrCode: 'EVT-I9J0K1L2',
      checkedIn: true,
      plusOnes: 2,
    },
    {
      id: 'g-04',
      firstName: 'Diego',
      lastName: 'Sánchez',
      qrCode: 'EVT-M3N4O5P6',
      checkedIn: false,
      plusOnes: 0,
    },
    {
      id: 'g-05',
      firstName: 'María',
      lastName: 'López',
      qrCode: 'EVT-Q7R8S9T0',
      checkedIn: false,
      plusOnes: 1,
    },
    {
      id: 'g-06',
      firstName: 'Pablo',
      lastName: 'García',
      qrCode: 'EVT-U1V2W3X4',
      checkedIn: false,
      plusOnes: 0,
    },
    {
      id: 'g-07',
      firstName: 'Sofía',
      lastName: 'Benítez',
      qrCode: 'EVT-Y5Z6A7B8',
      checkedIn: false,
      plusOnes: 0,
    },
    {
      id: 'g-08',
      firstName: 'Juan',
      lastName: 'Torres',
      qrCode: 'EVT-C9D0E1F2',
      checkedIn: false,
      plusOnes: 3,
    },
  ],
}

export function getCheckedInCount(event: CheckinEvent): number {
  const sessionCount = event.guests.reduce((sum, g) => sum + (g.checkedIn ? 1 + g.plusOnes : 0), 0)
  return event.preCheckedInCount + sessionCount
}

export function findGuestByCode(event: CheckinEvent, code: string): EventGuest | undefined {
  const normalized = code.trim().toUpperCase()
  return event.guests.find(
    (g) => g.qrCode.toUpperCase() === normalized || g.id.toUpperCase() === normalized,
  )
}

export function searchGuests(event: CheckinEvent, query: string): EventGuest[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return event.guests.filter(
    (g) =>
      g.firstName.toLowerCase().includes(q) ||
      g.lastName.toLowerCase().includes(q) ||
      `${g.firstName} ${g.lastName}`.toLowerCase().includes(q),
  )
}
