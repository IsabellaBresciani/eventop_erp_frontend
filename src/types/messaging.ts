export type InquiryStatus = 'nueva' | 'seguimiento' | 'presupuesto_enviado'

export type InquirySource = 'marketplace' | 'whatsapp' | 'email' | 'web'

export interface InquiryMessage {
  id: string
  sender: 'client' | 'salon'
  text: string
  timestamp: string
}

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
  lastMessage: string
  lastActivity: string
  unread: boolean
  messages: InquiryMessage[]
  estimatedBudget?: number
}

export interface QuickReplyTemplate {
  id: string
  label: string
  text: string
}
