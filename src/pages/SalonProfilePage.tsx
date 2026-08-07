import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { SaveBar } from '../components/agenda/SaveBar'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { MarketplacePreview } from '../components/profile/MarketplacePreview'
import { ProfileStepper } from '../components/profile/ProfileStepper'
import { GeneralStep } from '../components/profile/steps/GeneralStep'
import { LocationStep } from '../components/profile/steps/LocationStep'
import { PhotosStep } from '../components/profile/steps/PhotosStep'
import { PricingStep } from '../components/profile/steps/PricingStep'
import { ServicesStep } from '../components/profile/steps/ServicesStep'
import {
  calculateProfileProgress,
  DEFAULT_SALON_PROFILE,
  PROFILE_STEPS,
} from '../data/salon-profile-defaults'
import { useAuthGuard } from '../hooks/useAuthGuard'
import type { FieldErrors, ProfileStep, SalonProfile } from '../types/salon-profile'

const STORAGE_KEY = 'eventop_salon_profile'

function loadProfile(): SalonProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return { ...DEFAULT_SALON_PROFILE, ...JSON.parse(stored) }
  } catch {
    /* use defaults */
  }
  return DEFAULT_SALON_PROFILE
}

function validateStep(step: ProfileStep, profile: SalonProfile): FieldErrors {
  const errors: FieldErrors = {}

  if (step === 'general') {
    if (profile.name.trim().length < 3) errors.name = 'El nombre debe tener al menos 3 caracteres'
    if (profile.types.length === 0) errors.types = 'Seleccioná al menos un tipo de salón'
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
    if (profile.pricePerHour <= 0) errors.pricePerHour = 'Ingresá un precio base válido'
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
  const [currentStep, setCurrentStep] = useState<ProfileStep>('general')
  const [profile, setProfile] = useState<SalonProfile>(loadProfile)
  const [savedSnapshot, setSavedSnapshot] = useState(JSON.stringify(loadProfile()))
  const [errors, setErrors] = useState<FieldErrors>({})
  const [completedSteps, setCompletedSteps] = useState<Set<ProfileStep>>(new Set())
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const progress = useMemo(() => calculateProfileProgress(profile), [profile])
  const isDirty = JSON.stringify(profile) !== savedSnapshot
  const stepIndex = PROFILE_STEPS.findIndex((s) => s.id === currentStep)
  const isLastStep = stepIndex === PROFILE_STEPS.length - 1

  const updateProfile = useCallback((patch: Partial<SalonProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }))
    setShowSuccess(false)
    setErrors({})
  }, [])

  const goNext = () => {
    const stepErrors = validateStep(currentStep, profile)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }
    setErrors({})
    setCompletedSteps((prev) => new Set([...prev, currentStep]))
    if (!isLastStep) {
      setCurrentStep(PROFILE_STEPS[stepIndex + 1].id)
    }
  }

  const goPrev = () => {
    if (stepIndex > 0) {
      setErrors({})
      setCurrentStep(PROFILE_STEPS[stepIndex - 1].id)
    }
  }

  const handleSave = async () => {
    const allErrors: FieldErrors = {}
    for (const step of PROFILE_STEPS) {
      Object.assign(allErrors, validateStep(step.id, profile))
    }
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      const firstErrorStep = PROFILE_STEPS.find(
        (s) => Object.keys(validateStep(s.id, profile)).length > 0,
      )
      if (firstErrorStep) setCurrentStep(firstErrorStep.id)
      return
    }

    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    setSavedSnapshot(JSON.stringify(profile))
    setIsSaving(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-24"
    >
      <DashboardLayout
        salonName={salon}
        title="Gestión del Perfil del Salón"
        subtitle="RF-001 · Tu vitrina comercial en el Marketplace"
        action={
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold ${
              progress >= 80
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-primary/10 text-primary'
            }`}
          >
            {progress >= 80 && <Check className="h-4 w-4" />}
            Perfil al {progress}%
          </span>
        }
      >
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <ProfileStepper
            currentStep={currentStep}
            onStepClick={setCurrentStep}
            completedSteps={completedSteps}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {currentStep === 'general' && (
              <GeneralStep profile={profile} errors={errors} onChange={updateProfile} />
            )}
            {currentStep === 'location' && (
              <LocationStep profile={profile} errors={errors} onChange={updateProfile} />
            )}
            {currentStep === 'pricing' && (
              <PricingStep profile={profile} errors={errors} onChange={updateProfile} />
            )}
            {currentStep === 'photos' && (
              <PhotosStep profile={profile} errors={errors} onChange={updateProfile} />
            )}
            {currentStep === 'services' && (
              <ServicesStep profile={profile} onChange={updateProfile} />
            )}

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={goPrev}
                disabled={stepIndex === 0}
                className="btn-secondary disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                Anterior
              </button>

              {!isLastStep ? (
                <button type="button" onClick={goNext} className="btn-primary">
                  Siguiente
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button type="button" onClick={handleSave} className="btn-primary">
                  <Check className="h-4 w-4" />
                  Finalizar perfil
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <MarketplacePreview profile={profile} progress={progress} />
          </div>
        </div>
      </DashboardLayout>

      <SaveBar
        isDirty={isDirty}
        isSaving={isSaving}
        showSuccess={showSuccess}
        onSave={handleSave}
      />
    </motion.div>
  )
}
