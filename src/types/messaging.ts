export type InquiryStatus = 'nueva' | 'leida' | 'en_seguimiento' | 'respondida' | 'archivada'

export type InquirySource = 'marketplace' | 'whatsapp' | 'email' | 'web'

export interface Inquiry {
  id: string
  clientName: string
  email: string
  phone: string
  eventType: string
  eventDate: string
  guests: number
  status: InquiryStatus
  source: InquirySource
  /** Preview text for the inbox list */
  preview: string
  /** Full consultation message from the client */
  message: string
  receivedAt: string
  lastActivity: string
  estimatedBudget?: number
}

export const INQUIRY_SOURCE_LABELS: Record<InquirySource, string> = {
  marketplace: 'Marketplace',
  whatsapp: 'WhatsApp',
  email: 'Email',
  web: 'Web',
}
