export type UserRole = 'admin' | 'employee'

export interface AuthSession {
  email: string
  salon: string
  role: UserRole
  userId?: string
  name?: string
}
