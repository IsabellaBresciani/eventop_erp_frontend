import { DollarSign, Percent, TrendingUp } from 'lucide-react'
import { type ComponentType, type ReactNode } from 'react'
import type { DashboardMetrics } from '../../types/dashboard'
import { formatCurrency } from '../../data/dashboard'

interface BusinessHealthProps {
  metrics: DashboardMetrics
}

const THEMES = [
  'from-primary-50/80 to-white',
  'from-secondary/50 to-white',
  'from-primary-50/60 to-white',
] as const

export function BusinessHealth({ metrics }: BusinessHealthProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <HealthCard
        icon={DollarSign}
        title="Ingresos proyectados"
        subtitle="Eventos señados y por cobrar"
        theme={THEMES[0]}
      >
        <p className="text-2xl font-semibold tracking-tight text-slate-900">
          {formatCurrency(metrics.projectedIncome)}
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <TrendingUp className="h-3.5 w-3.5" strokeWidth={2} />
          +12% vs. mes anterior
        </p>
      </HealthCard>

      <HealthCard
        icon={Percent}
        title="Conversión"
        subtitle="Presupuestos → Reservas"
        theme={THEMES[1]}
      >
        <div className="flex items-center gap-4">
          <CircularProgress value={metrics.conversionRate} />
          <div>
            <p className="text-2xl font-semibold tracking-tight text-slate-900">
              {metrics.conversionRate}%
            </p>
            <p className="text-xs text-slate-500">de presupuestos convertidos</p>
          </div>
        </div>
      </HealthCard>

      <HealthCard
        icon={TrendingUp}
        title="Ocupación"
        subtitle={`${metrics.soldDates} de ${metrics.totalDates} fechas vendidas`}
        theme={THEMES[2]}
      >
        <div className="mt-1">
          <div className="mb-3 flex items-baseline justify-between">
            <p className="text-2xl font-semibold tracking-tight text-slate-900">
              {metrics.occupancyRate}%
            </p>
            <p className="text-xs text-slate-400">Mes actual</p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-800 text-primary transition-all duration-700"
              style={{ width: `${metrics.occupancyRate}%` }}
            />
          </div>
        </div>
      </HealthCard>
    </div>
  )
}

function HealthCard({
  icon: Icon,
  title,
  subtitle,
  children,
  theme,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  subtitle: string
  children: ReactNode
  theme: string
}) {
  return (
    <div
      className={`group rounded-bento border border-white/70 bg-gradient-to-br p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated ${theme}`}
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-primary shadow-soft">
          <Icon className="h-[18px] w-[18px]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="text-[11px] text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function CircularProgress({ value }: { value: number }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg className="h-20 w-20 -rotate-90 text-primary" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(17,24,39,0.08)" strokeWidth="6" />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
    </div>
  )
}
