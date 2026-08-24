import { useMemo, useState } from 'react'
import {
  AlertCircle,
  Check,
  Mail,
  Minus,
  Plus,
  Search,
  Trash2,
  UserPlus,
} from 'lucide-react'
import { FormField } from '../profile/FormField'
import { formatCurrency } from '../../data/dashboard'
import {
  EVENT_TYPE_OPTIONS,
  VENUE_SPACES,
  getServiceCatalog,
  isValidEmail,
  lookupClient,
  paymentsTotal,
  servicesTotal,
  suggestedPayments,
} from '../../data/event-wizard'
import type { CatalogService, EventWizardDraft, WizardStepId } from '../../types/event-wizard'

interface StepProps {
  draft: EventWizardDraft
  errors: Record<string, string>
  onChange: (patch: Partial<EventWizardDraft>) => void
}

export function WizardStepBody({
  step,
  draft,
  errors,
  onChange,
  onJump,
}: StepProps & { step: WizardStepId; onJump: (step: WizardStepId) => void }) {
  switch (step) {
    case 'client':
      return <ClientStep draft={draft} errors={errors} onChange={onChange} />
    case 'event':
      return <EventInfoStep draft={draft} errors={errors} onChange={onChange} />
    case 'schedule':
      return <DateVenueStep draft={draft} errors={errors} onChange={onChange} />
    case 'services':
      return <ServicesStep draft={draft} errors={errors} onChange={onChange} />
    case 'staff':
      return <StaffStep draft={draft} errors={errors} onChange={onChange} />
    case 'payments':
      return <PaymentPlanStep draft={draft} errors={errors} onChange={onChange} />
    case 'details':
      return <DetailsStep draft={draft} errors={errors} onChange={onChange} />
    case 'confirm':
      return <ConfirmStep draft={draft} errors={errors} onChange={onChange} onJump={onJump} />
    default:
      return null
  }
}

function ClientStep({ draft, errors, onChange }: StepProps) {
  const search = () => {
    const email = draft.clientEmail.trim()
    if (!isValidEmail(email)) {
      onChange({ clientLookup: 'idle', client: null })
      return
    }
    const result = lookupClient(email)
    onChange({
      clientEmail: email.toLowerCase(),
      clientLookup: result.status,
      client: result.client,
      inviteName: result.client ? '' : draft.inviteName,
    })
  }

  return (
    <div className="space-y-5">
      <FormField
        label="Email del cliente"
        htmlFor="client-email"
        required
        error={errors.clientEmail}
        hint="Si el correo ya existe, se completa el cliente. Si no, se envía una invitación."
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              id="client-email"
              type="email"
              value={draft.clientEmail}
              onChange={(e) =>
                onChange({
                  clientEmail: e.target.value,
                  clientLookup: 'idle',
                  client: null,
                })
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  search()
                }
              }}
              placeholder="cliente@email.com"
              className="input-field pl-10"
            />
          </div>
          <button type="button" onClick={search} className="dash-btn-primary shrink-0 px-5">
            <Search className="h-4 w-4" />
            Buscar
          </button>
        </div>
      </FormField>

      {draft.clientLookup === 'found' && draft.client && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
            <Check className="h-4 w-4" />
            Cliente encontrado
          </div>
          <p className="mt-2 text-base font-semibold text-ink">{draft.client.name}</p>
          <p className="text-sm text-ink-muted">{draft.client.email}</p>
          {draft.client.phone && <p className="text-sm text-ink-muted">{draft.client.phone}</p>}
        </div>
      )}

      {draft.clientLookup === 'invite' && (
        <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
          <div className="flex items-start gap-2">
            <UserPlus className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Este email no está registrado</p>
              <p className="mt-1 text-sm text-amber-800">
                Podés continuar. Al crear el evento le enviaremos una invitación por correo para
                que se registre en Eventop.
              </p>
            </div>
          </div>
          <FormField
            label="Nombre del cliente"
            htmlFor="invite-name"
            hint="Opcional, para identificar el evento"
          >
            <input
              id="invite-name"
              type="text"
              value={draft.inviteName}
              onChange={(e) => onChange({ inviteName: e.target.value })}
              placeholder="Nombre y apellido"
              className="input-field"
            />
          </FormField>
        </div>
      )}
    </div>
  )
}

