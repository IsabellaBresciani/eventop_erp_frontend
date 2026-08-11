import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import {
  createEmptyVenueService,
  formatPrice,
  getServiceCategoryLabel,
  getServicePricingModelLabel,
  SERVICE_CATEGORY_OPTIONS,
  SERVICE_PRICING_MODEL_OPTIONS,
} from '../../../data/salon-profile-defaults'
import type {
  SalonProfile,
  VenueService,
  VenueServiceCategory,
  VenueServicePricingModel,
  VenueServiceStatus,
} from '../../../types/salon-profile'
import { FormField, StepCard } from '../FormField'

interface ServicesStepProps {
  profile: SalonProfile
  onChange: (patch: Partial<SalonProfile>) => void
  embedded?: boolean
  hideLabels?: boolean
}

type ServiceDraft = VenueService

export function ServicesStep({
  profile,
  onChange,
  embedded,
  hideLabels,
}: ServicesStepProps) {
  const [draft, setDraft] = useState<ServiceDraft | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const currency = profile.currency

  const openCreate = () => {
    setFormError(null)
    setDraft(createEmptyVenueService())
  }

  const openEdit = (service: VenueService) => {
    setFormError(null)
    setDraft({ ...service })
  }

  const closeForm = () => {
    setDraft(null)
    setFormError(null)
  }

  const updateDraft = <K extends keyof ServiceDraft>(key: K, value: ServiceDraft[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const saveDraft = () => {
    if (!draft) return

    if (draft.name.trim().length < 2) {
      setFormError('Ingresá un nombre de servicio')
      return
    }
    if (draft.minQuantity < 0 || draft.maxQuantity < draft.minQuantity) {
      setFormError('La cantidad máxima debe ser mayor o igual a la mínima')
      return
    }
    if (draft.basePrice < 0) {
      setFormError('El precio base no puede ser negativo')
      return
    }

    const exists = profile.services.some((s) => s.id === draft.id)
    const nextServices = exists
      ? profile.services.map((s) => (s.id === draft.id ? draft : s))
      : [...profile.services, draft]

    onChange({ services: nextServices })
    closeForm()
  }

  const removeService = (id: number) => {
    onChange({ services: profile.services.filter((s) => s.id !== id) })
    if (draft?.id === id) closeForm()
  }

  const toggleStatus = (service: VenueService) => {
    const nextStatus: VenueServiceStatus = service.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    onChange({
      services: profile.services.map((s) =>
        s.id === service.id ? { ...s, status: nextStatus } : s,
      ),
    })
  }

  return (
    <StepCard title="Servicios" embedded={embedded}>
      <div className="space-y-5">
        <div className="flex items-center justify-end gap-3">
          {!draft && (
            <button type="button" onClick={openCreate} className="btn-primary py-2 text-sm">
              <Plus className="h-4 w-4" />
              Agregar servicio
            </button>
          )}
        </div>

        {draft && (
          <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/[0.03] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-slate-900">
                {profile.services.some((s) => s.id === draft.id)
                  ? 'Editar servicio'
                  : 'Nuevo servicio'}
              </h4>
              <button type="button" onClick={closeForm} className="btn-ghost py-1 text-xs">
                Cancelar
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Nombre" htmlFor="service-name" required hideLabel={hideLabels}>
                <input
                  id="service-name"
                  type="text"
                  value={draft.name}
                  onChange={(e) => updateDraft('name', e.target.value)}
                  placeholder="Ej: Catering completo"
                  className="input-field"
                />
              </FormField>

              <FormField label="Categoría" htmlFor="service-category" required hideLabel={hideLabels}>
                <select
                  id="service-category"
                  value={draft.category}
                  onChange={(e) =>
                    updateDraft('category', e.target.value as VenueServiceCategory)
                  }
                  className="input-field"
                >
                  {SERVICE_CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField label="Descripción" htmlFor="service-description" hideLabel={hideLabels}>
              <textarea
                id="service-description"
                rows={2}
                value={draft.description}
                onChange={(e) => updateDraft('description', e.target.value)}
                placeholder="Qué incluye el servicio"
                className="input-field resize-none"
              />
            </FormField>

            <FormField label="Términos y condiciones" htmlFor="service-terms" hideLabel={hideLabels}>
              <textarea
                id="service-terms"
                rows={2}
                value={draft.termsAndConditions}
                onChange={(e) => updateDraft('termsAndConditions', e.target.value)}
                placeholder="Condiciones de contratación, mínimos, etc."
                className="input-field resize-none"
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Modelo de precio" htmlFor="service-pricing" required hideLabel={hideLabels}>
                <select
                  id="service-pricing"
                  value={draft.pricingModel}
                  onChange={(e) =>
                    updateDraft('pricingModel', e.target.value as VenueServicePricingModel)
                  }
                  className="input-field"
                >
                  {SERVICE_PRICING_MODEL_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Precio base" htmlFor="service-base-price" required hideLabel={hideLabels}>
                <input
                  id="service-base-price"
                  type="number"
                  min={0}
                  step={100}
                  value={draft.basePrice}
                  onChange={(e) => updateDraft('basePrice', Number(e.target.value))}
                  className="input-field"
                />
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="Cantidad mínima" htmlFor="service-min-qty" hideLabel={hideLabels}>
                <input
                  id="service-min-qty"
                  type="number"
                  min={0}
                  value={draft.minQuantity}
                  onChange={(e) => updateDraft('minQuantity', Number(e.target.value))}
                  className="input-field"
                />
              </FormField>

              <FormField label="Cantidad máxima" htmlFor="service-max-qty" hideLabel={hideLabels}>
                <input
                  id="service-max-qty"
                  type="number"
                  min={0}
                  value={draft.maxQuantity}
                  onChange={(e) => updateDraft('maxQuantity', Number(e.target.value))}
                  className="input-field"
                />
              </FormField>

              <FormField label="Estado" htmlFor="service-status" hideLabel={hideLabels}>
                <select
                  id="service-status"
                  value={draft.status}
                  onChange={(e) =>
                    updateDraft('status', e.target.value as VenueServiceStatus)
                  }
                  className="input-field"
                >
                  <option value="ACTIVE">Activo</option>
                  <option value="INACTIVE">Inactivo</option>
                </select>
              </FormField>
            </div>

            {formError && <p className="text-xs text-red-500">{formError}</p>}

            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeForm} className="btn-secondary py-2 text-sm">
                Cancelar
              </button>
              <button type="button" onClick={saveDraft} className="btn-primary py-2 text-sm">
                Guardar servicio
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {profile.services.map((service) => {
            const active = service.status === 'ACTIVE'
            return (
              <div
                key={service.id}
                className={`rounded-xl border p-4 transition-colors ${
                  active
                    ? 'border-slate-200 bg-white'
                    : 'border-slate-100 bg-slate-50 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {service.name || 'Sin nombre'}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          active
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {active ? 'Activo' : 'Inactivo'}
                      </span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {getServiceCategoryLabel(service.category)}
                      </span>
                    </div>
                    {service.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {service.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs font-medium text-slate-600">
                      {formatPrice(service.basePrice, currency)}
                      <span className="font-normal text-slate-400">
                        {' '}
                        · {getServicePricingModelLabel(service.pricingModel)}
                        {' · '}
                        Cant. {service.minQuantity}–{service.maxQuantity}
                      </span>
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleStatus(service)}
                      className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 hover:bg-slate-100"
                      title={active ? 'Desactivar' : 'Activar'}
                    >
                      {active ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(service)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-primary/5 hover:text-primary"
                      aria-label="Editar servicio"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeService(service.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                      aria-label="Eliminar servicio"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {profile.services.length === 0 && !draft && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-10 text-center">
            <p className="text-sm font-medium text-slate-700">Sin servicios cargados</p>
            <p className="mt-1 text-xs text-slate-500">
              Agregá catering, DJ, decoración u otros servicios de tu salón.
            </p>
            <button type="button" onClick={openCreate} className="btn-primary mt-4 py-2 text-sm">
              <Plus className="h-4 w-4" />
              Agregar el primero
            </button>
          </div>
        )}
      </div>
    </StepCard>
  )
}
