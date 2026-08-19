import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  CalendarRange,
  Clock3,
  Filter,
  GitBranch,
  LayoutDashboard,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { type ComponentType, useMemo, useState } from 'react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { formatCurrency } from '../data/dashboard'
import {
  EVENTS_BY_MONTH,
  PENDING_PAYMENTS,
  REPORT_CARDS,
  type ReportId,
  reportSummary,
  SALES_PATTERNS,
  STATUS_FUNNEL,
  TOP_SERVICES_BY_BILLING,
  TOP_SERVICES_BY_QTY,
} from '../data/reports'
import { useAuthGuard } from '../hooks/useAuthGuard'

const REPORT_ICONS: Record<
  ReportId,
  ComponentType<{ className?: string; strokeWidth?: string | number }>
> = {
  'events-by-month': CalendarRange,
  'status-funnel': GitBranch,
  'top-services': Sparkles,
  'sales-patterns': Clock3,
  'pending-payments': Wallet,
}

export default function ReportsPage() {
  const { salon } = useAuthGuard({ allowedRoles: ['admin'] })
  const [activeReport, setActiveReport] = useState<ReportId>('events-by-month')

  const activeMeta = useMemo(
    () => REPORT_CARDS.find((c) => c.id === activeReport)!,
    [activeReport],
  )

  const overdueCount = PENDING_PAYMENTS.filter((p) => p.status === 'vencida').length
  const yearBilling = EVENTS_BY_MONTH.reduce((s, m) => s + m.billingCurrent, 0)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <DashboardLayout salonName={salon}>
        <div className="catalog-layout">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
                  Dashboard de reportes
                </h1>
                <p className="text-sm text-ink-muted">Indicadores operativos y comerciales</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-apple-fill px-3 py-1.5 text-xs font-medium text-ink-muted">
              <BarChart3 className="h-3.5 w-3.5" />
              Datos de demostración
            </span>
          </div>

          <div className="grid gap-0 lg:grid-cols-[15.5rem_minmax(0,1fr)]">
            <aside className="border-b border-black/[0.06] bg-apple-fill p-3 lg:border-b-0 lg:border-r">
              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-apple-label">
                Páginas
              </p>

              <div className="mb-2 flex gap-1 overflow-x-auto pb-1 lg:hidden">
                {REPORT_CARDS.map((card) => {
                  const active = activeReport === card.id
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setActiveReport(card.id)}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                        active
                          ? 'bg-primary text-white'
                          : 'bg-white text-ink-muted ring-1 ring-black/[0.06]'
                      }`}
                    >
                      {card.title}
                    </button>
                  )
                })}
              </div>

              <nav className="hidden space-y-1 lg:block" aria-label="Menú de reportes">
                {REPORT_CARDS.map((card) => {
                  const Icon = REPORT_ICONS[card.id]
                  const active = activeReport === card.id
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setActiveReport(card.id)}
                      className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        active
                          ? 'bg-white text-primary shadow-sm ring-1 ring-black/[0.04]'
                          : 'text-ink-muted hover:bg-white/80 hover:text-ink'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          active ? 'bg-primary text-white' : 'bg-white text-ink-muted'
                        }`}
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">{card.title}</span>
                        <span className="mt-0.5 block text-[11px] leading-snug text-apple-label">
                          {reportSummary(card.id)}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </nav>
            </aside>

            <div className="min-w-0 p-5 sm:p-6">
              <div className="mb-5 grid gap-3 sm:grid-cols-3">
                <KpiChip
                  label="Facturación 2026"
                  value={formatCurrency(yearBilling)}
                  hint="+18% vs año anterior"
                />
                <KpiChip label="Conversión a pagado" value="40%" hint="Embudo comercial" />
                <KpiChip
                  label="Cobros vencidos"
                  value={String(overdueCount)}
                  hint="Requieren seguimiento"
                  tone={overdueCount > 0 ? 'danger' : 'default'}
                />
              </div>

              <div className="mb-5 border-b border-black/[0.06] pb-4">
                <h2 className="text-xl font-semibold tracking-tight text-ink">
                  {activeMeta.title}
                </h2>
                <p className="mt-1 text-sm text-ink-muted">{activeMeta.description}</p>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeReport}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeReport === 'events-by-month' && <EventsByMonthReport />}
                  {activeReport === 'status-funnel' && <StatusFunnelReport />}
                  {activeReport === 'top-services' && <TopServicesReport />}
                  {activeReport === 'sales-patterns' && <SalesPatternsReport />}
                  {activeReport === 'pending-payments' && <PendingPaymentsReport />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </motion.div>
  )
}

