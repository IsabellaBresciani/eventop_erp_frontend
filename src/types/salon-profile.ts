export type ProfileStep = 'general' | 'location' | 'pricing' | 'photos' | 'services'

export type SalonType = 'quinta' | 'salon' | 'multiespacio' | 'rooftop' | 'jardin' | 'hotel'

export type CancellationPolicy = 'flexible' | 'strict'

export type PhotoTag = 'pista' | 'cocina' | 'exteriores' | 'salon' | 'otro'

export type Currency = 'ARS' | 'USD'

export type VenueServiceCategory =
  'VENUE_SET_UP' | 'ENTERTAINMENT' | 'FOOD_BEVERAGE' | 'DECORATION' | 'STAFFING' | 'MEDIA'

export type VenueServicePricingModel =
  'PER_PERSON' | 'FIXED' | 'PER_UNIT' | 'PER_PACKAGE' | 'PER_MINUTE_TIME'

export type VenueServiceStatus = 'ACTIVE' | 'INACTIVE'

export interface SalonPackage {
  id: string
  name: string
  minPrice: number
  maxPrice: number
  description: string
}

export interface SalonPhoto {
  id: string
  url: string
  name: string
  tag: PhotoTag
  isCover: boolean
}

export interface VenueService {
  id: number
  name: string
  description: string
  termsAndConditions: string
  category: VenueServiceCategory
  pricingModel: VenueServicePricingModel
  basePrice: number
  minQuantity: number
  maxQuantity: number
  status: VenueServiceStatus
}

export interface SalonProfile {
  name: string
  types: SalonType[]
  description: string
  address: string
  neighborhood: string
  lat: number
  lng: number
  capacityMin: number
  capacityMax: number
  currency: Currency
  pricePerHour: number
  packages: SalonPackage[]
  cancellationPolicy: CancellationPolicy
  depositPercent: number
  photos: SalonPhoto[]
  services: VenueService[]
}

export interface FieldErrors {
  [key: string]: string | undefined
}
