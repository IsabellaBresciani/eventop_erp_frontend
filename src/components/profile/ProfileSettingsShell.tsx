import {
  Camera,
  CircleDollarSign,
  Image as ImageIcon,
  MapPin,
  Sparkles,
  UserRound,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import { SALON_TYPE_OPTIONS } from '../../data/salon-profile-defaults'
import type { ProfileStep, SalonProfile } from '../../types/salon-profile'

export const PROFILE_SETTINGS_NAV: {
  id: ProfileStep
  label: string
  icon: ComponentType<{ className?: string; strokeWidth?: string | number }>
}[] = [
  { id: 'general', label: 'General', icon: UserRound },
  { id: 'location', label: 'Ubicación', icon: MapPin },
  { id: 'pricing', label: 'Precios', icon: CircleDollarSign },
  { id: 'photos', label: 'Fotos', icon: ImageIcon },
  { id: 'services', label: 'Servicios', icon: Sparkles },
]

interface ProfileCoverHeaderProps {
  profile: SalonProfile
  progress: number
  onEditPhotos?: () => void
}

export function ProfileCoverHeader({
  profile,
  progress,
  onEditPhotos,
}: ProfileCoverHeaderProps) {
  const cover = profile.photos.find((p) => p.isCover) ?? profile.photos[0]
  const avatar = profile.photos.find((p) => !p.isCover) ?? cover
  const typeLabels = profile.types
    .map((t) => SALON_TYPE_OPTIONS.find((o) => o.id === t)?.label)
    .filter(Boolean)

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="relative h-44 bg-slate-200 sm:h-56">
        {cover ? (
          <img src={cover.url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary-800/30 text-sm font-medium text-white/80">
            Agregá una foto de portada
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        {onEditPhotos && (
          <button
            type="button"
            onClick={onEditPhotos}
            className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-sm backdrop-blur hover:bg-white"
            aria-label="Editar portada"
          >
            <Camera className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="relative px-4 pb-5 pt-0 sm:px-6">
        <div className="-mt-12 flex flex-col gap-3 sm:-mt-14 sm:flex-row sm:items-end sm:gap-4">
          <button
            type="button"
            onClick={onEditPhotos}
            disabled={!onEditPhotos}
            className="group relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md sm:h-32 sm:w-32 disabled:cursor-default"
            aria-label="Cambiar foto de perfil"
          >
            {avatar ? (
              <img src={avatar.url} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-2xl font-bold text-primary">
                {(profile.name || 'ET').slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black/55 py-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-3.5 w-3.5" />
            </span>
          </button>

          <div className="pb-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem]">
              {profile.name || 'Tu salón'}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {[typeLabels.join(' · '), profile.neighborhood].filter(Boolean).join(' · ') ||
                'Completá tu perfil'}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  progress >= 80
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                {progress}%
              </span>
              <Link
                to="/marketplace/salones/salon-olivos"
                target="_blank"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Ver perfil público
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ProfileSettingsNavProps {
  activeSection: ProfileStep
  onSelect: (section: ProfileStep) => void
  sectionHasError?: (section: ProfileStep) => boolean
}

export function ProfileSettingsNav({
  activeSection,
  onSelect,
  sectionHasError,
}: ProfileSettingsNavProps) {
  return (
    <nav className="space-y-1" aria-label="Secciones del perfil">
      {PROFILE_SETTINGS_NAV.map(({ id, label, icon: Icon }) => {
        const active = activeSection === id
        const hasError = sectionHasError?.(id)
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
              active ? 'bg-primary/[0.08] text-primary' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                active ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold">
              {label}
              {hasError && (
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-label="Con errores" />
              )}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
