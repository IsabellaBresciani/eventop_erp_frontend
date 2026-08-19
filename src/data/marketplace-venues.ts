import type { SalonProfile } from '../types/salon-profile'
import type {
  HostBudgetLine,
  HostInquiry,
  HostSavedBudget,
  HostVisitRequest,
  MarketplaceSearchFilters,
  MarketplaceVenueListing,
  SalonReview,
} from '../types/marketplace-host'
import { DEFAULT_SALON_PROFILE, DEFAULT_VENUE_SERVICES } from './salon-profile-defaults'

const FAVORITES_KEY = 'eventop_host_favorites'
const VISITS_KEY = 'eventop_host_visits'
const INQUIRIES_KEY = 'eventop_host_inquiries'
const BUDGETS_KEY = 'eventop_host_budgets'
const REVIEWS_KEY = 'eventop_salon_reviews'

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

function computePriceRange(profile: SalonProfile): { from: number; to: number } {
  const packagePrices = profile.packages.flatMap((p) => [p.minPrice, p.maxPrice])
  const servicePrices = (profile.services ?? [])
    .filter((s) => s.status === 'ACTIVE' && s.basePrice > 0)
    .map((s) => s.basePrice)

  const hourlyEstimate = profile.pricePerHour * 6
  const values = [...packagePrices, ...servicePrices, hourlyEstimate].filter((v) => v > 0)

  if (values.length === 0) {
    return { from: profile.pricePerHour * 4, to: profile.pricePerHour * 8 }
  }

  return {
    from: Math.min(...values),
    to: Math.max(...values),
  }
}

