export interface AccountSettings {
  fullName: string
  email: string
  phone: string
  notifyEmailReminders: boolean
  notifySmsReminders: boolean
  notifyMarketing: boolean
}

const STORAGE_KEY = 'eventop_account_settings'

export const DEFAULT_ACCOUNT_SETTINGS: AccountSettings = {
  fullName: 'Jose Luis Perez',
  email: 'jose.perez@eventop.com',
  phone: '+54 9 11 5555-1234',
  notifyEmailReminders: true,
  notifySmsReminders: false,
  notifyMarketing: true,
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return { ...fallback, ...(JSON.parse(raw) as Partial<T>) }
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadAccountSettings(): AccountSettings {
  return readJson(STORAGE_KEY, DEFAULT_ACCOUNT_SETTINGS)
}

export function saveAccountSettings(settings: AccountSettings): void {
  writeJson(STORAGE_KEY, settings)
}
