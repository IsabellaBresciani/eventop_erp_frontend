import { ArrowRight, Play } from 'lucide-react'
import { FadeIn } from '../ui/FadeIn'
import { useTranslation } from 'react-i18next'

interface HeroSectionProps {
  onOpenRegister: () => void
  onOpenLogin: () => void
}

export function HeroSection({ onOpenRegister, onOpenLogin }: HeroSectionProps) {
  const { t } = useTranslation()
  return (
    <section className="relative overflow-hidden pb-20 pt-28 lg:pb-28 lg:pt-36">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, var(--color-primary) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="section-container relative">
        <div className="mx-auto max-w-4xl text-center">
          <FadeIn>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {t('herosection.erp_marketplace_para_salones_de_eventos')}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {t('herosection.automatiza_tu_saln')}{' '}
              <span className="bg-gradient-to-r from-primary to-primary-800 bg-clip-text text-transparent">
                {t('herosection.recupera_tu_tiempo')}
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              {t('herosection.el_ecosistema_digital_que_une_tu_erp_con')}
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={onOpenRegister}
                className="btn-primary px-8 py-4 text-base"
              >
                {t('herosection.comenzar_prueba_gratis')}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onOpenLogin}
                className="btn-secondary px-8 py-4 text-base"
              >
                <Play className="h-4 w-4 text-primary" />
                {t('herosection.contactar_ventas')}
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="mt-4 text-sm text-slate-400">
              {t('herosection.sin_tarjeta_de_crdito_configuracin_en_15')}
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.5} className="mt-16 lg:mt-20">
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-b from-primary/20 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-card border border-surface-border bg-white shadow-card-hover">
              <div className="flex items-center gap-2 border-b border-surface-border bg-surface/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="ml-2 text-xs text-slate-400">
                  {t('herosection.paneleventopcom')}
                </span>
              </div>
              <div className="grid gap-0 md:grid-cols-3">
                <DashboardPreviewCard
                  title={t('herosection.prximo_evento')}
                  value="Boda García-López"
                  sub="En 3 días · 120 invitados"
                  accent="bg-blue-500"
                />
                <DashboardPreviewCard
                  title={t('herosection.consultas_pendientes')}
                  value="7 nuevas"
                  sub="3 presupuestos por enviar"
                  accent="bg-amber-500"
                />
                <DashboardPreviewCard
                  title={t('herosection.ocupacin_del_mes')}
                  value="78%"
                  sub="14 de 18 fechas vendidas"
                  accent="bg-emerald-500"
                />
              </div>
              <div className="border-t border-surface-border p-4">
                <MiniCalendar />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function DashboardPreviewCard({
  title,
  value,
  sub,
  accent,
}: {
  title: string
  value: string
  sub: string
  accent: string
}) {

  return (
    <div className="border-b border-surface-border p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <div className="mb-2 flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${accent}`} />
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{title}</span>
      </div>
      <p className="text-lg font-bold text-slate-900">{value}</p>
      <p className="mt-0.5 text-xs text-slate-500">{sub}</p>
    </div>
  )
}

function MiniCalendar() {
  const { t } = useTranslation()
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
  const eventDays: Record<number, string> = {
    3: 'bg-blue-500',
    7: 'bg-amber-500',
    12: 'bg-emerald-500',
    15: 'bg-gold-500',
    18: 'bg-emerald-500',
    22: 'bg-blue-500',
    25: 'bg-red-400',
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">{t('herosection.agosto_2026')}</span>
        <div className="flex gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-500" /> {t('herosection.presupuestado')}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> {t('herosection.pagado')}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-slate-400">
            {d}
          </div>
        ))}
        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
          <div
            key={day}
            className={`flex h-7 items-center justify-center rounded-lg text-xs ${
              eventDays[day]
                ? `${eventDays[day]} font-semibold text-white`
                : 'text-slate-600 hover:bg-surface'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}
