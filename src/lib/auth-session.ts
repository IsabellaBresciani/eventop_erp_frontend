import type { AuthSession } from '../types/auth'

const STORAGE_KEY = 'eventop_auth'

export function getAuthSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<AuthSession>
    return {
      email: parsed.email ?? '',
      salon: parsed.salon ?? 'Tu Salón',
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
}

export function clearAuthSession(): void {
  sessionStorage.removeItem(STORAGE_KEY)
}

export function isAdmin(session: AuthSession | null): boolean {
  return session?.role !== 'employee'
}