function KpiChip({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'danger'
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        tone === 'danger' ? 'border-red-100 bg-red-50/40' : 'border-black/[0.06] bg-apple-fill'
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-apple-label">{label}</p>
      <p
        className={`mt-1 text-lg font-semibold tracking-tight ${
          tone === 'danger' ? 'text-red-600' : 'text-ink'
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-ink-muted">{hint}</p>}
    </div>
  )
}

function EventsByMonthReport() {
  const maxBilling = Math.max(
    ...EVENTS_BY_MONTH.map((m) => Math.max(m.billingCurrent, m.billingPrevious)),
  )
  const totalCurrent = EVENTS_BY_MONTH.reduce((s, m) => s + m.billingCurrent, 0)
  const totalPrevious = EVENTS_BY_MONTH.reduce((s, m) => s + m.billingPrevious, 0)
  const eventsCurrent = EVENTS_BY_MONTH.reduce((s, m) => s + m.eventsCurrent, 0)
  const eventsPrevious = EVENTS_BY_MONTH.reduce((s, m) => s + m.eventsPrevious, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatPill label="Facturación 2026" value={formatCurrency(totalCurrent)} hint="+18% vs 2025" />
        <StatPill label="Facturación 2025" value={formatCurrency(totalPrevious)} />
        <StatPill
          label="Eventos 2026"
          value={String(eventsCurrent)}
          hint={`${eventsPrevious} en 2025`}
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-primary" /> 2026
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-black/[0.12]" /> 2025
          </span>
        </div>
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-12">
          {EVENTS_BY_MONTH.map((m) => (
            <div key={m.monthKey} className="flex flex-col items-center gap-1">
              <div className="flex h-36 w-full items-end justify-center gap-0.5">
                <div
                  className="w-2.5 rounded-t bg-black/[0.12] sm:w-3"
                  style={{ height: `${(m.billingPrevious / maxBilling) * 100}%` }}
                  title={`2025: ${formatCurrency(m.billingPrevious)}`}
                />
                <div
                  className="w-2.5 rounded-t bg-primary sm:w-3"
                  style={{ height: `${(m.billingCurrent / maxBilling) * 100}%` }}
                  title={`2026: ${formatCurrency(m.billingCurrent)} · ${m.eventsCurrent} eventos`}
                />
              </div>
              <span className="text-[10px] font-semibold text-ink-muted">{m.month}</span>
              <span className="text-[10px] text-apple-label">{m.eventsCurrent}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/[0.06]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-apple-fill text-[11px] font-semibold uppercase tracking-wider text-apple-label">
            <tr>
              <th className="px-4 py-3">Mes</th>
              <th className="px-4 py-3">Eventos 2026</th>
              <th className="px-4 py-3">Eventos 2025</th>
              <th className="px-4 py-3">Fact. 2026</th>
              <th className="px-4 py-3">Fact. 2025</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.06]">
            {EVENTS_BY_MONTH.map((m) => (
              <tr key={m.monthKey}>
                <td className="px-4 py-2.5 font-medium text-ink">{m.month}</td>
                <td className="px-4 py-2.5 text-ink-muted">{m.eventsCurrent}</td>
                <td className="px-4 py-2.5 text-ink-muted">{m.eventsPrevious}</td>
                <td className="px-4 py-2.5 font-medium text-ink">
                  {formatCurrency(m.billingCurrent)}
                </td>
                <td className="px-4 py-2.5 text-ink-muted">
                  {formatCurrency(m.billingPrevious)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatusFunnelReport() {
  const max = STATUS_FUNNEL[0]?.count ?? 1
  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-muted">
        Embudo de conversión comercial:{' '}
        <strong className="text-ink">Presupuestado → Reservado → Señado → Pagado</strong>
      </p>
      <div className="space-y-3">
        {STATUS_FUNNEL.map((step, index) => (
          <div key={step.status} className="rounded-xl border border-black/[0.06] bg-apple-fill p-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-bold text-ink-muted">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-ink">{step.status}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-semibold text-ink">{step.count}</span>
                {step.conversionFromPrevious !== null && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    {step.conversionFromPrevious}% conv.
                  </span>
                )}
              </div>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(step.count / max) * 100}%`,
                  backgroundColor: step.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-apple-label">
        De cada 100 presupuestos, 40 llegan a Pagado en este mock.
      </p>
    </div>
  )
}

function TopServicesReport() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <RankingTable
        title="Por cantidad"
        rows={TOP_SERVICES_BY_QTY}
        primary={(r) => `${r.quantity} ventas`}
        secondary={(r) => formatCurrency(r.billing)}
      />
      <RankingTable
        title="Por facturación"
        rows={TOP_SERVICES_BY_BILLING}
        primary={(r) => formatCurrency(r.billing)}
        secondary={(r) => `${r.quantity} ventas`}
      />
    </div>
  )
}

