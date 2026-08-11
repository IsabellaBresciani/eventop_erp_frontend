export type UserRole = 'admin' | 'employee'

export interface ManagedSalon {
  id: string
  name: string
  location?: string
  /** Hex for avatar fallback */
  accent?: string
}

export interface AuthSession {
  email: string
  salon: string
  salonId?: string
  salons?: ManagedSalon[]
  role: UserRole
  userId?: string
  name?: string
}
