export interface GuestCompanion {
  id: string
  firstName: string
  lastName: string
}

export interface GuestConfirmation {
  firstName: string
  lastName: string
  email: string
  companions: GuestCompanion[]
  qrCode: string
  confirmedAt: string
}
