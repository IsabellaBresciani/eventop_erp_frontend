import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  CalendarRange,
  Clock3,
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
} from '../data/reports'
import { useAuthGuard } from '../hooks/useAuthGuard'
import {
  KpiChip,
  EventsByMonthReport,
  StatusFunnelReport,
  TopServicesReport,
  SalesPatternsReport,
  PendingPaymentsReport,
} from '../components/reports/ReportWidgets'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  const { salon } = useAuthGuard({ allowedRoles: ['admin'] })
  const [activeReport, setActiveReport] = useState<ReportId>('events-by-month')

  const activeMeta = useMemo(() => REPORT_CARDS.find((c) => c.id === activeReport)!, [activeReport])

  const overdueCount = PENDING_PAYMENTS.filter((p) => p.status === 'vencida').length
  const yearBilling = EVENTS_BY_MONTH.reduce((s, m) => s + m.billingCurrent, 0)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <DashboardLayout salonName={salon}>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                  {t('reportspage.dashboard_de_reportes')}
                </h1>
                <p className="text-sm text-slate-500">
                  {t('reportspage.indicadores_operativos_y_comerciales')}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
              <BarChart3 className="h-3.5 w-3.5" />
              {t('reportspage.datos_de_demostracin')}
            </span>
          </div>

          <div className="grid gap-0 lg:grid-cols-[15.5rem_minmax(0,1fr)]">
            <aside className="border-b border-slate-100 bg-slate-50/70 p-3 lg:border-b-0 lg:border-r">
              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {t('reportspage.pginas')}
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
                          : 'bg-white text-slate-600 ring-1 ring-slate-200'
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
                          : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          active ? 'bg-primary text-white' : 'bg-white text-slate-500'
                        }`}
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">{card.title}</span>
                        <span className="mt-0.5 block text-[11px] leading-snug text-slate-400">
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
                  label={t('reportspage.facturacin_2026')}
                  value={formatCurrency(yearBilling)}
                  hint="+18% vs año anterior"
                />
                <KpiChip
                  label={t('reportspage.conversin_a_pagado')}
                  value="40%"
                  hint="Embudo comercial"
                />
                <KpiChip
                  label={t('reportspage.cobros_vencidos')}
                  value={String(overdueCount)}
                  hint="Requieren seguimiento"
                  tone={overdueCount > 0 ? 'danger' : 'default'}
                />
              </div>

              <div className="mb-5 border-b border-slate-100 pb-4">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                  {activeMeta.title}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{activeMeta.description}</p>
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