const VENUE_PROFILES: Record<string, SalonProfile> = {
  'salon-olivos': DEFAULT_SALON_PROFILE,
  'salon-calle13': {
    ...DEFAULT_SALON_PROFILE,
    name: 'Calle 13',
    types: ['salon', 'multiespacio'],
    description:
      'Salón moderno en el corazón de La Plata. Ambiente cálido con catering incluido, zona de juegos y staff profesional para eventos sociales y corporativos.',
    address: 'Calle 13 810, La Plata',
    neighborhood: 'Tolosa, La Plata',
    lat: -34.9214,
    lng: -57.9544,
    capacityMin: 15,
    capacityMax: 120,
    pricePerHour: 85000,
    photos: [
      {
        id: 'c13-1',
        url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b8?w=800&h=600&fit=crop',
        name: 'salon.jpg',
        tag: 'salon',
        isCover: true,
      },
      {
        id: 'c13-2',
        url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=400&fit=crop',
        name: 'decoracion.jpg',
        tag: 'salon',
        isCover: false,
      },
      {
        id: 'c13-3',
        url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=400&fit=crop',
        name: 'mesas.jpg',
        tag: 'salon',
        isCover: false,
      },
      {
        id: 'c13-4',
        url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=400&fit=crop',
        name: 'evento.jpg',
        tag: 'salon',
        isCover: false,
      },
    ],
    services: DEFAULT_VENUE_SERVICES,
  },
  'salon-jota': {
    ...DEFAULT_SALON_PROFILE,
    name: 'Jota eventos',
    types: ['salon'],
    description:
      'Espacio versátil para eventos sociales con pista de baile, iluminación LED y estacionamiento. Ideal para cumpleaños, casamientos y fiestas corporativas.',
    address: 'Av. 13 810, La Plata',
    neighborhood: 'Centro, La Plata',
    lat: -34.9158,
    lng: -57.9496,
    capacityMin: 40,
    capacityMax: 150,
    pricePerHour: 72000,
    photos: [
      {
        id: 'jota-1',
        url: 'https://images.unsplash.com/photo-1478146896981-b497af279b44?w=800&h=600&fit=crop',
        name: 'salon.jpg',
        tag: 'salon',
        isCover: true,
      },
    ],
  },
  'salon-chillout': {
    ...DEFAULT_SALON_PROFILE,
    name: 'CHILLOUT EVENTOS',
    types: ['multiespacio', 'rooftop'],
    description:
      'Ambiente relajado con terraza al aire libre y salón principal climatizado. Perfecto para eventos nocturnos y celebraciones informales.',
    address: 'Diag. 74 1200, La Plata',
    neighborhood: 'Villa Elvira, La Plata',
    lat: -34.9289,
    lng: -57.9412,
    capacityMin: 30,
    capacityMax: 200,
    pricePerHour: 68000,
    photos: [
      {
        id: 'ch-1',
        url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
        name: 'terraza.jpg',
        tag: 'exteriores',
        isCover: true,
      },
    ],
  },
  'salon-palermo': {
    ...DEFAULT_SALON_PROFILE,
    name: 'Salón Palermo Norte',
    types: ['salon', 'hotel'],
    description:
      'Salón premium en Palermo con vista al jardín, catering gourmet y equipo audiovisual de última generación.',
    address: 'Av. Santa Fe 3200, CABA',
    neighborhood: 'Palermo, CABA',
    lat: -34.5875,
    lng: -58.4108,
    capacityMin: 50,
    capacityMax: 220,
    pricePerHour: 120000,
    photos: [
      {
        id: 'pal-1',
        url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
        name: 'salon.jpg',
        tag: 'salon',
        isCover: true,
      },
    ],
  },
  'salon-pilar': {
    ...DEFAULT_SALON_PROFILE,
    name: 'Espacio Pilar Garden',
    types: ['quinta', 'jardin'],
    description:
      'Quinta campestre con jardín de 2000 m², pileta y salón techado. Ideal para casamientos al aire libre y eventos familiares.',
    address: 'Ruta 8 Km 50, Pilar',
    neighborhood: 'Pilar, Buenos Aires',
    lat: -34.4587,
    lng: -58.9142,
    capacityMin: 60,
    capacityMax: 300,
    pricePerHour: 95000,
    photos: [
      {
        id: 'pil-1',
        url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop',
        name: 'jardin.jpg',
        tag: 'exteriores',
        isCover: true,
      },
    ],
  },
  'salon-lanus': {
    ...DEFAULT_SALON_PROFILE,
    name: 'Salón Golden Lanús',
    types: ['salon'],
    description:
      'Salón de fiestas con pista iluminada, barra premium y menú infantil. Ubicado a minutos de La Plata y CABA sur.',
    address: 'Av. Hipólito Yrigoyen 4500, Lanús',
    neighborhood: 'Lanús, Buenos Aires',
    lat: -34.7021,
    lng: -58.3956,
    capacityMin: 25,
    capacityMax: 180,
    pricePerHour: 65000,
    photos: [
      {
        id: 'lan-1',
        url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
        name: 'salon.jpg',
        tag: 'salon',
        isCover: true,
      },
    ],
  },
  'salon-tigre': {
    ...DEFAULT_SALON_PROFILE,
    name: 'Delta Eventos Tigre',
    types: ['quinta', 'jardin'],
    description:
      'Quinta sobre el delta con muelle propio, ideal para eventos al atardecer y casamientos con vista al río.',
    address: 'Av. Lavalle 1200, Tigre',
    neighborhood: 'Tigre, Zona Norte',
    lat: -34.4264,
    lng: -58.5798,
    capacityMin: 40,
    capacityMax: 250,
    pricePerHour: 110000,
    photos: [
      {
        id: 'tig-1',
        url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
        name: 'jardin.jpg',
        tag: 'exteriores',
        isCover: true,
      },
    ],
  },
  'salon-sanisidro': {
    ...DEFAULT_SALON_PROFILE,
    name: 'Hacienda San Isidro',
    types: ['hotel', 'salon'],
    description:
      'Salón histórico con arquitectura clásica, jardín inglés y servicio de catering de autor para eventos exclusivos.',
    address: 'Av. del Libertador 16.800, San Isidro',
    neighborhood: 'San Isidro, Zona Norte',
    lat: -34.4722,
    lng: -58.5271,
    capacityMin: 50,
    capacityMax: 200,
    pricePerHour: 135000,
    photos: [
      {
        id: 'si-1',
        url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
        name: 'salon.jpg',
        tag: 'salon',
        isCover: true,
      },
    ],
  },
  'salon-berazategui': {
    ...DEFAULT_SALON_PROFILE,
    name: 'Fiesta Club Berazategui',
    types: ['salon', 'multiespacio'],
    description:
      'Espacio multiespacio para cumpleaños infantiles y fiestas teen con animación, candy bar y zona gaming.',
    address: 'Calle 14 2500, Berazategui',
    neighborhood: 'Berazategui, Buenos Aires',
    lat: -34.7635,
    lng: -58.2123,
    capacityMin: 20,
    capacityMax: 120,
    pricePerHour: 55000,
    photos: [
      {
        id: 'ber-1',
        url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop',
        name: 'fiesta.jpg',
        tag: 'salon',
        isCover: true,
      },
    ],
  },
  'salon-microcentro': {
    ...DEFAULT_SALON_PROFILE,
    name: 'Centro de Convenciones Microcentro',
    types: ['multiespacio', 'hotel'],
    description:
      'Salón corporativo en pleno microcentro porteño. Salas modulares, streaming, traducción simultánea y coffee break ejecutivo.',
    address: 'Av. Corrientes 800, CABA',
    neighborhood: 'Microcentro, CABA',
    lat: -34.6037,
    lng: -58.3816,
    capacityMin: 80,
    capacityMax: 400,
    pricePerHour: 150000,
    photos: [
      {
        id: 'mic-1',
        url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
        name: 'auditorio.jpg',
        tag: 'salon',
        isCover: true,
      },
    ],
  },
}

