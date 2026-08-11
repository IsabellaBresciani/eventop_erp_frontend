import { useCallback, useEffect, useState } from 'react'
import {
  getActiveSalon,
  getAuthSession,
  subscribeAuthSession,
  switchActiveSalon,
} from '../lib/auth-session'
import type { AuthSession, ManagedSalon } from '../types/auth'

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(() => getAuthSession())

  useEffect(() => subscribeAuthSession(() => setSession(getAuthSession())), [])

  const switchSalon = useCallback((salonId: string) => {
    switchActiveSalon(salonId)
  }, [])

  const activeSalon = getActiveSalon(session)
  const salons: ManagedSalon[] = session?.salons ?? (activeSalon ? [activeSalon] : [])

  return {
    session,
    activeSalon,
    salons,
    switchSalon,
    salonName: session?.salon ?? 'Tu Salón',
  }
}
