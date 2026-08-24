import { useMemo, useState } from 'react'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { DashboardLogo } from '../dashboard/DashboardLogo'
import { EventSummaryPanel } from './EventSummaryPanel'
import { WizardStepBody } from './WizardSteps'
import {
  buildCalendarEventFromWizard,
  canOpenStep,
  createWizardDraft,
  isStepValid,
  servicesTotal,
  stepErrors,
  suggestedPayments,
} from '../../data/event-wizard'
import { WIZARD_STEPS } from '../../types/event-wizard'
import type { CalendarEvent } from '../../types/dashboard'
import type { EventWizardDraft, WizardStepId } from '../../types/event-wizard'

interface EventWizardProps {
  defaultDate?: string | null
  onCancel: () => void
  onCreate: (event: CalendarEvent) => void
}

export function EventWizard({ defaultDate, onCancel, onCreate }: EventWizardProps) {
  const [draft, setDraft] = useState<EventWizardDraft>(() => createWizardDraft(defaultDate))
  const [stepIndex, setStepIndex] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const step = WIZARD_STEPS[stepIndex]
  const isLast = stepIndex === WIZARD_STEPS.length - 1
  const total = useMemo(() => servicesTotal(draft.selectedServices), [draft.selectedServices])

  const patchDraft = (patch: Partial<EventWizardDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
    setErrors({})
  }

  const goTo = (index: number) => {
    if (index < 0 || index >= WIZARD_STEPS.length) return
    if (index > stepIndex && !canOpenStep(index, draft)) {
      setErrors(stepErrors(step.id, draft))
      return
    }
    if (WIZARD_STEPS[index].id === 'payments' && draft.payments.length === 0) {
      setDraft((current) => ({
        ...current,
        payments: suggestedPayments(servicesTotal(current.selectedServices), current.startDate),
      }))
    }
    setErrors({})
    setStepIndex(index)
  }

  const handleNext = () => {
    if (!isStepValid(step.id, draft)) {
      setErrors(stepErrors(step.id, draft))
      return
    }
    if (isLast) {
      onCreate(buildCalendarEventFromWizard(draft))
      return
    }
    goTo(stepIndex + 1)
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--mk-bg, #f5f5f7)' }}>
      <header
        className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur-xl"
        style={{ borderColor: 'var(--mk-border)' }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <DashboardLogo compact />
            <div className="hidden sm:block">
              <p className="dash-section-label">Nuevo evento</p>
              <h1 className="text-sm font-semibold text-ink">{step.label}</h1>
            </div>
          </div>
          <p className="text-xs font-medium text-ink-muted">
            Paso {stepIndex + 1} de {WIZARD_STEPS.length}
          </p>
          <button type="button" onClick={onCancel} className="dash-btn-secondary px-4 py-2 text-sm">
            Cancelar
          </button>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)_300px] lg:items-start">
        <nav className="flex gap-2 overflow-x-auto lg:sticky lg:top-24 lg:flex-col lg:overflow-visible">
          {WIZARD_STEPS.map((item, index) => {
            const active = index === stepIndex
            const done = index < stepIndex
            const reachable = index <= stepIndex || canOpenStep(index, draft)
            return (
              <button
                key={item.id}
                type="button"
                disabled={!reachable}
                onClick={() => goTo(index)}
                className={`flex min-w-[9.5rem] items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors lg:min-w-0 ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : reachable
                      ? 'text-ink hover:bg-black/[0.03]'
                      : 'cursor-not-allowed text-ink-muted/50'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    active
                      ? 'bg-primary text-white'
                      : done
                        ? 'bg-emerald-500 text-white'
                        : 'bg-black/[0.06] text-ink-muted'
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{item.label}</span>
                  <span className="hidden truncate text-[11px] opacity-70 lg:block">{item.hint}</span>
                </span>
              </button>
            )
          })}
        </nav>

        <section className="dash-card p-5 sm:p-7">
          <div className="mb-6">
            <p className="dash-section-label">Paso {stepIndex + 1}</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">{step.label}</h2>
            <p className="mt-1 text-sm text-ink-muted">{step.hint}</p>
          </div>
          <WizardStepBody
            step={step.id}
            draft={draft}
            errors={errors}
            onChange={patchDraft}
            onJump={(id: WizardStepId) => {
              const index = WIZARD_STEPS.findIndex((item) => item.id === id)
              if (index >= 0) goTo(index)
            }}
          />
        </section>

        <EventSummaryPanel draft={draft} />
      </div>

      <footer
        className="sticky bottom-0 border-t bg-white/95 backdrop-blur-xl"
        style={{ borderColor: 'var(--mk-border)' }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => goTo(stepIndex - 1)}
            disabled={stepIndex === 0}
            className="dash-btn-secondary px-4 py-2 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Atrás
          </button>
          <p className="hidden text-sm font-medium text-ink-muted sm:block">
            Total{' '}
            {new Intl.NumberFormat('es-AR', {
              style: 'currency',
              currency: 'ARS',
              maximumFractionDigits: 0,
            }).format(total)}
          </p>
          <button type="button" onClick={handleNext} className="dash-btn-primary px-5 py-2">
            {isLast ? 'Crear evento' : 'Continuar'}
            {!isLast && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </footer>
    </div>
  )
}
