export type HostInquiryStatus = 'pending' | 'answered' | 'closed'
export type HostVisitStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type HostBudgetStatus = 'draft' | 'sent' | 'accepted' | 'rejected'

export interface HostSession {
  id: string
  email: string
  birthDate: string
  name: string
  createdAt: string
}

export interface HostFavorite {
  salonId: string
  addedAt: string
}

export interface HostVisitRequest {
  id: string
  salonId: string
  salonName: string
  date: string
  slot: string
  status: HostVisitStatus
  notes?: string
  createdAt: string
}

export interface HostInquiry {
  id: string
  salonId: string
  salonName: string
  subject: string
  message: string
  status: HostInquiryStatus
  createdAt: string
  updatedAt: string
}

export interface HostBudgetLine {
  serviceId: number
  serviceName: string
  quantity: number
  unitPrice: number
  total: number
}

export interface HostSavedBudget {
  id: string
  salonId: string
  salonName: string
  eventDate: string
  guests: number
  lines: HostBudgetLine[]
  total: number
  status: HostBudgetStatus
  createdAt: string
  updatedAt: string
}

export interface SalonReview {
  id: string
  salonId: string
  hostId: string
  hostName: string
  rating: number
  comment: string
  eventType: string
  createdAt: string
}

export interface MarketplaceVenueListing {
  id: string
  category: 'casamiento' | 'conferencia' | 'fiestas' | 'social'
  rating: number
  reviewCount: number
  priceFrom: number
  priceTo: number
  featured?: boolean
  badge?: string
}

export interface MarketplaceSearchFilters {
  query: string
  location: string
  dateFrom: string
  dateTo: string
  eventType: string
  capacityMin: number
  capacityMax: number
  priceMin: number
  priceMax: number
  services: string[]
  category: string
}

export const DEFAULT_SEARCH_FILTERS: MarketplaceSearchFilters = {
  query: '',
  location: '',
  dateFrom: '',
  dateTo: '',
  eventType: '',
  capacityMin: 20,
  capacityMax: 300,
  priceMin: 0,
  priceMax: 3_000_000,
  services: [],
  category: '',
}
