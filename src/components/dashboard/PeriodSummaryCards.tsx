import { motion } from 'framer-motion'
import {
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  Percent,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { type ComponentType, type ReactNode } from 'react'
import {
  formatCurrency,
  type PeriodDashboardStats,
  type StatComparison,
} from '../../data/dashboard'
import { useTranslation } from 'react-i18next'

interface PeriodSummaryCardsProps {
  stats: PeriodDashboardStats
  viewModeLabel: string
}

export function PeriodSummaryCards({ stats, viewModeLabel }: PeriodSummaryCardsProps) {
  const { t } = useTranslation()
  return (
    <section className="space-y-5">
      <div>
        <p className="dash-section-label">{t('periodsummarycards.resumen_del_periodo')}</p>
        <p className="mt-1.5 text-[13px] text-slate-500">
          {stats.periodLabel} {t('periodsummarycards.vista')}
          {viewModeLabel.toLowerCase()}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Percent}
          label={t('periodsummarycards.ocupacin')}
          index={0}
          comparison={stats.comparisons.occupancy}
        >
          <p className="text-[1.75rem] font-semibold tracking-[-0.02em] text-primary">
            {stats.occupancyRate}%
          </p>
          <p className="mt-1 text-[13px] text-slate-500">
            {stats.occupiedDays} {t('periodsummarycards.de')}
            {stats.totalDays} {t('periodsummarycards.das_con_evento')}
          </p>
        </SummaryCard>

        <SummaryCard
          icon={CalendarCheck}
          label={t('periodsummarycards.facturacin')}
          index={1}
          comparison={stats.comparisons.billing}
        >
          <p className="text-[1.75rem] font-semibold tracking-[-0.02em] text-primary">
            {formatCurrency(stats.billing)}
          </p>
          <p className="mt-1 text-[13px] text-slate-500">
            {t('periodsummarycards.seas_cobradas_en_el_periodo')}
          </p>
        </SummaryCard>

        <SummaryCard
          icon={CalendarClock}
          label={t('periodsummarycards.prximo_evento')}
          index={2}
          comparison={stats.comparisons.eventsCount}
        >
          {stats.nextEvent ? (
            <>
              <p className="text-base font-semibold tracking-[-0.01em] text-slate-900">
                {stats.nextEvent.clientName}
              </p>
              <p className="mt-1 text-[13px] text-slate-500">
                {stats.nextEvent.eventType} · {formatShortDate(stats.nextEvent.date)}
              </p>
            </>
          ) : (
            <p className="text-[13px] text-slate-500">
              {t('periodsummarycards.no_hay_eventos_prximos')}
            </p>
          )}
        </SummaryCard>

        <SummaryCard
          icon={CalendarPlus}
          label={t('periodsummarycards.prxima_fecha_libre')}
          index={3}
          comparison={stats.comparisons.freeDays}
        >
          {stats.nextAvailableDate ? (
            <>
              <p className="text-base font-semibold capitalize tracking-[-0.01em] text-slate-900">
                {formatAvailableDate(stats.nextAvailableDate)}
              </p>
              <p className="mt-1 text-[13px] text-slate-500">
                {t('periodsummarycards.disponible_para_reservar')}
              </p>
            </>
          ) : (
            <p className="text-[13px] text-slate-500">
              {t('periodsummarycards.sin_fechas_libres_prximas')}
            </p>
          )}
        </SummaryCard>
      </div>
    </section>
  )
}

function SummaryCard({
  icon: Icon,
  label,
  index,
  comparison,
  children,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  index: number
  comparison: StatComparison
  children: ReactNode
}) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -2 }}
      className="catalog-stat-card"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
          {label}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-secondary text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {children}
      <MonthComparison comparison={comparison} />
    </motion.div>
  )
}

function MonthComparison({ comparison }: { comparison: StatComparison }) {
  const { t } = useTranslation()
  const { changePercent } = comparison

  if (changePercent === null) return null

  const isPositive = changePercent > 0
  const isNegative = changePercent < 0
  const isNeutral = changePercent === 0

  const colorClass = isPositive
    ? 'text-emerald-600'
    : isNegative
      ? 'text-red-500'
      : 'text-apple-label'

  const Icon = isPositive ? TrendingUp : TrendingDown

  return (
    <p className={`mt-3 inline-flex items-center gap-1 text-[12px] font-semibold ${colorClass}`}>
      {!isNeutral && <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />}
      <span>
        {isPositive && '+'}
        {changePercent}%
      </span>
      <span className="font-normal text-apple-label">
        {t('periodsummarycards.vs_mes_anterior')}
      </span>
    </p>
  )
}

function formatShortDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function formatAvailableDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}
