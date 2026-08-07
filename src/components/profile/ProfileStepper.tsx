import { Check } from 'lucide-react'
import { PROFILE_STEPS } from '../../data/salon-profile-defaults'
import type { ProfileStep } from '../../types/salon-profile'

interface ProfileStepperProps {
  currentStep: ProfileStep
  onStepClick: (step: ProfileStep) => void
  completedSteps: Set<ProfileStep>
}

export function ProfileStepper({ currentStep, onStepClick, completedSteps }: ProfileStepperProps) {
  const currentIndex = PROFILE_STEPS.findIndex((s) => s.id === currentStep)

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-center gap-0">
        {PROFILE_STEPS.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = completedSteps.has(step.id)
          const isPast = index < currentIndex

          return (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className="group flex flex-col items-center gap-1.5 px-3 py-2 sm:px-5"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-glow'
                      : isCompleted || isPast
                        ? 'bg-primary/10 text-primary'
                        : 'bg-surface text-slate-400 group-hover:bg-primary/5 group-hover:text-primary'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span
                  className={`text-xs font-medium whitespace-nowrap ${
                    isActive ? 'text-primary' : 'text-slate-500 group-hover:text-slate-700'
                  }`}
                >
                  {step.label}
                </span>
              </button>

              {index < PROFILE_STEPS.length - 1 && (
                <div
                  className={`mb-5 h-0.5 w-8 sm:w-12 ${
                    isPast || isCompleted ? 'bg-primary/30' : 'bg-surface-border'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
