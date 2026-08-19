import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CategoryQuickFilters } from '../components/marketplace/CategoryQuickFilters'
import { MarketplaceBreadcrumbs } from '../components/marketplace/layout/MarketplaceBreadcrumbs'
import { MarketplaceLayout } from '../components/marketplace/layout/MarketplaceLayout'
import { VenueCard } from '../components/marketplace/VenueCard'
import { VenueFiltersSidebar } from '../components/marketplace/VenueFiltersSidebar'
import { VenueMapView } from '../components/marketplace/VenueMapView'
import { ViewToggle } from '../components/marketplace/ViewToggle'
import {
  filterVenueListings,
  getVenueCoverPhoto,
  getVenueProfile,
} from '../data/marketplace-venues'
import { DEFAULT_SEARCH_FILTERS, type MarketplaceSearchFilters } from '../types/marketplace-host'
import { usePagination } from '../hooks/usePagination'

export default function MarketplaceCatalogPage() {
  const [searchParams] = useSearchParams()
  const [showFiltersMobile, setShowFiltersMobile] = useState(false)
  const [view, setView] = useState<'grid' | 'map'>(() =>
    searchParams.get('map') === '1' ? 'map' : 'grid',
  )
  const [filters, setFilters] = useState<MarketplaceSearchFilters>(() => ({
    ...DEFAULT_SEARCH_FILTERS,
    location: searchParams.get('location') ?? '',
    dateFrom: searchParams.get('date') ?? '',
    eventType: searchParams.get('tipo') ?? '',
    category: searchParams.get('categoria') ?? '',
  }))
  const [appliedFilters, setAppliedFilters] = useState(filters)

  const filteredVenues = useMemo(
    () => filterVenueListings(appliedFilters),
    [appliedFilters],
  )

  const { page, totalPages, paginatedItems, setPage } = usePagination(filteredVenues, 6)

  const title = appliedFilters.category
    ? appliedFilters.category.charAt(0).toUpperCase() + appliedFilters.category.slice(1)
    : 'Todos los salones'

  const applyCategory = (category: string) => {
    const next = { ...filters, category }
    setFilters(next)
    setAppliedFilters(next)
    setPage(1)
  }

  const applyFilters = () => {
    setAppliedFilters(filters)
    setShowFiltersMobile(false)
    setPage(1)
  }

  return (
    <MarketplaceLayout>
      <div className="mk-container py-6 lg:py-8">
        <MarketplaceBreadcrumbs items={[{ label: 'Buscar salones' }]} />

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="mk-title text-2xl sm:text-3xl">{title}</h1>
            <p className="mt-1 text-sm text-ink-muted">
              {filteredVenues.length} salón{filteredVenues.length === 1 ? '' : 'es'} disponible
              {filteredVenues.length === 1 ? '' : 's'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFiltersMobile(true)}
              className="mk-btn-soft !py-2.5 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </button>
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>

        <CategoryQuickFilters
          activeCategory={appliedFilters.category}
          onSelect={applyCategory}
        />

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className={`${showFiltersMobile ? 'fixed inset-0 z-50 flex' : 'hidden'} lg:static lg:block lg:w-72 xl:w-80`}>
            {showFiltersMobile && (
              <button
                type="button"
                className="absolute inset-0 bg-black/40 lg:hidden"
                onClick={() => setShowFiltersMobile(false)}
                aria-label="Cerrar filtros"
              />
            )}
            <div className="relative z-10 h-full w-full max-w-sm overflow-y-auto bg-[var(--mk-bg-elevated)] p-4 lg:max-w-none lg:overflow-visible lg:bg-transparent lg:p-0">
              <VenueFiltersSidebar
                filters={filters}
                onChange={setFilters}
                onApply={applyFilters}
                onClose={() => setShowFiltersMobile(false)}
              />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            {view === 'map' ? (
              <div className="grid gap-6 xl:grid-cols-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  {paginatedItems.map((venue) => {
                    const profile = getVenueProfile(venue.id)
                    if (!profile) return null
                    return (
                      <VenueCard
                        key={venue.id}
                        id={venue.id}
                        name={profile.name}
                        image={getVenueCoverPhoto(profile)}
                        location={profile.neighborhood}
                        rating={venue.rating}
                        reviewCount={venue.reviewCount}
                        capacity={`Hasta ${profile.capacityMax} invitados`}
                        variant="compact"
                      />
                    )
                  })}
                </div>
                <VenueMapView venues={filteredVenues} />
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedItems.map((venue) => {
                  const profile = getVenueProfile(venue.id)
                  if (!profile) return null
                  return (
                    <VenueCard
                      key={venue.id}
                      id={venue.id}
                      name={profile.name}
                      image={getVenueCoverPhoto(profile)}
                      location={profile.neighborhood}
                      rating={venue.rating}
                      reviewCount={venue.reviewCount}
                      capacity={`Hasta ${profile.capacityMax} invitados`}
                      variant="compact"
                    />
                  )
                })}
              </div>
            )}

            {filteredVenues.length === 0 && (
              <div className="mk-card mt-6 flex flex-col items-center px-6 py-16 text-center">
                <p className="text-lg font-semibold text-ink">No encontramos salones</p>
                <p className="mt-2 max-w-sm text-sm text-ink-muted">
                  Probá ampliar el rango de precio, cambiar la ubicación o elegir otra categoría.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilters(DEFAULT_SEARCH_FILTERS)
                    setAppliedFilters(DEFAULT_SEARCH_FILTERS)
                  }}
                  className="mk-btn-soft mt-6"
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            {totalPages > 1 && view === 'grid' && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--mk-border)] bg-[var(--mk-bg-elevated)] disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i + 1)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                      page === i + 1
                        ? 'bg-primary text-white shadow-sm'
                        : 'border border-[var(--mk-border)] bg-[var(--mk-bg-elevated)] text-ink-muted hover:border-[var(--mk-border-strong)]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--mk-border)] bg-[var(--mk-bg-elevated)] disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  )
}
