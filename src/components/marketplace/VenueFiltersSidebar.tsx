import { Search, X } from 'lucide-react'
import type { MarketplaceSearchFilters } from '../../types/marketplace-host'

interface VenueFiltersSidebarProps {
  filters: MarketplaceSearchFilters
  onChange: (next: MarketplaceSearchFilters) => void
  onApply: () => void
  onClose?: () => void
}

const SERVICE_OPTIONS = ['Catering', 'AV Equipment', 'WiFi Ultra-High Speed', 'Parking']

export function VenueFiltersSidebar({
  filters,
  onChange,
  onApply,
  onClose,
}: VenueFiltersSidebarProps) {
  const update = (partial: Partial<MarketplaceSearchFilters>) => {
    onChange({ ...filters, ...partial })
  }

  const toggleService = (service: string) => {
    const services = filters.services.includes(service)
      ? filters.services.filter((s) => s !== service)
      : [...filters.services, service]
    update({ services })
  }

  return (
    <aside className="mk-card p-5 lg:sticky lg:top-28">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="mk-eyebrow">Refinar búsqueda</p>
          <h2 className="mt-1 text-lg font-bold text-ink">Filtros</h2>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-ink-muted hover:bg-white/5 lg:hidden"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Ubicación
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/60" />
            <input
              type="text"
              value={filters.location}
              onChange={(e) => update({ location: e.target.value })}
              placeholder="Ej: La Plata, Palermo..."
              className="mk-input !py-2.5 !pl-10"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Fecha del evento
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => update({ dateFrom: e.target.value })}
            className="mk-input !py-2.5"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Precio máximo
          </label>
          <input
            type="range"
            min={0}
            max={3000000}
            step={50000}
            value={filters.priceMax}
            onChange={(e) => update({ priceMax: Number(e.target.value) })}
            className="w-full accent-primary"
          />
          <p className="mt-2 text-xs text-ink-muted">
            Hasta{' '}
            {filters.priceMax.toLocaleString('es-AR', {
              style: 'currency',
              currency: 'ARS',
              maximumFractionDigits: 0,
            })}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Servicios
          </label>
          <div className="space-y-2">
            {SERVICE_OPTIONS.map((service) => (
              <label key={service} className="flex cursor-pointer items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={filters.services.includes(service)}
                  onChange={() => toggleService(service)}
                  className="h-4 w-4 rounded accent-primary"
                />
                {service}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink-muted">
            Capacidad mínima
          </label>
          <input
            type="range"
            min={20}
            max={400}
            value={filters.capacityMax}
            onChange={(e) => update({ capacityMax: Number(e.target.value) })}
            className="w-full accent-primary"
          />
          <p className="mt-2 text-xs text-ink-muted">Hasta {filters.capacityMax} personas</p>
        </div>
      </div>

      <button type="button" onClick={onApply} className="mk-btn-primary mt-6 w-full">
        Aplicar filtros
      </button>
    </aside>
  )
}