const VENUE_LISTINGS_BASE = [
  {
    id: 'salon-calle13',
    category: 'social',
    rating: 4.9,
    reviewCount: 124,
    featured: true,
    badge: 'EVENTOS SOCIALES',
  },
  {
    id: 'salon-jota',
    category: 'social',
    rating: 4.8,
    reviewCount: 89,
    featured: true,
    badge: 'EVENTOS',
  },
  {
    id: 'salon-chillout',
    category: 'fiestas',
    rating: 4.7,
    reviewCount: 56,
    featured: true,
    badge: 'EVENTOS INFANTILES',
  },
  {
    id: 'salon-olivos',
    category: 'casamiento',
    rating: 4.9,
    reviewCount: 128,
    featured: true,
    badge: 'CASAMIENTOS',
  },
  {
    id: 'salon-palermo',
    category: 'conferencia',
    rating: 4.6,
    reviewCount: 42,
    badge: 'CORPORATIVO',
  },
  {
    id: 'salon-pilar',
    category: 'casamiento',
    rating: 4.8,
    reviewCount: 73,
    badge: 'QUINTAS',
  },
  {
    id: 'salon-lanus',
    category: 'social',
    rating: 4.5,
    reviewCount: 38,
    badge: 'EVENTOS',
  },
  {
    id: 'salon-tigre',
    category: 'casamiento',
    rating: 4.9,
    reviewCount: 61,
    featured: true,
    badge: 'QUINTAS',
  },
  {
    id: 'salon-sanisidro',
    category: 'casamiento',
    rating: 4.8,
    reviewCount: 94,
    featured: true,
    badge: 'PREMIUM',
  },
  {
    id: 'salon-berazategui',
    category: 'fiestas',
    rating: 4.6,
    reviewCount: 47,
    badge: 'INFANTILES',
  },
  {
    id: 'salon-microcentro',
    category: 'conferencia',
    rating: 4.7,
    reviewCount: 112,
    featured: true,
    badge: 'CORPORATIVO',
  },
] as const

