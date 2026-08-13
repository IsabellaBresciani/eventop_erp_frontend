import { type ComponentType } from 'react'
import { BarChart3, CalendarRange, Clock3, Filter } from 'lucide-react'
import { formatCurrency } from '../../data/dashboard'
import {
  EVENTS_BY_MONTH,
  PENDING_PAYMENTS,
  SALES_PATTERNS,
  STATUS_FUNNEL,
  TOP_SERVICES_BY_BILLING,
  TOP_SERVICES_BY_QTY,
} from '../../data/reports'
import { useTranslation } from 'react-i18next'

export function KpiChip({
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
        tone === 'danger' ? 'border-red-100 bg-red-50/40' : 'border-slate-100 bg-slate-50/80'
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p
        className={`mt-1 text-lg font-semibold tracking-tight ${
          tone === 'danger' ? 'text-red-600' : 'text-slate-900'
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

export function EventsByMonthReport() {
  const { t } = useTranslation()
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
        <StatPill
          label={t('reportwidgets.facturacin_2026')}
          value={formatCurrency(totalCurrent)}
          hint="+18% vs 2025"
        />
        <StatPill
          label={t('reportwidgets.facturacin_2025')}
          value={formatCurrency(totalPrevious)}
        />
        <StatPill
          label={t('reportwidgets.eventos_2026')}
          value={String(eventsCurrent)}
          hint={`${eventsPrevious} en 2025`}
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-primary" /> 2026
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-slate-300" /> 2025
          </span>
        </div>
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-12">
          {EVENTS_BY_MONTH.map((m) => (
            <div key={m.monthKey} className="flex flex-col items-center gap-1">
              <div className="flex h-36 w-full items-end justify-center gap-0.5">
                <div
                  className="w-2.5 rounded-t bg-slate-300 sm:w-3"
                  style={{ height: `${(m.billingPrevious / maxBilling) * 100}%` }}
                  title={`2025: ${formatCurrency(m.billingPrevious)}`}
                />
                <div
                  className="w-2.5 rounded-t bg-primary sm:w-3"
                  style={{ height: `${(m.billingCurrent / maxBilling) * 100}%` }}
                  title={`2026: ${formatCurrency(m.billingCurrent)} · ${m.eventsCurrent} eventos`}
                />
              </div>
              <span className="text-[10px] font-semibold text-slate-500">{m.month}</span>
              <span className="text-[10px] text-slate-400">{m.eventsCurrent}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3">{t('reportwidgets.mes')}</th>
              <th className="px-4 py-3">{t('reportwidgets.eventos_2026')}</th>
              <th className="px-4 py-3">{t('reportwidgets.eventos_2025')}</th>
              <th className="px-4 py-3">{t('reportwidgets.fact_2026')}</th>
              <th className="px-4 py-3">{t('reportwidgets.fact_2025')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {EVENTS_BY_MONTH.map((m) => (
              <tr key={m.monthKey}>
                <td className="px-4 py-2.5 font-medium text-slate-800">{m.month}</td>
                <td className="px-4 py-2.5 text-slate-600">{m.eventsCurrent}</td>
                <td className="px-4 py-2.5 text-slate-600">{m.eventsPrevious}</td>
                <td className="px-4 py-2.5 font-medium text-slate-800">
                  {formatCurrency(m.billingCurrent)}
                </td>
                <td className="px-4 py-2.5 text-slate-600">{formatCurrency(m.billingPrevious)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function StatusFunnelReport() {
  const { t } = useTranslation()
  const max = STATUS_FUNNEL[0]?.count ?? 1
  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">
        {t('reportwidgets.embudo_de_conversin_comercial')}{' '}
        <strong className="text-slate-700">
          {t('reportwidgets.presupuestado_reservado_seado_pagado')}
        </strong>
      </p>
      <div className="space-y-3">
        {STATUS_FUNNEL.map((step, index) => (
          <div key={step.status} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-bold text-slate-500">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-slate-900">{step.status}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-semibold text-slate-900">{step.count}</span>
                {step.conversionFromPrevious !== null && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    {step.conversionFromPrevious}
                    {t('reportwidgets.conv')}
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
      <p className="text-xs text-slate-400">
        {t('reportwidgets.de_cada_100_presupuestos_40_llegan_a_pag')}
      </p>
    </div>
  )
}

export function TopServicesReport() {
  const { t } = useTranslation()
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <RankingTable
        title={t('reportwidgets.por_cantidad')}
        rows={TOP_SERVICES_BY_QTY}
        primary={(r) => `${r.quantity} ventas`}
        secondary={(r) => formatCurrency(r.billing)}
      />
      <RankingTable
        title={t('reportwidgets.por_facturacin')}
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
      <h3 className="mb-3 text-sm font-semibold text-slate-900">{title}</h3>
      <div className="space-y-2.5">
        {rows.map((row, i) => (
          <div key={row.name} className="rounded-xl border border-slate-100 px-3 py-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-800">
                <span className="mr-2 text-xs font-bold text-slate-400">#{i + 1}</span>
                {row.name}
              </span>
              <span className="text-sm font-semibold text-primary">{primary(row)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-primary/70"
                style={{ width: `${(row.billing / max) * 100}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">{secondary(row)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SalesPatternsReport() {
  const { t } = useTranslation()
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <PatternCard
        title={t('reportwidgets.por_ao')}
        icon={CalendarRange}
        buckets={SALES_PATTERNS.byYear}
      />
      <PatternCard
        title={t('reportwidgets.por_mes_top')}
        icon={Filter}
        buckets={SALES_PATTERNS.byMonth}
      />
      <PatternCard
        title={t('reportwidgets.por_da_de_semana')}
        icon={BarChart3}
        buckets={SALES_PATTERNS.byWeekday}
      />
      <PatternCard
        title={t('reportwidgets.por_horario')}
        icon={Clock3}
        buckets={SALES_PATTERNS.byHour}
      />
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
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="space-y-2">
        {buckets.map((b) => (
          <div key={b.label}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="font-medium text-slate-700">{b.label}</span>
              <span className="text-slate-500">
                {b.value} · {b.share}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-primary" style={{ width: `${b.share}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PendingPaymentsReport() {
  const { t } = useTranslation()
  const overdue = PENDING_PAYMENTS.filter((p) => p.status === 'vencida')
  const upcoming = PENDING_PAYMENTS.filter((p) => p.status === 'por_vencer')
  const overdueTotal = overdue.reduce((s, p) => s + p.amount, 0)
  const upcomingTotal = upcoming.reduce((s, p) => s + p.amount, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <StatPill
          label={t('reportwidgets.vencidas')}
          value={formatCurrency(overdueTotal)}
          hint={`${overdue.length} cuotas`}
          tone="danger"
        />
        <StatPill
          label={t('reportwidgets.por_vencer')}
          value={formatCurrency(upcomingTotal)}
          hint={`${upcoming.length} cuotas`}
        />
      </div>

      <PaymentGroup title={t('reportwidgets.cuotas_vencidas')} items={overdue} />
      <PaymentGroup title={t('reportwidgets.cuotas_por_vencer')} items={upcoming} />
    </div>
  )
}

function PaymentGroup({ title, items }: { title: string; items: typeof PENDING_PAYMENTS }) {
  const { t } = useTranslation()
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-slate-900">{title}</h3>
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3">{t('reportwidgets.cliente')}</th>
              <th className="px-4 py-3">{t('reportwidgets.cuota')}</th>
              <th className="px-4 py-3">{t('reportwidgets.vencimiento')}</th>
              <th className="px-4 py-3">{t('reportwidgets.monto')}</th>
              <th className="px-4 py-3">{t('reportwidgets.estado')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{p.clientName}</p>
                  <p className="text-xs text-slate-400">
                    {p.eventType} · {p.eventDate}
                  </p>
                </td>
                <td className="px-4 py-3 text-slate-600">{p.installment}</td>
                <td className="px-4 py-3 text-slate-600">{p.dueDate}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">
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

export function StatPill({
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
        tone === 'danger' ? 'border-red-100 bg-red-50/50' : 'border-slate-200 bg-slate-50/80'
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p
        className={`mt-1 text-lg font-semibold tracking-tight ${
          tone === 'danger' ? 'text-red-600' : 'text-slate-900'
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
