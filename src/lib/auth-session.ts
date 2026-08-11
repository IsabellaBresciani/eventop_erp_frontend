import type { AuthSession, ManagedSalon } from '../types/auth'

const STORAGE_KEY = 'eventop_auth'
const SESSION_CHANGED = 'eventop:auth-session-changed'

function notifySessionChanged(): void {
  window.dispatchEvent(new CustomEvent(SESSION_CHANGED))
}

export function getAuthSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<AuthSession>
    return {
      email: parsed.email ?? '',
      salon: parsed.salon ?? 'Tu Salón',
      salonId: parsed.salonId,
      salons: parsed.salons,
      role: parsed.role ?? 'admin',
      userId: parsed.userId,
      name: parsed.name,
    }
  } catch {
    return null
  }
}

export function setAuthSession(session: AuthSession): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  notifySessionChanged()
}

export function clearAuthSession(): void {
  sessionStorage.removeItem(STORAGE_KEY)
  notifySessionChanged()
}

export function isAdmin(session: AuthSession | null): boolean {
  return session?.role !== 'employee'
}

export function getActiveSalon(session: AuthSession | null): ManagedSalon | null {
  if (!session) return null

  if (session.salonId && session.salons?.length) {
    const match = session.salons.find((item) => item.id === session.salonId)
    if (match) return match
  }

  return {
    id: session.salonId ?? 'default',
    name: session.salon,
  }
}

export function switchActiveSalon(salonId: string): AuthSession | null {
  const session = getAuthSession()
  if (!session?.salons?.length) return session

  const nextSalon = session.salons.find((item) => item.id === salonId)
  if (!nextSalon) return session

  const updated: AuthSession = {
    ...session,
    salonId: nextSalon.id,
    salon: nextSalon.name,
  }

  setAuthSession(updated)
  return updated
}

export function subscribeAuthSession(onChange: () => void): () => void {
  const handler = () => onChange()
  window.addEventListener(SESSION_CHANGED, handler)
  return () => window.removeEventListener(SESSION_CHANGED, handler)
}