const VENUE_LISTINGS: MarketplaceVenueListing[] = VENUE_LISTINGS_BASE.map((listing) => {
  const profile = VENUE_PROFILES[listing.id]
  const range = computePriceRange(profile)
  return {
    ...listing,
    priceFrom: range.from,
    priceTo: range.to,
  } satisfies MarketplaceVenueListing
})

export const MARKETPLACE_CATEGORIES = [
  {
    id: 'casamiento',
    label: 'Casamientos',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop',
  },
  {
    id: 'conferencia',
    label: 'Conferencia',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=800&fit=crop',
  },
  {
    id: 'fiestas',
    label: 'Fiestas',
    image:
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=800&fit=crop',
  },
] as const

export const EVENT_TYPE_OPTIONS = [
  { id: 'infantil', label: 'Infantil' },
  { id: 'casamiento', label: 'Casamiento' },
  { id: 'corporativo', label: 'Corporativo' },
  { id: 'social', label: 'Social' },
  { id: 'conferencia', label: 'Conferencia' },
]

export function getAllVenueListings(): MarketplaceVenueListing[] {
  return VENUE_LISTINGS
}

export function filterVenueListings(filters: MarketplaceSearchFilters): MarketplaceVenueListing[] {
  return VENUE_LISTINGS.filter((venue) => {
    const profile = VENUE_PROFILES[venue.id]
    if (!profile) return false

    if (filters.category && venue.category !== filters.category) {
      return false
    }

    if (filters.query.trim()) {
      const q = filters.query.trim().toLowerCase()
      const haystack =
        `${profile.name} ${profile.description} ${profile.address} ${profile.neighborhood}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }

    if (filters.location.trim()) {
      const q = filters.location.trim().toLowerCase()
      const haystack = `${profile.name} ${profile.address} ${profile.neighborhood}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }

    if (filters.eventType) {
      const eventHaystack =
        `${venue.category} ${profile.types.join(' ')} ${profile.description}`.toLowerCase()
      if (!eventHaystack.includes(filters.eventType.toLowerCase())) return false
    }

    if (filters.capacityMax < profile.capacityMin) return false
    if (filters.capacityMin > profile.capacityMax) return false

    if (venue.priceTo < filters.priceMin) return false
    if (venue.priceFrom > filters.priceMax) return false

    return true
  })
}

export function getFeaturedVenues(): MarketplaceVenueListing[] {
  return VENUE_LISTINGS.filter((v) => v.featured)
}

export function getVenueListing(id: string): MarketplaceVenueListing | undefined {
  return VENUE_LISTINGS.find((v) => v.id === id)
}

export function getVenueProfile(id: string): SalonProfile | undefined {
  return VENUE_PROFILES[id]
}

export function getVenueCoverPhoto(profile: SalonProfile): string {
  const cover = profile.photos.find((p) => p.isCover) ?? profile.photos[0]
  return (
    cover?.url ??
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b8?w=800&h=600&fit=crop'
  )
}

export function formatPriceRange(from: number, to: number, currency: SalonProfile['currency'] = 'ARS'): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n)
  return `${fmt(from)} – ${fmt(to)}`
}

export function getFavoriteSalonIds(): string[] {
  return readJson<string[]>(FAVORITES_KEY, [])
}

export function isFavoriteSalon(salonId: string): boolean {
  return getFavoriteSalonIds().includes(salonId)
}

export function toggleFavoriteSalon(salonId: string): boolean {
  const current = getFavoriteSalonIds()
  const exists = current.includes(salonId)
  const next = exists ? current.filter((id) => id !== salonId) : [...current, salonId]
  writeJson(FAVORITES_KEY, next)
  return !exists
}

export function getHostVisits(): HostVisitRequest[] {
  return readJson<HostVisitRequest[]>(VISITS_KEY, [])
}

