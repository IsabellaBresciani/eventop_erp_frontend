export interface GuestCompanion {
  id: string
  firstName: string
  lastName: string
}

export interface GuestConfirmation {
  id: string
  firstName: string
  lastName: string
  email: string
  companions: GuestCompanion[]
  qrCode: string
  confirmedAt: string
  group?: string
  ageType?: 'Adulto' | 'Niño'
  menuType?: 'Vegetariano' | 'General' | 'Celíaco' | 'Menú Infantil'
  rsvpStatus?: 'Pendiente' | 'Confirmado'
}
