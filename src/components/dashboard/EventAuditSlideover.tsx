import { AnimatePresence, motion } from 'framer-motion'
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Mail,
  Phone,
  QrCode,
  Users,
  X,
} from 'lucide-react'
import { type ComponentType, type ReactNode, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EVENT_STATUS_CONFIG, formatCurrency } from '../../data/dashboard'
import {
  getEmployeeFullName,
  loadEmployees,
} from '../../data/employees'
import { getAuthSession } from '../../lib/auth-session'
import {
  SERVICE_STATUS_CONFIG,
  STATUS_TRANSITIONS,
} from '../../data/event-details'
import type { CalendarEvent } from '../../types/dashboard'

interface EventAuditSlideoverProps {
  event: CalendarEvent | null
  isOpen: boolean
  onClose: () => void
  onEventUpdate?: (event: CalendarEvent) => void
}

export function EventAuditSlideover({
  event,
  isOpen,
  onClose,
  onEventUpdate,
}: EventAuditSlideoverProps) {
  const [localEvent, setLocalEvent] = useState<CalendarEvent | null>(event)
  const [auditExpanded, setAuditExpanded] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (event) {
      setLocalEvent(event)
      setAuditExpanded(false)
    }
  }, [event])

  const current = localEvent ?? event
  if (!current) return null

  const session = getAuthSession()
  const isEmployeeView = session?.role === 'employee'

  const status = EVENT_STATUS_CONFIG[current.status]
  const balance = current.totalAmount - current.depositPaid
  const transition = STATUS_TRANSITIONS[current.status]
  const attendancePct = Math.round((current.confirmedGuests / current.maxCapacity) * 100)

  const handleCopy = (value: string, key: string) => {
    navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleStatusTransition = () => {
    if (!transition) return
    const updated: CalendarEvent = {
      ...current,
      status: transition.next,
      auditLog: [
        {
          id: `al-${Date.now()}`,
          timestamp: new Date().toISOString(),
          user: getAuthSession()?.name ?? 'Administrador',
          action: `Estado → ${EVENT_STATUS_CONFIG[transition.next].label}`,
        },
        ...current.auditLog,
      ],
    }
    setLocalEvent(updated)
    onEventUpdate?.(updated)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-surface-border bg-white shadow-2xl"
          >
            {/* Header de Estado */}
            <div className="border-b border-surface-border px-6 py-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span
                    className="inline-flex rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: status.color }}
                  >
                    {status.label}
                  </span>
                  <p className="mt-2 font-mono text-xs text-slate-400">
                    {current.id.toUpperCase()} · {formatEventDate(current.date)}
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">{current.clientName}</h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {!isEmployeeView && (
                <Section title="Información del Cliente">
                  <ContactRow
                    icon={Phone}
                    value={current.phone}
                    copied={copied === 'phone'}
                    onCopy={() => handleCopy(current.phone, 'phone')}
                  />
                  <ContactRow
                    icon={Mail}
                    value={current.email}
                    copied={copied === 'email'}
                    onCopy={() => handleCopy(current.email, 'email')}
                  />
                  {current.isRecurring && (
                    <div className="mt-2 rounded-lg bg-primary/5 px-3 py-2 text-xs text-primary">
                      Cliente recurrente — {current.auditLog.find((l) => l.action.includes('recurrente'))?.detail ?? 'Historial positivo en el salón'}
                    </div>
                  )}
                </Section>
              )}

              {/* Logística */}
              <Section title="Detalles Logísticos y de Servicio">
                <div className="mb-4 inline-flex items-center gap-2 rounded-xl bg-surface px-3 py-2">
                  <span className="text-lg">{getEventEmoji(current.eventType)}</span>
                  <span className="text-sm font-semibold text-slate-800">{current.eventType}</span>
                </div>

                <div className="rounded-xl border border-surface-border bg-surface/40 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>
                      {current.startTime} – {current.endTime}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    + {current.bufferHours}h buffer de limpieza aplicado automáticamente
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  {current.services.length > 0 ? (
                    current.services.map((service) => {
                      const svcStatus = SERVICE_STATUS_CONFIG[service.status]
                      return (
                        <div
                          key={service.name}
                          className="flex items-center justify-between rounded-lg border border-surface-border px-3 py-2.5"
                        >
                          <span className="text-sm text-slate-700">{service.name}</span>
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                            style={{ backgroundColor: svcStatus.color }}
                          >
                            {svcStatus.label}
                          </span>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm text-slate-400">Sin servicios adicionales</p>
                  )}
                </div>
              </Section>

              {getAuthSession()?.role !== 'employee' && (
                <Section title="Equipo asignado">
                  <div className="space-y-2">
                    {loadEmployees()
                      .filter((e) => e.active)
                      .map((employee) => {
                        const assigned = (current.assignedEmployeeIds ?? []).includes(employee.id)
                        return (
                          <label
                            key={employee.id}
                            className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2.5 transition-colors ${
                              assigned
                                ? 'border-primary/25 bg-primary/5'
                                : 'border-surface-border hover:bg-surface/40'
                            }`}
                          >
                            <span className="text-sm font-medium text-slate-700">
                              {getEmployeeFullName(employee)}
                            </span>
                            <input
                              type="checkbox"
                              checked={assigned}
                              onChange={() => {
                                const ids = current.assignedEmployeeIds ?? []
                                const nextIds = assigned
                                  ? ids.filter((id) => id !== employee.id)
                                  : [...ids, employee.id]
                                const updated: CalendarEvent = {
                                  ...current,
                                  assignedEmployeeIds: nextIds,
                                  auditLog: [
                                    {
                                      id: `al-${Date.now()}`,
                                      timestamp: new Date().toISOString(),
                                      user: getAuthSession()?.name ?? 'Administrador',
                                      action: assigned
                                        ? 'Empleado removido del evento'
                                        : 'Empleado asignado al evento',
                                      detail: getEmployeeFullName(employee),
                                    },
                                    ...current.auditLog,
                                  ],
                                }
                                setLocalEvent(updated)
                                onEventUpdate?.(updated)
                              }}
                              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                            />
                          </label>
                        )
                      })}
                  </div>
                  {loadEmployees().filter((e) => e.active).length === 0 && (
                    <p className="text-sm text-slate-400">
                      No hay empleados activos. Agregalos en la sección Empleados.
                    </p>
                  )}
                </Section>
              )}

              {/* Financiero */}
              {!isEmployeeView && (
              <Section title="Panel Financiero y Pagos">
                <div className="space-y-2.5 rounded-xl border border-surface-border bg-surface/40 p-4">
                  <FinancialRow label="Monto total" value={formatCurrency(current.totalAmount)} bold />
                  {current.depositPaid > 0 && (
                    <FinancialRow
                      label={`Seña (${current.depositMethod ?? '—'})`}
                      value={formatCurrency(current.depositPaid)}
                      sub={current.depositDate ? formatShortDate(current.depositDate) : undefined}
                    />
                  )}
                  <FinancialRow
                    label="Saldo pendiente"
                    value={formatCurrency(balance)}
                    highlight={balance > 0}
                  />
                </div>

                {current.payments.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Historial de pagos
                    </p>
                    <div className="space-y-2">
                      {current.payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between rounded-lg border border-surface-border px-3 py-2"
                        >
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {formatCurrency(payment.amount)}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {formatShortDate(payment.date)} · {payment.method}
                              {payment.note && ` · ${payment.note}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
              )}

              {/* Invitados */}
              {!isEmployeeView && (
              <Section title="Ecosistema de Invitados">
                <div className="rounded-xl border border-surface-border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Users className="h-4 w-4 text-primary" />
                      <span>Confirmados vs. capacidad</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {current.confirmedGuests}/{current.maxCapacity}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-surface">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary-800 transition-all"
                      style={{ width: `${attendancePct}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-right text-xs text-slate-400">{attendancePct}% confirmado</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <DocButton icon={FileText} label="Presupuesto PDF" sub="RF-006" />
                  <Link
                    to={`/dashboard/invitaciones/${current.id}`}
                    className="flex flex-col items-center gap-1 rounded-xl border border-surface-border bg-white px-3 py-3 transition-all hover:border-primary/30 hover:bg-primary/5"
                  >
                    <ExternalLink className="h-5 w-5 text-primary" />
                    <span className="text-[11px] font-semibold text-slate-800">Editar Invitación</span>
                    <span className="text-[9px] text-slate-400">RF-201</span>
                  </Link>
                </div>

                <Link
                  to="/dashboard/checkin"
                  className="btn-secondary mt-3 flex w-full items-center justify-center gap-2 py-2.5 text-xs"
                >
                  <QrCode className="h-4 w-4" />
                  Lista de invitados y control QR
                </Link>
              </Section>
              )}

              {/* Log de Auditoría */}
              {!isEmployeeView && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setAuditExpanded(!auditExpanded)}
                  className="flex w-full items-center justify-between rounded-xl border border-surface-border bg-surface/30 px-4 py-3 text-left transition-colors hover:bg-surface/60"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Log de Auditoría ({current.auditLog.length})
                  </span>
                  {auditExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </button>

                <AnimatePresence>
                  {auditExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0 border-x border-b border-surface-border rounded-b-xl">
                        {current.auditLog.map((entry, i) => (
                          <div
                            key={entry.id}
                            className={`px-4 py-3 ${i < current.auditLog.length - 1 ? 'border-b border-surface-border' : ''}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium text-slate-800">{entry.action}</p>
                              <span className="shrink-0 text-[10px] text-slate-400">
                                {formatTimestamp(entry.timestamp)}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-slate-500">{entry.user}</p>
                            {entry.detail && (
                              <p className="mt-1 text-xs text-slate-400">{entry.detail}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              )}
            </div>

            {/* CTA */}
            {!isEmployeeView && (
            <div className="border-t border-surface-border px-6 py-4">
              {transition ? (
                <button type="button" onClick={handleStatusTransition} className="btn-primary w-full">
                  {transition.label}
                </button>
              ) : (
                <Link
                  to={`/dashboard/invitaciones/${current.id}`}
                  className="btn-primary w-full"
                >
                  <ExternalLink className="h-4 w-4" />
                  Editar Invitación Virtual
                </Link>
              )}
              <p className="mt-3 text-center text-[11px] text-slate-400">
                Ficha de Auditoría · RF-005 · RF-007 · RF-012
              </p>
            </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-6 first:mt-0">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </h3>
      {children}
    </div>
  )
}

function ContactRow({
  icon: Icon,
  value,
  copied,
  onCopy,
}: {
  icon: ComponentType<{ className?: string }>
  value: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="flex items-center justify-between rounded-lg py-1.5">
      <div className="flex items-center gap-2 text-sm text-slate-700">
        <Icon className="h-3.5 w-3.5 text-slate-400" />
        {value}
      </div>
      <button
        type="button"
        onClick={onCopy}
        className={`rounded p-1 transition-colors ${
          copied ? 'text-emerald-500' : 'text-slate-400 hover:bg-primary/5 hover:text-primary'
        }`}
        aria-label="Copiar"
      >
        <Copy className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

function FinancialRow({
  label,
  value,
  bold,
  highlight,
  sub,
}: {
  label: string
  value: string
  bold?: boolean
  highlight?: boolean
  sub?: string
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div>
        <span className="text-slate-500">{label}</span>
        {sub && <p className="text-[10px] text-slate-400">{sub}</p>}
      </div>
      <span
        className={`${bold ? 'text-base font-bold text-slate-900' : 'text-slate-700'} ${
          highlight ? 'font-semibold text-red-500' : ''
        }`}
      >
        {value}
      </span>
    </div>
  )
}

function DocButton({
  icon: Icon,
  label,
  sub,
  disabled,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  sub: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="flex flex-col items-center gap-1 rounded-xl border border-surface-border bg-white px-3 py-3 transition-all hover:border-primary/30 hover:bg-primary/5 disabled:opacity-40"
    >
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-[11px] font-semibold text-slate-800">{label}</span>
      <span className="text-[9px] text-slate-400">{sub}</span>
      <Download className="h-3 w-3 text-slate-300" />
    </button>
  )
}

function formatEventDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatShortDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatTimestamp(ts: string): string {
  return new Date(ts).toLocaleString('es-AR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getEventEmoji(type: string): string {
  if (type.includes('Boda')) return '💍'
  if (type.includes('Infantil') || type.includes('Cumpleaños')) return '🎂'
  if (type.includes('XV')) return '👑'
  if (type.includes('Corporativo')) return '🏢'
  return '🎉'
}
