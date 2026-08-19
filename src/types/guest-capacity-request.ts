export type GuestCapacityRequestStatus = 'EN_REVISION' | 'APROBADA' | 'RECHAZADA'

export interface GuestCapacityRequest {
  id: string
  eventId: string
  additionalGuests: number
  requiredApprovalDate: string
  reason: string
  status: GuestCapacityRequestStatus
  createdAt: string
  rejectionReason?: string
  updatedBudgetUrl?: string
}
