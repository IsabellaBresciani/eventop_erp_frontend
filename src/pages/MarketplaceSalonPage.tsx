import { BadgeCheck, MapPin, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { InquiryModal } from '../components/marketplace/InquiryModal'
import { ReviewsSection } from '../components/marketplace/ReviewsSection'
import { SalonAmenities } from '../components/marketplace/SalonAmenities'
import { SalonBookingPanel, type SalonBookingSelection } from '../components/marketplace/SalonBookingPanel'
import { SalonGallery } from '../components/marketplace/SalonGallery'
import { SalonHighlights } from '../components/marketplace/SalonHighlights'
import { SavedBudgetPanel } from '../components/marketplace/SavedBudgetPanel'
import { VisitBookingModal } from '../components/marketplace/VisitBookingModal'
import { MarketplaceBreadcrumbs } from '../components/marketplace/layout/MarketplaceBreadcrumbs'
import { MarketplaceLayout } from '../components/marketplace/layout/MarketplaceLayout'
import { loadMarketplaceAgenda } from '../data/marketplace'
import {
  addSalonReview,
  getDefaultReviews,
  getSalonReviews,
  getVenueCoverPhoto,
  getVenueListing,
  getVenueProfile,
} from '../data/marketplace-venues'
import { SALON_TYPE_OPTIONS } from '../data/salon-profile-defaults'
import { useHostSession } from '../hooks/useHostSession'

export default function MarketplaceSalonPage() {
  const navigate = useNavigate()
  const { salonId } = useParams<{ salonId: string }>()
  const { session } = useHostSession()
  const [visitOpen, setVisitOpen] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [bookingSelection, setBookingSelection] = useState<SalonBookingSelection | null>(null)
  const [reviews, setReviews] = useState(() => {
    if (!salonId) return []
    const stored = getSalonReviews(salonId)
    return stored.length > 0 ? stored : getDefaultReviews(salonId)
  })

  const listing = salonId ? getVenueListing(salonId) : undefined
  const profile = salonId ? getVenueProfile(salonId) : undefined
  const agenda = loadMarketplaceAgenda()

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return listing?.rating ?? 4.8
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  }, [reviews, listing])

  if (!salonId || !profile || !listing) {
    return (
      <MarketplaceLayout>
        <div className="mk-container py-12 text-center">
          <p className="text-lg font-semibold text-ink">Salón no encontrado</p>
          <Link to="/marketplace/salones" className="mk-btn-primary mt-4 inline-flex">
            Ver salones
          </Link>
        </div>
      </MarketplaceLayout>
    )
  }

  const typeLabels = profile.types
    .map((t) => SALON_TYPE_OPTIONS.find((o) => o.id === t)?.label)
    .filter(Boolean)

  const photos =
    profile.photos.length > 0
      ? profile.photos
      : [{ id: 'fallback', url: getVenueCoverPhoto(profile), name: '', tag: 'salon' as const, isCover: true }]

  const hasCatering = (profile.services ?? []).some(
    (s) => s.status === 'ACTIVE' && s.category === 'FOOD_BEVERAGE',
  )

  const handleReview = (rating: number, comment: string, eventType: string) => {
    if (!session) {
      navigate('/marketplace/registro')
      return
    }
    const review = addSalonReview({
      salonId,
      hostId: session.id,
      hostName: session.name,
      rating,
      comment,
      eventType,
    })
    setReviews((prev) => [review, ...prev])
  }

  const openInquiry = (selection: SalonBookingSelection) => {
    setBookingSelection(selection)
    setInquiryOpen(true)
  }

  return (
    <MarketplaceLayout>
      <div className="mk-container pb-28 pt-6 lg:pb-8 lg:pt-8">
        <MarketplaceBreadcrumbs
          items={[
            { label: 'Buscar salones', to: '/marketplace/salones' },
            { label: profile.name },
          ]}
        />

        <div className="mt-6">
          <SalonGallery salonId={salonId} salonName={profile.name} photos={photos} />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {averageRating.toFixed(1)}
                <span className="font-normal text-ink-muted">
                  ({listing.reviewCount} reseñas)
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verificado
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {profile.name}
            </h1>
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
              {profile.description}
            </p>

            <div className="mt-8">
              <SalonHighlights profile={profile} hasCatering={hasCatering} />
            </div>

            {typeLabels.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {typeLabels.map((label) => (
                  <span key={label} className="mk-pill">
                    {label}
                  </span>
                ))}
              </div>
            )}

            <SalonAmenities profile={profile} />

            <section className="mt-10">
              <h2 className="text-xl font-semibold tracking-tight text-ink">Ubicación</h2>
              <div className="mt-3 flex items-start gap-2 text-sm text-ink-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p>{profile.address}</p>
                  <p>{profile.neighborhood}</p>
                </div>
              </div>
              <div className="mt-4 overflow-hidden rounded-3xl border border-black/[0.06]">
                <iframe
                  title="Ubicación del salón"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${profile.lng - 0.02}%2C${profile.lat - 0.02}%2C${profile.lng + 0.02}%2C${profile.lat + 0.02}&layer=mapnik&marker=${profile.lat}%2C${profile.lng}`}
                  className="h-72 w-full border-0"
                />
              </div>
            </section>

            <div className="mt-10 lg:hidden">
              <SavedBudgetPanel profile={profile} salonId={salonId} />
            </div>

            <ReviewsSection
              reviews={reviews}
              salonName={profile.name}
              averageRating={averageRating}
              canReview={Boolean(session)}
              onSubmitReview={handleReview}
            />
          </div>

          <div className="hidden lg:col-span-5 lg:block">
            <SalonBookingPanel
              profile={profile}
              priceFrom={listing.priceFrom}
              onConsult={openInquiry}
              onScheduleVisit={() => setVisitOpen(true)}
            />
            <div className="mt-4">
              <SavedBudgetPanel profile={profile} salonId={salonId} />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/[0.06] bg-white/95 p-4 pb-[calc(env(safe-area-inset-bottom)+4.5rem)] backdrop-blur-xl lg:hidden">
        <button
          type="button"
          onClick={() =>
            openInquiry({
              date: '',
              timeSlot: 'tarde',
              guests: Math.min(50, profile.capacityMax),
            })
          }
          className="mk-btn-primary w-full !py-3.5"
        >
          Consultar disponibilidad
        </button>
      </div>

      <VisitBookingModal
        isOpen={visitOpen}
        onClose={() => setVisitOpen(false)}
        profile={profile}
        agenda={agenda}
        salonId={salonId}
      />

      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        salonId={salonId}
        salonName={profile.name}
        booking={bookingSelection}
      />
    </MarketplaceLayout>
  )
}
