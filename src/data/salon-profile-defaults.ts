import type { ProfileStep, SalonProfile } from '../types/salon-profile'

export const PROFILE_STEPS: { id: ProfileStep; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'location', label: 'Ubicación' },
  { id: 'pricing', label: 'Capacidad y Precios' },
  { id: 'photos', label: 'Fotos' },
  { id: 'services', label: 'Servicios' },
]

export const SALON_TYPE_OPTIONS = [
  { id: 'quinta' as const, label: 'Quinta' },
  { id: 'salon' as const, label: 'Salón de Fiestas' },
  { id: 'multiespacio' as const, label: 'Multiespacio' },
  { id: 'rooftop' as const, label: 'Roof Top' },
  { id: 'jardin' as const, label: 'Jardín' },
  { id: 'hotel' as const, label: 'Hotel' },
]

export const PHOTO_TAG_OPTIONS = [
  { id: 'pista' as const, label: 'Pista' },
  { id: 'cocina' as const, label: 'Cocina' },
  { id: 'exteriores' as const, label: 'Exteriores' },
  { id: 'salon' as const, label: 'Salón' },
  { id: 'otro' as const, label: 'Otro' },
]

export const DEFAULT_SALON_PROFILE: SalonProfile = {
  name: 'Quinta Los Olivos',
  types: ['quinta', 'jardin'],
  description:
    'Espacio único rodeado de naturaleza, ideal para bodas y eventos corporativos. Capacidad para hasta 150 invitados con jardín, salón techado y estacionamiento propio.',
  address: 'Av. Libertador 12.450, Vicente López',
  neighborhood: 'Vicente López, Zona Norte',
  lat: -34.52,
  lng: -58.48,
  capacityMin: 30,
  capacityMax: 150,
  currency: 'ARS',
  pricePerHour: 85000,
  packages: [
    {
      id: 'pkg-1',
      name: 'Paquete Boda Todo Incluido',
      minPrice: 750000,
      maxPrice: 1200000,
      description: 'Ceremonia, recepción, catering y DJ',
    },
    {
      id: 'pkg-2',
      name: 'Paquete Corporativo Medio Día',
      minPrice: 280000,
      maxPrice: 450000,
      description: 'Sala, coffee break y proyector',
    },
  ],
  cancellationPolicy: 'flexible',
  depositPercent: 30,
  photos: [
    {
      id: 'ph-1',
      url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b8?w=400&h=300&fit=crop',
      name: 'salon-principal.jpg',
      tag: 'salon',
      isCover: true,
    },
    {
      id: 'ph-2',
      url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop',
      name: 'jardin-eventos.jpg',
      tag: 'exteriores',
      isCover: false,
    },
    {
      id: 'ph-3',
      url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=300&fit=crop',
      name: 'pista-baile.jpg',
      tag: 'pista',
      isCover: false,
    },
  ],
  amenities: [
    { id: 'wifi', label: 'Wi-Fi de alta velocidad', enabled: true, included: true },
    { id: 'catering', label: 'Catering propio o externo', enabled: true, included: false },
    { id: 'parking', label: 'Estacionamiento y accesibilidad', enabled: true, included: true },
    { id: 'sound', label: 'Sonido, Iluminación y Grupo Electrógeno', enabled: true, included: true },
  ],
}

export function calculateProfileProgress(profile: SalonProfile): number {
  const checks = [
    profile.name.trim().length >= 3,
    profile.types.length > 0,
    profile.description.trim().length >= 20,
    profile.address.trim().length >= 5,
    profile.neighborhood.trim().length >= 2,
    profile.capacityMin > 0 && profile.capacityMax > profile.capacityMin,
    profile.pricePerHour > 0,
    profile.packages.length > 0,
    profile.photos.length >= 1,
    profile.photos.some((p) => p.isCover),
    profile.amenities.some((a) => a.enabled),
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function formatPrice(amount: number, currency: SalonProfile['currency']): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
