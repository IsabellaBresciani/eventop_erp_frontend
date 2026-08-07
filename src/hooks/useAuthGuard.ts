import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuthSession } from '../lib/auth-session'
import type { UserRole } from '../types/auth'

interface AuthGuardOptions {
  allowedRoles?: UserRole[]
}

export function useAuthGuard(options?: AuthGuardOptions) {
  const navigate = useNavigate()
  const session = getAuthSession()

  useEffect(() => {
    const current = getAuthSession()
    if (!current) {
      navigate('/login', { replace: true })
      return
    }

    if (options?.allowedRoles && !options.allowedRoles.includes(current.role)) {
      navigate(current.role === 'employee' ? '/dashboard/mis-eventos' : '/dashboard', {
        replace: true,
      })
    }
  }, [navigate, options?.allowedRoles])

  return {
    salon: session?.salon ?? 'Tu Salón',
    session,
    isAdmin: session?.role !== 'employee',
    isEmployee: session?.role === 'employee',
  }
}