function RankingTable({
  title,
  rows,
  primary,
  secondary,
}: {
  title: string
  rows: { name: string; quantity: number; billing: number }[]
  primary: (r: { name: string; quantity: number; billing: number }) => string
  secondary: (r: { name: string; quantity: number; billing: number }) => string
}) {
  const max = Math.max(...rows.map((r) => r.billing))
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-ink">{title}</h3>
      <div className="space-y-2.5">
        {rows.map((row, i) => (
          <div key={row.name} className="rounded-xl border border-black/[0.06] px-3 py-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-ink">
                <span className="mr-2 text-xs font-bold text-apple-label">#{i + 1}</span>
                {row.name}
              </span>
              <span className="text-sm font-semibold text-primary">{primary(row)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.04]">
              <div
                className="h-full rounded-full bg-primary/70"
                style={{ width: `${(row.billing / max) * 100}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-apple-label">{secondary(row)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SalesPatternsReport() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <PatternCard title="Por año" icon={CalendarRange} buckets={SALES_PATTERNS.byYear} />
      <PatternCard title="Por mes (top)" icon={Filter} buckets={SALES_PATTERNS.byMonth} />
      <PatternCard title="Por día de semana" icon={BarChart3} buckets={SALES_PATTERNS.byWeekday} />
      <PatternCard title="Por horario" icon={Clock3} buckets={SALES_PATTERNS.byHour} />
    </div>
  )
}

function PatternCard({
  title,
  icon: Icon,
  buckets,
}: {
  title: string
  icon: ComponentType<{ className?: string }>
  buckets: { label: string; value: number; share: number }[]
}) {
  return (
    <div className="rounded-xl border border-black/[0.06] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
      </div>
      <div className="space-y-2">
        {buckets.map((b) => (
          <div key={b.label}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="font-medium text-ink">{b.label}</span>
              <span className="text-ink-muted">
                {b.value} · {b.share}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.04]">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${b.share}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PendingPaymentsReport() {
  const overdue = PENDING_PAYMENTS.filter((p) => p.status === 'vencida')
  const upcoming = PENDING_PAYMENTS.filter((p) => p.status === 'por_vencer')
  const overdueTotal = overdue.reduce((s, p) => s + p.amount, 0)
  const upcomingTotal = upcoming.reduce((s, p) => s + p.amount, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <StatPill
          label="Vencidas"
          value={formatCurrency(overdueTotal)}
          hint={`${overdue.length} cuotas`}
          tone="danger"
        />
        <StatPill
          label="Por vencer"
          value={formatCurrency(upcomingTotal)}
          hint={`${upcoming.length} cuotas`}
        />
      </div>

      <PaymentGroup title="Cuotas vencidas" items={overdue} />
      <PaymentGroup title="Cuotas por vencer" items={upcoming} />
    </div>
  )
}

function PaymentGroup({
  title,
  items,
}: {
  title: string
  items: typeof PENDING_PAYMENTS
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-ink">{title}</h3>
      <div className="overflow-hidden rounded-xl border border-black/[0.06]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-apple-fill text-[11px] font-semibold uppercase tracking-wider text-apple-label">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Cuota</th>
              <th className="px-4 py-3">Vencimiento</th>
              <th className="px-4 py-3">Monto</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.06]">
            {items.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{p.clientName}</p>
                  <p className="text-xs text-apple-label">
                    {p.eventType} · {p.eventDate}
                  </p>
                </td>
                <td className="px-4 py-3 text-ink-muted">{p.installment}</td>
                <td className="px-4 py-3 text-ink-muted">{p.dueDate}</td>
                <td className="px-4 py-3 font-semibold text-ink">
                  {formatCurrency(p.amount)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      p.status === 'vencida'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {p.status === 'vencida'
                      ? `Vencida ${Math.abs(p.daysOffset)}d`
                      : `En ${p.daysOffset}d`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatPill({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'danger'
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        tone === 'danger' ? 'border-red-100 bg-red-50/50' : 'border-black/[0.06] bg-apple-fill'
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-apple-label">{label}</p>
      <p
        className={`mt-1 text-lg font-semibold tracking-tight ${
          tone === 'danger' ? 'text-red-600' : 'text-ink'
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-ink-muted">{hint}</p>}
    </div>
  )
}
