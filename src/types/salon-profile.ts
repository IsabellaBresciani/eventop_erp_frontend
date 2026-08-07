export type ProfileStep = 'general' | 'location' | 'pricing' | 'photos' | 'services'

export type SalonType =
  | 'quinta'
  | 'salon'
  | 'multiespacio'
  | 'rooftop'
  | 'jardin'
  | 'hotel'

export type CancellationPolicy = 'flexible' | 'strict'

export type PhotoTag = 'pista' | 'cocina' | 'exteriores' | 'salon' | 'otro'

export type Currency = 'ARS' | 'USD'

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

export interface SalonAmenity {
  id: string
  label: string
  enabled: boolean
  included: boolean
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
  amenities: SalonAmenity[]
}

export interface FieldErrors {
  [key: string]: string | undefined
}