export function addHostVisit(
  visit: Omit<HostVisitRequest, 'id' | 'status' | 'createdAt'>,
): HostVisitRequest {
  const visits = getHostVisits()
  const newVisit: HostVisitRequest = {
    ...visit,
    id: `visit-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  writeJson(VISITS_KEY, [newVisit, ...visits])
  return newVisit
}

export function getHostInquiries(): HostInquiry[] {
  return readJson<HostInquiry[]>(INQUIRIES_KEY, [])
}

export function addHostInquiry(
  inquiry: Omit<HostInquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
): HostInquiry {
  const inquiries = getHostInquiries()
  const now = new Date().toISOString()
  const newInquiry: HostInquiry = {
    ...inquiry,
    id: `inq-${Date.now()}`,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  }
  writeJson(INQUIRIES_KEY, [newInquiry, ...inquiries])
  return newInquiry
}

export function getHostBudgets(): HostSavedBudget[] {
  return readJson<HostSavedBudget[]>(BUDGETS_KEY, [])
}

export function saveHostBudget(
  budget: Omit<HostSavedBudget, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
): HostSavedBudget {
  const budgets = getHostBudgets()
  const now = new Date().toISOString()
  const newBudget: HostSavedBudget = {
    ...budget,
    id: `budget-${Date.now()}`,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  }
  writeJson(BUDGETS_KEY, [newBudget, ...budgets])
  return newBudget
}

export function getSalonReviews(salonId: string): SalonReview[] {
  const all = readJson<SalonReview[]>(REVIEWS_KEY, [])
  return all.filter((r) => r.salonId === salonId)
}

export function addSalonReview(
  review: Omit<SalonReview, 'id' | 'createdAt'>,
): SalonReview {
  const all = readJson<SalonReview[]>(REVIEWS_KEY, [])
  const newReview: SalonReview = {
    ...review,
    id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  writeJson(REVIEWS_KEY, [newReview, ...all])
  return newReview
}

export function getDefaultReviews(salonId: string): SalonReview[] {
  const existing = getSalonReviews(salonId)
  if (existing.length > 0) return existing

  if (salonId === 'salon-calle13') {
    return [
      {
        id: 'demo-1',
        salonId,
        hostId: 'demo',
        hostName: 'María González',
        rating: 5,
        comment:
          'El salón superó nuestras expectativas. El catering fue excelente y el staff muy atento durante todo el evento.',
        eventType: 'Casamiento',
        createdAt: '2026-06-15T00:00:00.000Z',
      },
      {
        id: 'demo-2',
        salonId,
        hostId: 'demo',
        hostName: 'Carlos Ruiz',
        rating: 5,
        comment:
          'Organizamos un congreso de 80 personas y todo salió impecable. La acústica y el equipamiento AV son de primer nivel.',
        eventType: 'Congreso',
        createdAt: '2026-05-20T00:00:00.000Z',
      },
      {
        id: 'demo-3',
        salonId,
        hostId: 'demo',
        hostName: 'Laura Fernández',
        rating: 4,
        comment:
          'Hermoso espacio para la fiesta de 15 de mi hija. La decoración temática quedó perfecta.',
        eventType: 'Fiesta de 15',
        createdAt: '2026-04-10T00:00:00.000Z',
      },
    ]
  }

  return []
}

export function calculateBudgetLines(
  profile: SalonProfile,
  selectedServiceIds: number[],
  guests: number,
): HostBudgetLine[] {
  const services = (profile.services ?? []).filter(
    (s) => s.status === 'ACTIVE' && selectedServiceIds.includes(s.id),
  )

  return services.map((service) => {
    let quantity = 1
    if (service.pricingModel === 'PER_PERSON') {
      quantity = Math.max(service.minQuantity, Math.min(guests, service.maxQuantity))
    }

    return {
      serviceId: service.id,
      serviceName: service.name,
      quantity,
      unitPrice: service.basePrice,
      total: service.basePrice * quantity,
    }
  })
}
