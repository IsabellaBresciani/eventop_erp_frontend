import { motion } from 'framer-motion'
import { useCallback, useMemo, useState } from 'react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { ProfileSectionView } from '../components/profile/ProfileSectionView'
import {
  ProfileCoverHeader,
  PROFILE_SETTINGS_NAV,
  ProfileSettingsNav,
} from '../components/profile/ProfileSettingsShell'
import { ProfileSettingsPanel } from '../components/profile/ProfileSettingsPanel'
import { GeneralStep } from '../components/profile/steps/GeneralStep'
import { LocationStep } from '../components/profile/steps/LocationStep'
import { PhotosStep } from '../components/profile/steps/PhotosStep'
import { PricingStep } from '../components/profile/steps/PricingStep'
import { ServicesStep } from '../components/profile/steps/ServicesStep'
import { calculateProfileProgress, DEFAULT_SALON_PROFILE } from '../data/salon-profile-defaults'
import { useAuthGuard } from '../hooks/useAuthGuard'
import type { FieldErrors, ProfileStep, SalonProfile } from '../types/salon-profile'

const STORAGE_KEY = 'eventop_salon_profile'

function loadProfile(): SalonProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<SalonProfile> & {
        amenities?: unknown
      }
      const { amenities: _legacyAmenities, ...rest } = parsed
      return {
        ...DEFAULT_SALON_PROFILE,
        ...rest,
        services: Array.isArray(rest.services) ? rest.services : DEFAULT_SALON_PROFILE.services,
      }
    }
  } catch {}
  return DEFAULT_SALON_PROFILE
}

function cloneProfile(profile: SalonProfile): SalonProfile {
  return structuredClone(profile)
}

function validateStep(step: ProfileStep, profile: SalonProfile): FieldErrors {
  const errors: FieldErrors = {}

  if (step === 'general') {
    if (profile.name.trim().length < 3) errors.name = 'El nombre debe tener al menos 3 caracteres'
    if (profile.types.length === 0) errors.types = 'Seleccioná al menos un tipo'
    if (profile.description.trim().length < 20)
      errors.description = 'La descripción debe tener al menos 20 caracteres'
  }

  if (step === 'location') {
    if (profile.address.trim().length < 5) errors.address = 'Ingresá una dirección válida'
    if (profile.neighborhood.trim().length < 2) errors.neighborhood = 'Ingresá la zona o barrio'
  }

  if (step === 'pricing') {
    if (profile.capacityMin <= 0) errors.capacityMin = 'La capacidad mínima debe ser mayor a 0'
    if (profile.capacityMax <= profile.capacityMin)
      errors.capacityMax = 'La capacidad máxima debe superar la mínima'
    if (profile.pricePerHour <= 0) errors.pricePerHour = 'Ingresá un precio válido'
  }

  if (step === 'photos') {
    if (profile.photos.length === 0) errors.photos = 'Subí al menos una foto'
    else if (!profile.photos.some((p) => p.isCover))
      errors.photos = 'Seleccioná una foto de portada'
  }

  return errors
}

export default function SalonProfilePage() {
  const { salon } = useAuthGuard({ allowedRoles: ['admin'] })
  const [activeSection, setActiveSection] = useState<ProfileStep>('general')
  const [profile, setProfile] = useState<SalonProfile>(loadProfile)
  const [draft, setDraft] = useState<SalonProfile | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSaving, setIsSaving] = useState(false)

  const editing = draft !== null
  const working = draft ?? profile
  const progress = useMemo(() => calculateProfileProgress(profile), [profile])

  const updateDraft = useCallback((patch: Partial<SalonProfile>) => {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev))
    setErrors({})
  }, [])

  const sectionHasError = useCallback(
    (section: ProfileStep) =>
      Object.keys(validateStep(section, working)).some((key) => key in errors),
    [errors, working],
  )

  const startEdit = (section: ProfileStep = activeSection) => {
    setActiveSection(section)
    setDraft(cloneProfile(profile))
    setErrors({})
  }

  const cancelEdit = () => {
    setDraft(null)
    setErrors({})
  }

  const selectSection = (section: ProfileStep) => {
    if (editing) cancelEdit()
    setActiveSection(section)
  }

  const handleSave = async () => {
    if (!draft) return

    const stepErrors = validateStep(activeSection, draft)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }

    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    const next = cloneProfile(draft)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setProfile(next)
    setDraft(null)
    setErrors({})
    setIsSaving(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
      <DashboardLayout salonName={salon}>
        <div className="mx-auto max-w-5xl space-y-5">
          <ProfileCoverHeader
            profile={profile}
            progress={progress}
            onEditPhotos={() => startEdit('photos')}
          />

          <div className="grid gap-5 lg:grid-cols-[14rem_minmax(0,1fr)]">
            <aside className="rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:sticky lg:top-6 lg:self-start">
              <div className="mb-1 flex gap-1 overflow-x-auto pb-1 lg:hidden">
                {PROFILE_SETTINGS_NAV.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectSection(id)}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      activeSection === id
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="hidden lg:block">
                <ProfileSettingsNav
                  activeSection={activeSection}
                  onSelect={selectSection}
                  sectionHasError={sectionHasError}
                />
              </div>
            </aside>

            <ProfileSettingsPanel
              editing={editing}
              isSaving={isSaving}
              onEdit={() => startEdit()}
              onCancel={cancelEdit}
              onSave={handleSave}
            >
              {editing ? (
                <>
                  {activeSection === 'general' && (
                    <GeneralStep
                      profile={working}
                      errors={errors}
                      onChange={updateDraft}
                      embedded
                      hideLabels
                    />
                  )}
                  {activeSection === 'location' && (
                    <LocationStep
                      profile={working}
                      errors={errors}
                      onChange={updateDraft}
                      embedded
                      hideLabels
                    />
                  )}
                  {activeSection === 'pricing' && (
                    <PricingStep
                      profile={working}
                      errors={errors}
                      onChange={updateDraft}
                      embedded
                      hideLabels
                    />
                  )}
                  {activeSection === 'photos' && (
                    <PhotosStep
                      profile={working}
                      errors={errors}
                      onChange={updateDraft}
                      embedded
                      hideLabels
                    />
                  )}
                  {activeSection === 'services' && (
                    <ServicesStep profile={working} onChange={updateDraft} embedded hideLabels />
                  )}
                </>
              ) : (
                <ProfileSectionView section={activeSection} profile={profile} />
              )}
            </ProfileSettingsPanel>
          </div>
        </div>
      </DashboardLayout>
    </motion.div>
  )
}
