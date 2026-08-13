import type { AgendaSettings } from '../types/agenda-settings'
import type { SalonProfile } from '../types/salon-profile'
import { DEFAULT_AGENDA_SETTINGS } from './agenda-defaults'
import { DEFAULT_SALON_PROFILE, formatPrice } from './salon-profile-defaults'

const PROFILE_KEY = 'eventop_salon_profile'
const AGENDA_KEY = 'eventop_agenda_settings'

export function loadMarketplaceProfile(): SalonProfile {
  try {
    const stored = localStorage.getItem(PROFILE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<SalonProfile> & { amenities?: unknown }
      const { amenities: _legacy, ...rest } = parsed
      return {
        ...DEFAULT_SALON_PROFILE,
        ...rest,
        services: Array.isArray(rest.services) ? rest.services : DEFAULT_SALON_PROFILE.services,
      }
    }
  } catch {}
  return DEFAULT_SALON_PROFILE
}

export function loadMarketplaceAgenda(): AgendaSettings {
  try {
    const stored = localStorage.getItem(AGENDA_KEY)
    if (stored) return { ...DEFAULT_AGENDA_SETTINGS, ...JSON.parse(stored) }
  } catch {}
  return DEFAULT_AGENDA_SETTINGS
}

export interface BudgetEstimate {
  available: boolean
  message?: string
  hours: number
  baseAmount: number
  totalAmount: number
  depositAmount: number
  formattedTotal: string
  formattedDeposit: string
}

export function calculateBudgetEstimate(
  profile: SalonProfile,
  agenda: AgendaSettings,
  guests: number,
  dateStr: string,
): BudgetEstimate {
  const currency = profile.currency
  const fmt = (n: number) => formatPrice(n, currency)

  if (!dateStr) {
    return {
      available: false,
      message: 'Seleccioná una fecha',
      hours: 0,
      baseAmount: 0,
      totalAmount: 0,
      depositAmount: 0,
      formattedTotal: fmt(0),
      formattedDeposit: fmt(0),
    }
  }

  if (guests < profile.capacityMin || guests > profile.capacityMax) {
    return {
      available: false,
      message: `Capacidad: ${profile.capacityMin}–${profile.capacityMax} invitados`,
      hours: 0,
      baseAmount: 0,
      totalAmount: 0,
      depositAmount: 0,
      formattedTotal: fmt(0),
      formattedDeposit: fmt(0),
    }
  }

  const date = new Date(`${dateStr}T12:00:00`)
  const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
  const dayKey = dayKeys[date.getDay()]

  if (!agenda.openDays[dayKey]) {
    return {
      available: false,
      message: 'El salón no atiende ese día',
      hours: 0,
      baseAmount: 0,
      totalAmount: 0,
      depositAmount: 0,
      formattedTotal: fmt(0),
      formattedDeposit: fmt(0),
    }
  }

  const hours = guests > 100 ? 8 : guests > 60 ? 6 : guests > 30 ? 5 : 4
  let total = profile.pricePerHour * hours

  if (date.getDay() === 0 || date.getDay() === 6) {
    total *= 1.15
  }

  const depositAmount = Math.round(total * (profile.depositPercent / 100))

  return {
    available: true,
    hours,
    baseAmount: profile.pricePerHour * hours,
    totalAmount: Math.round(total),
    depositAmount,
    formattedTotal: fmt(Math.round(total)),
    formattedDeposit: fmt(depositAmount),
  }
}

export function getVisitSlotsForDate(agenda: AgendaSettings, dateStr: string) {
  if (!dateStr) return []
  const date = new Date(`${dateStr}T12:00:00`)
  const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
  const dayKey = dayKeys[date.getDay()]
  return agenda.visitSlots.filter((s) => s.day === dayKey)
}
