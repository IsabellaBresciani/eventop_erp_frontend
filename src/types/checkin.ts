export type ScanResultType = 'welcome' | 'duplicate' | 'not_found'

export interface EventGuest {
  id: string
  firstName: string
  lastName: string
  qrCode: string
  checkedIn: boolean
  checkedInAt?: string
  plusOnes: number
}

export interface CheckinEvent {
  id: string
  name: string
  clientName: string
  maxCapacity: number
  preCheckedInCount: number
  guests: EventGuest[]
}

export interface ScanResult {
  type: ScanResultType
  guest?: EventGuest
  message: string
}
