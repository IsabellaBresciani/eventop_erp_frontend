import type { HostSession } from '../types/marketplace-host'

const STORAGE_KEY = 'eventop_host_auth'
const SESSION_CHANGED = 'eventop:host-session-changed'

function notifySessionChanged(): void {
  window.dispatchEvent(new CustomEvent(SESSION_CHANGED))
}

export function getHostSession(): HostSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as HostSession
  } catch {
    return null
  }
}

export function setHostSession(session: HostSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  notifySessionChanged()
}

export function clearHostSession(): void {
  localStorage.removeItem(STORAGE_KEY)
  notifySessionChanged()
}

export function subscribeHostSession(onChange: () => void): () => void {
  const handler = () => onChange()
  window.addEventListener(SESSION_CHANGED, handler)
  return () => window.removeEventListener(SESSION_CHANGED, handler)
}

export function registerHost(email: string, birthDate: string, name: string): HostSession {
  const session: HostSession = {
    id: `host-${Date.now()}`,
    email: email.trim().toLowerCase(),
    birthDate,
    name: name.trim() || email.split('@')[0],
    createdAt: new Date().toISOString(),
  }
  setHostSession(session)
  return session
}

export function loginHost(email: string, birthDate: string): HostSession | null {
  const stored = getHostSession()
  if (
    stored &&
    stored.email === email.trim().toLowerCase() &&
    stored.birthDate === birthDate
  ) {
    return stored
  }

  if (email.trim()) {
    return registerHost(email, birthDate, email.split('@')[0])
  }

  return null
}
