import { ChevronLeft, ChevronRight, Users } from 'lucide-react'
import { useState } from 'react'
import { formatPrice } from '../../data/salon-profile-defaults'
import type { SalonProfile } from '../../types/salon-profile'

interface ImmersiveGalleryProps {
  profile: SalonProfile
}

export function ImmersiveGallery({ profile }: ImmersiveGalleryProps) {
  const photos = profile.photos.length > 0 ? profile.photos : []
  const [activeIndex, setActiveIndex] = useState(
    Math.max(0, photos.findIndex((p) => p.isCover)),
  )

  const current = photos[activeIndex] ?? photos[0]
  const priceLabel = `Desde ${formatPrice(profile.pricePerHour, profile.currency)}/h`

  const prev = () => setActiveIndex((i) => (i === 0 ? photos.length - 1 : i - 1))
  const next = () => setActiveIndex((i) => (i === photos.length - 1 ? 0 : i + 1))

  if (!current) {
    return (
      <div className="flex h-72 items-center justify-center bg-surface sm:h-96">
        <p className="text-slate-400">Sin fotos disponibles</p>
      </div>
    )
  }

  return (
    <div className="relative h-[55vh] min-h-[320px] max-h-[520px] w-full overflow-hidden bg-slate-900 sm:h-[60vh]">
      <img
        src={current.url.replace('w=400', 'w=1200').replace('h=300', 'h=800')}
        alt={profile.name}
        className="h-full w-full object-cover transition-opacity duration-500"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/20 p-2 text-white backdrop-blur-md transition-colors hover:bg-white/30"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/20 p-2 text-white backdrop-blur-md transition-colors hover:bg-white/30"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-24 left-1/2 flex -translate-x-1/2 gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                }`}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
        <div className="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur-xl">
          <h1 className="text-xl font-bold text-white sm:text-2xl">{profile.name}</h1>
          <p className="mt-0.5 text-sm text-white/80">{profile.neighborhood}</p>
        </div>

        <div className="flex gap-2">
          <div className="rounded-xl border border-white/20 bg-white/15 px-3 py-2 backdrop-blur-xl">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">Precio</p>
            <p className="text-sm font-bold text-white">{priceLabel}</p>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/15 px-3 py-2 backdrop-blur-xl">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">Capacidad</p>
            <p className="flex items-center gap-1 text-sm font-bold text-white">
              <Users className="h-3.5 w-3.5" />
              {profile.capacityMax}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
