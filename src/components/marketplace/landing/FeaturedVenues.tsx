import { Link } from 'react-router-dom'
import { getFeaturedVenues, getVenueCoverPhoto, getVenueProfile } from '../../../data/marketplace-venues'
import { formatPrice } from '../../../data/salon-profile-defaults'
import { FadeIn } from '../../ui/FadeIn'
import { VenueCard } from '../VenueCard'

export function FeaturedVenues() {
  const venues = getFeaturedVenues()

  return (
    <section className="mk-section mk-section-alt">
      <div className="mk-container">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="mk-eyebrow">Destacados</p>
            <h2 className="mk-title mt-2 text-2xl sm:text-3xl">Salones más elegidos</h2>
            <p className="mk-subtitle">Los espacios mejor valorados por anfitriones como vos.</p>
          </div>
          <Link to="/marketplace/salones" className="mk-btn-soft !py-2 text-[13px]">
            Ver catálogo completo
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {venues.slice(0, 3).map((venue, index) => {
            const profile = getVenueProfile(venue.id)
            if (!profile) return null

            return (
              <FadeIn key={venue.id} delay={index * 0.06}>
                <VenueCard
                  id={venue.id}
                  name={profile.name}
                  image={getVenueCoverPhoto(profile)}
                  location={profile.neighborhood}
                  description={profile.description}
                  rating={venue.rating}
                  reviewCount={venue.reviewCount}
                  badge={venue.badge}
                  priceLabel={`Desde ${formatPrice(venue.priceFrom, profile.currency)}`}
                  variant="featured"
                />
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
