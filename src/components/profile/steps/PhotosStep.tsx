import { ImagePlus, Star, Upload } from 'lucide-react'
import { useCallback, useRef } from 'react'
import { PHOTO_TAG_OPTIONS } from '../../../data/salon-profile-defaults'
import type { FieldErrors, PhotoTag, SalonPhoto, SalonProfile } from '../../../types/salon-profile'
import { FormField, StepCard } from '../FormField'
import { useTranslation } from 'react-i18next'

interface PhotosStepProps {
  profile: SalonProfile
  errors: FieldErrors
  onChange: (patch: Partial<SalonProfile>) => void
  embedded?: boolean
  hideLabels?: boolean
}

export function PhotosStep({ profile, errors, onChange, embedded, hideLabels }: PhotosStepProps) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragItem = useRef<number | null>(null)
  const dragOver = useRef<number | null>(null)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return
      const newPhotos: SalonPhoto[] = Array.from(files).map((file, i) => ({
        id: `ph-${Date.now()}-${i}`,
        url: URL.createObjectURL(file),
        name: file.name,
        tag: 'otro' as PhotoTag,
        isCover: profile.photos.length === 0 && i === 0,
      }))
      onChange({ photos: [...profile.photos, ...newPhotos] })
    },
    [profile.photos, onChange],
  )

  const setCover = (id: string) => {
    onChange({
      photos: profile.photos.map((p) => ({ ...p, isCover: p.id === id })),
    })
  }

  const updateTag = (id: string, tag: PhotoTag) => {
    onChange({
      photos: profile.photos.map((p) => (p.id === id ? { ...p, tag } : p)),
    })
  }

  const removePhoto = (id: string) => {
    const remaining = profile.photos.filter((p) => p.id !== id)
    if (remaining.length > 0 && !remaining.some((p) => p.isCover)) {
      remaining[0].isCover = true
    }
    onChange({ photos: remaining })
  }

  const handleDragSort = () => {
    if (dragItem.current === null || dragOver.current === null) return
    const items = [...profile.photos]
    const [removed] = items.splice(dragItem.current, 1)
    items.splice(dragOver.current, 0, removed)
    onChange({ photos: items })
    dragItem.current = null
    dragOver.current = null
  }

  return (
    <StepCard title={t('photosstep.fotos')} embedded={embedded}>
      <div className="space-y-5">
        <FormField error={errors.photos} hideLabel={hideLabels} label={t('photosstep.fotos')}>
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              handleFiles(e.dataTransfer.files)
            }}
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-6 py-10 transition-colors hover:border-primary/50 hover:bg-primary/10"
          >
            <Upload className="h-8 w-8 text-primary" />
            <p className="mt-3 text-sm font-semibold text-slate-800">
              {t('photosstep.arrastr_imgenes_o_hac_clic_para_subir')}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </FormField>

        {profile.photos.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profile.photos.map((photo, index) => (
              <div
                key={photo.id}
                draggable
                onDragStart={() => {
                  dragItem.current = index
                }}
                onDragEnter={() => {
                  dragOver.current = index
                }}
                onDragEnd={handleDragSort}
                onDragOver={(e) => e.preventDefault()}
                className="group relative overflow-hidden rounded-xl border border-surface-border bg-white shadow-card"
              >
                <div className="relative h-36">
                  <img src={photo.url} alt={photo.name} className="h-full w-full object-cover" />
                  {photo.isCover && (
                    <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                      <Star className="h-3 w-3" fill="white" />
                      {t('photosstep.portada')}
                    </span>
                  )}
                </div>

                <div className="space-y-2 p-3">
                  <select
                    value={photo.tag}
                    onChange={(e) => updateTag(photo.id, e.target.value as PhotoTag)}
                    className="input-field py-1.5 text-xs"
                  >
                    {PHOTO_TAG_OPTIONS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-1">
                    {!photo.isCover && (
                      <button
                        type="button"
                        onClick={() => setCover(photo.id)}
                        className="btn-ghost flex-1 py-1 text-[10px]"
                      >
                        <Star className="h-3 w-3" />
                        {t('photosstep.portada')}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="btn-ghost flex-1 py-1 text-[10px] text-red-500 hover:bg-red-50"
                    >
                      {t('photosstep.eliminar')}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-border text-slate-400 transition-colors hover:border-primary/30 hover:text-primary"
            >
              <ImagePlus className="h-6 w-6" />
              <span className="mt-2 text-xs">{t('photosstep.agregar_ms')}</span>
            </button>
          </div>
        )}
      </div>
    </StepCard>
  )
}
