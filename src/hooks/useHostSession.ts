import { useEffect, useState } from 'react'
import {
  getHostSession,
  subscribeHostSession,
} from '../lib/host-session'
import type { HostSession } from '../types/marketplace-host'

export function useHostSession() {
  const [session, setSession] = useState<HostSession | null>(() => getHostSession())

  useEffect(() => {
    return subscribeHostSession(() => setSession(getHostSession()))
  }, [])

  return { session, isAuthenticated: Boolean(session) }
}
