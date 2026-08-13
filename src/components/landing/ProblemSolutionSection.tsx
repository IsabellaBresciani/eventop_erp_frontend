import {
  ArrowRightLeft,
  CalendarX,
  CheckCircle2,
  MessageSquareOff,
  Sparkles,
  Store,
  XCircle,
} from 'lucide-react'
import { FadeIn } from '../ui/FadeIn'
import { useTranslation } from 'react-i18next'

const beforeItems = [
  { icon: CalendarX, text: 'Calendarios manuales y dobles reservas' },
  { icon: MessageSquareOff, text: 'Consultas perdidas en WhatsApp' },
  { icon: XCircle, text: 'Presupuestos armados a mano, sin seguimiento' },
]

const afterItems = [
  { icon: CheckCircle2, text: 'Agenda inteligente con estados en tiempo real' },
  { icon: Sparkles, text: 'Presupuestos PDF automáticos en un clic' },
  { icon: Store, text: 'Visibilidad en el Marketplace de EvenTop' },
]

export function ProblemSolutionSection() {
  const { t } = useTranslation()
  return (
    <section id="solucion" className="py-20 lg:py-28">
      <div className="section-container">
        <FadeIn className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            {t('problemsolutionsection.el_cambio_que_necesitas')}
          </span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            {t('problemsolutionsection.del_caos_operativo_al_control_total')}
          </h2>
          <p className="mt-4 text-slate-600">
            {t('problemsolutionsection.miles_de_salones_pierden_reservas_cada_s')}
          </p>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-12">
          <FadeIn delay={0.1} className="lg:col-span-5">
            <div className="group h-full rounded-card border border-red-100 bg-gradient-to-br from-red-50/80 to-white p-8 shadow-card transition-shadow hover:shadow-card-hover">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-500">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                    {t('problemsolutionsection.antes')}
                  </p>
                  <h3 className="text-xl font-bold text-slate-900">
                    {t('problemsolutionsection.caos_y_saturacin')}
                  </h3>
                </div>
              </div>
              <ul className="space-y-4">
                {beforeItems.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                    <span className="text-slate-600">{text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-xl bg-red-50 p-4">
                <p className="text-sm font-medium text-red-600">
                  {t('problemsolutionsection.perd_3_reservas_el_mes_pasado_porque_olv')}
                </p>
                <p className="mt-2 text-xs text-red-400">
                  {t('problemsolutionsection.dueo_de_quinta_crdoba')}
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="flex items-center justify-center lg:col-span-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary shadow-glow">
              <ArrowRightLeft className="h-6 w-6" />
            </div>
          </FadeIn>

          <FadeIn delay={0.3} className="lg:col-span-5">
            <div className="group h-full rounded-card border border-primary/20 bg-gradient-to-br from-primary/5 to-white p-8 shadow-card transition-shadow hover:shadow-card-hover">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {t('problemsolutionsection.despus')}
                  </p>
                  <h3 className="text-xl font-bold text-slate-900">
                    {t('problemsolutionsection.con_eventop')}
                  </h3>
                </div>
              </div>
              <ul className="space-y-4">
                {afterItems.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-slate-600">{text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-xl bg-primary/5 p-4">
                <p className="text-sm font-medium text-primary">
                  {t('problemsolutionsection.aumentamos_nuestras_reservas_un_30_en_el')}
                </p>
                <p className="mt-2 text-xs text-primary/60">
                  {t('problemsolutionsection.saln_jardines_del_sur_buenos_aires')}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { stat: '−60%', label: 'Tiempo en tareas administrativas' },
            { stat: '+30%', label: 'Reservas confirmadas' },
            { stat: '2 seg', label: 'Check-in por invitado con QR' },
            { stat: '24/7', label: 'Marketplace activo para tu salón' },
          ].map((item, i) => (
            <FadeIn key={item.label} delay={0.1 * i}>
              <div className="rounded-2xl border border-surface-border bg-white p-5 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
                <p className="text-2xl font-extrabold text-primary">{item.stat}</p>
                <p className="mt-1 text-xs text-slate-500">{item.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