function EventInfoStep({ draft, errors, onChange }: StepProps) {
  return (
    <div className="space-y-5">
      <FormField label="Nombre del evento" htmlFor="event-name" required error={errors.eventName}>
        <input
          id="event-name"
          type="text"
          value={draft.eventName}
          onChange={(e) => onChange({ eventName: e.target.value })}
          placeholder="Cumpleaños de Valentina"
          className="input-field"
        />
      </FormField>

      <FormField label="Tipo de evento" htmlFor="event-type" required error={errors.eventType}>
        <select
          id="event-type"
          value={draft.eventType}
          onChange={(e) => onChange({ eventType: e.target.value })}
          className="input-field"
        >
          <option value="">Seleccioná un tipo</option>
          {EVENT_TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Cantidad de invitados" htmlFor="guests" error={errors.guests} hint="Opcional">
        <input
          id="guests"
          type="number"
          min={1}
          value={draft.guests}
          onChange={(e) => onChange({ guests: e.target.value })}
          placeholder="80"
          className="input-field"
        />
      </FormField>

      <FormField
        label="Notas internas"
        htmlFor="internal-notes"
        hint="Referencias o aclaraciones que no se imprimen"
      >
        <textarea
          id="internal-notes"
          value={draft.internalNotes}
          onChange={(e) => onChange({ internalNotes: e.target.value })}
          rows={4}
          placeholder="Preferencias del cliente, accesos, etc."
          className="input-field resize-none"
        />
      </FormField>
    </div>
  )
}

function DateVenueStep({ draft, errors, onChange }: StepProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Fecha de inicio" htmlFor="start-date" required error={errors.startDate}>
          <input
            id="start-date"
            type="date"
            value={draft.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
            className="input-field"
          />
        </FormField>
        <FormField
          label="Fecha de fin"
          htmlFor="end-date"
          error={errors.endDate}
          hint="Opcional, para eventos de más de un día"
        >
          <input
            id="end-date"
            type="date"
            value={draft.endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
            className="input-field"
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Desde" htmlFor="start-time" required error={errors.startTime}>
          <input
            id="start-time"
            type="time"
            value={draft.startTime}
            onChange={(e) => onChange({ startTime: e.target.value })}
            className="input-field"
          />
        </FormField>
        <FormField label="Hasta" htmlFor="end-time" required error={errors.endTime}>
          <input
            id="end-time"
            type="time"
            value={draft.endTime}
            onChange={(e) => onChange({ endTime: e.target.value })}
            className="input-field"
          />
        </FormField>
      </div>

      <FormField label="Salón / Espacio" required error={errors.venueId}>
        <div className="grid gap-2 sm:grid-cols-2">
          {VENUE_SPACES.map((space) => {
            const selected = draft.venueId === space.id
            return (
              <button
                key={space.id}
                type="button"
                onClick={() => onChange({ venueId: space.id })}
                className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                  selected ? 'border-primary/40 bg-primary/5' : 'hover:bg-black/[0.02]'
                }`}
                style={{ borderColor: selected ? undefined : 'var(--mk-border)' }}
              >
                <p className="text-sm font-semibold text-ink">{space.name}</p>
                <p className="mt-0.5 text-xs text-ink-muted">Hasta {space.capacity} personas</p>
              </button>
            )
          })}
        </div>
      </FormField>
    </div>
  )
}

function ServicesStep({ draft, onChange }: StepProps) {
  const [query, setQuery] = useState('')
  const catalog = useMemo(() => getServiceCatalog(), [])
  const selectedIds = new Set(draft.selectedServices.map((line) => line.catalogId))

  const filtered = catalog.filter((item) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return `${item.name} ${item.provider}`.toLowerCase().includes(q)
  })

  const toggle = (item: CatalogService) => {
    if (selectedIds.has(item.id)) {
      onChange({
        selectedServices: draft.selectedServices.filter((line) => line.catalogId !== item.id),
      })
      return
    }
    const guests = Number(draft.guests)
    const quantity = item.unitLabel === 'por persona' && guests > 0 ? guests : 1
    onChange({
      selectedServices: [
        ...draft.selectedServices,
        {
          catalogId: item.id,
          name: item.name,
          provider: item.provider,
          unitPrice: item.unitPrice,
          quantity,
        },
      ],
    })
  }

  const updateLine = (
    catalogId: string,
    patch: Partial<EventWizardDraft['selectedServices'][number]>,
  ) => {
    onChange({
      selectedServices: draft.selectedServices.map((line) =>
        line.catalogId === catalogId ? { ...line, ...patch } : line,
      ),
    })
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar servicios"
          className="input-field pl-10"
        />
      </div>

      {draft.selectedServices.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-ink">Incluidos</h3>
          <ul className="space-y-3">
            {draft.selectedServices.map((line) => (
              <li
                key={line.catalogId}
                className="rounded-2xl border p-4"
                style={{ borderColor: 'var(--mk-border)' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{line.name}</p>
                    <p className="text-xs text-ink-muted">Proveedor: {line.provider}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        selectedServices: draft.selectedServices.filter(
                          (item) => item.catalogId !== line.catalogId,
                        ),
                      })
                    }
                    className="rounded-full p-2 text-ink-muted hover:bg-black/[0.04] hover:text-ink"
                    aria-label="Quitar servicio"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-semibold text-ink-muted">
                    Precio
                    <input
                      type="number"
                      min={0}
                      value={line.unitPrice}
                      onChange={(e) =>
                        updateLine(line.catalogId, { unitPrice: Number(e.target.value) || 0 })
                      }
                      className="input-field mt-1"
                    />
                  </label>
                  <label className="text-xs font-semibold text-ink-muted">
                    Cantidad
                    <input
                      type="number"
                      min={1}
                      value={line.quantity}
                      onChange={(e) =>
                        updateLine(line.catalogId, {
                          quantity: Math.max(1, Number(e.target.value) || 1),
                        })
                      }
                      className="input-field mt-1"
                    />
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h3 className="mb-3 text-sm font-semibold text-ink">Disponibles</h3>
        <ul className="space-y-2">
          {filtered.map((item) => {
            const selected = selectedIds.has(item.id)
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => toggle(item)}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                    selected ? 'border-primary/35 bg-primary/5' : 'hover:bg-black/[0.02]'
                  }`}
                  style={{ borderColor: selected ? undefined : 'var(--mk-border)' }}
                >
                  <span>
                    <span className="block text-sm font-medium text-ink">{item.name}</span>
                    <span className="block text-xs text-ink-muted">
                      {item.provider} · {item.unitLabel}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-ink">
                    {formatCurrency(item.unitPrice)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

function StaffStep({ draft, onChange }: StepProps) {
  const [newType, setNewType] = useState('')

  const updateQty = (type: string, quantity: number) => {
    onChange({
      staff: draft.staff.map((line) =>
        line.type === type ? { ...line, quantity: Math.max(0, quantity) } : line,
      ),
    })
  }

  const addType = () => {
    const name = newType.trim()
    if (!name) return
    if (draft.staff.some((line) => line.type.toLowerCase() === name.toLowerCase())) {
      setNewType('')
      return
    }
    onChange({ staff: [...draft.staff, { type: name, quantity: 1 }] })
    setNewType('')
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-muted">
        Indicá cuántos prestadores de cada tipo necesitás para el evento.
      </p>
      <ul className="space-y-2">
        {draft.staff.map((line) => (
          <li
            key={line.type}
            className="flex items-center justify-between gap-3 rounded-2xl border px-4 py-3"
            style={{ borderColor: 'var(--mk-border)' }}
          >
            <span className="text-sm font-medium text-ink">{line.type}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-full p-2 text-ink-muted hover:bg-black/[0.04]"
                onClick={() => updateQty(line.type, line.quantity - 1)}
                aria-label={`Menos ${line.type}`}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-semibold">{line.quantity}</span>
              <button
                type="button"
                className="rounded-full p-2 text-ink-muted hover:bg-black/[0.04]"
                onClick={() => updateQty(line.type, line.quantity + 1)}
                aria-label={`Más ${line.type}`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addType()
            }
          }}
          placeholder="Nuevo tipo de prestador"
          className="input-field"
        />
        <button type="button" onClick={addType} className="dash-btn-secondary shrink-0">
          <Plus className="h-4 w-4" />
          Agregar
        </button>
      </div>
    </div>
  )
}

function PaymentPlanStep({ draft, errors, onChange }: StepProps) {
  const total = servicesTotal(draft.selectedServices)
  const scheduled = paymentsTotal(draft.payments)

  const update = (id: string, patch: Partial<EventWizardDraft['payments'][number]>) => {
    onChange({
      payments: draft.payments.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })
  }

  const addInstallment = () => {
    const cuotaCount = draft.payments.filter((item) =>
      item.concept.toLowerCase().includes('cuota'),
    ).length
    onChange({
      payments: [
        ...draft.payments,
        {
          id: `pay-${Date.now()}`,
          concept: `Cuota ${cuotaCount + 1}`,
          amount: 0,
          date: draft.startDate,
        },
      ],
    })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-muted">
        Armá el esquema de cobros. El total del evento es {formatCurrency(total)}.
      </p>

      {errors.payments && (
        <p className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          {errors.payments}
        </p>
      )}

      <ul className="space-y-3">
        {draft.payments.map((item) => (
          <li
            key={item.id}
            className="grid gap-3 rounded-2xl border p-4 sm:grid-cols-[1fr_8rem_9rem_auto]"
            style={{ borderColor: 'var(--mk-border)' }}
          >
            <input
              type="text"
              value={item.concept}
              onChange={(e) => update(item.id, { concept: e.target.value })}
              className="input-field"
              placeholder="Concepto"
            />
            <input
              type="number"
              min={0}
              value={item.amount}
              onChange={(e) => update(item.id, { amount: Number(e.target.value) || 0 })}
              className="input-field"
            />
            <input
              type="date"
              value={item.date}
              onChange={(e) => update(item.id, { date: e.target.value })}
              className="input-field"
            />
            <button
              type="button"
              onClick={() =>
                onChange({ payments: draft.payments.filter((row) => row.id !== item.id) })
              }
              className="justify-self-end rounded-full p-2 text-ink-muted hover:bg-black/[0.04]"
              aria-label="Quitar cobro"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={addInstallment} className="dash-btn-secondary">
          <Plus className="h-4 w-4" />
          Agregar cuota
        </button>
        <button
          type="button"
          onClick={() => onChange({ payments: suggestedPayments(total, draft.startDate) })}
          className="dash-btn-secondary"
        >
          Ajustar seña y saldo al total
        </button>
      </div>

      {draft.payments.length > 0 && scheduled !== total && (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
          La suma del plan ({formatCurrency(scheduled)}) no coincide con el total (
          {formatCurrency(total)}).
        </p>
      )}
    </div>
  )
}

function DetailsStep({ draft, onChange }: StepProps) {
  return (
    <FormField
      label="Descripción pública"
      htmlFor="public-description"
      hint="Cronograma, ambientación y observaciones visibles para el cliente"
    >
      <textarea
        id="public-description"
        value={draft.publicDescription}
        onChange={(e) => onChange({ publicDescription: e.target.value })}
        rows={10}
        placeholder="18:00 recepción · 20:00 cena · 22:00 pista. Ambientación en lila y blanco."
        className="input-field resize-none"
      />
    </FormField>
  )
}

function ConfirmStep({
  draft,
  onJump,
}: StepProps & { onJump: (step: WizardStepId) => void }) {
  const total = servicesTotal(draft.selectedServices)
  const clientName = draft.client?.name || draft.inviteName || draft.clientEmail
  const venue = VENUE_SPACES.find((space) => space.id === draft.venueId)?.name

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-muted">
        Revisá los datos antes de crear el evento. Podés volver a cualquier paso para modificarlos.
      </p>

      <ConfirmCard title="Cliente" onEdit={() => onJump('client')}>
        <p className="font-medium text-ink">{clientName}</p>
        <p className="text-sm text-ink-muted">{draft.clientEmail}</p>
        {draft.clientLookup === 'invite' && (
          <p className="mt-2 text-xs text-amber-700">Se enviará invitación de registro.</p>
        )}
      </ConfirmCard>

      <ConfirmCard title="Evento" onEdit={() => onJump('event')}>
        <p className="font-medium text-ink">{draft.eventName}</p>
        <p className="text-sm text-ink-muted">
          {draft.eventType}
          {draft.guests ? ` · ${draft.guests} invitados` : ''}
        </p>
      </ConfirmCard>

      <ConfirmCard title="Fecha y salón" onEdit={() => onJump('schedule')}>
        <p className="font-medium text-ink">
          {draft.startDate}
          {draft.endDate ? ` → ${draft.endDate}` : ''} · {draft.startTime} a {draft.endTime}
        </p>
        <p className="text-sm text-ink-muted">{venue}</p>
      </ConfirmCard>

      <ConfirmCard title="Servicios" onEdit={() => onJump('services')}>
        {draft.selectedServices.length === 0 ? (
          <p className="text-sm text-ink-muted">Sin servicios adicionales</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {draft.selectedServices.map((line) => (
              <li key={line.catalogId} className="flex justify-between gap-3">
                <span>
                  {line.name} × {line.quantity}
                </span>
                <span>{formatCurrency(line.unitPrice * line.quantity)}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-base font-semibold text-primary">Total {formatCurrency(total)}</p>
      </ConfirmCard>
    </div>
  )
}

function ConfirmCard({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--mk-border)' }}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <button type="button" onClick={onEdit} className="text-xs font-semibold text-primary">
          Modificar
        </button>
      </div>
      {children}
    </div>
  )
}
