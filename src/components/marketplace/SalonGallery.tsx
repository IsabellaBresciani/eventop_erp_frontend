import { Images } from 'lucide-react'
import { useState } from 'react'
import { FavoriteButton } from './FavoriteButton'
import type { SalonPhoto } from '../../types/salon-profile'

interface SalonGalleryProps {
  salonId: string
  salonName: string
  photos: SalonPhoto[]
}

export function SalonGallery({ salonId, salonName, photos }: SalonGalleryProps) {
  const [showAll, setShowAll] = useState(false)
  const galleryPhotos =
    photos.length > 0
      ? photos
      : [{ id: 'fallback', url: '', name: salonName, tag: 'salon' as const, isCover: true }]

  const [main, second, third, fourth] = galleryPhotos

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-4 sm:grid-rows-2">
        <div className="relative sm:col-span-2 sm:row-span-2">
          <img
            src={main?.url}
            alt={main?.name || salonName}
            className="h-56 w-full rounded-3xl object-cover sm:h-full sm:min-h-[380px]"
          />
          <FavoriteButton salonId={salonId} className="absolute right-4 top-4" />
        </div>

        {second && (
          <img
            src={second.url}
            alt={second.name}
            className="hidden h-[186px] w-full rounded-2xl object-cover sm:block"
          />
        )}
        {third && (
          <img
            src={third.url}
            alt={third.name}
            className="hidden h-[186px] w-full rounded-2xl object-cover sm:block"
          />
        )}
        {fourth ? (
          <div className="relative hidden sm:col-span-2 sm:block">
            <img
              src={fourth.url}
              alt={fourth.name}
              className="h-[186px] w-full rounded-2xl object-cover"
            />
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-ink shadow-md backdrop-blur-sm transition hover:bg-white"
            >
              <Images className="h-4 w-4" />
              Ver todas las fotos
            </button>
          </div>
        ) : (
          galleryPhotos.length > 1 && (
            <div className="relative hidden sm:col-span-2 sm:flex sm:items-end sm:justify-end sm:pb-1">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-4 py-2 text-sm font-medium text-ink shadow-apple transition hover:bg-[#f5f5f7]"
              >
                <Images className="h-4 w-4" />
                Ver todas las fotos
              </button>
            </div>
          )
        )}

        {galleryPhotos.length > 1 && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-black/[0.06] bg-white py-3 text-sm font-medium text-ink sm:hidden"
          >
            <Images className="h-4 w-4" />
            Ver todas las fotos ({galleryPhotos.length})
          </button>
        )}
      </div>

      {showAll && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => setShowAll(false)}
            aria-label="Cerrar galería"
          />
          <div className="relative z-10 max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Fotos de {salonName}</h2>
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-ink-muted hover:bg-[#f5f5f7]"
              >
                Cerrar
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {galleryPhotos.map((photo) => (
                <img
                  key={photo.id}
                  src={photo.url}
                  alt={photo.name}
                  className="aspect-[4/3] w-full rounded-2xl object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
