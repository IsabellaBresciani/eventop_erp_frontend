import { Calendar, LayoutGrid, QrCode, Users, Wifi } from 'lucide-react'
import { FadeIn } from '../ui/FadeIn'
import { useTranslation } from 'react-i18next'
import { FeatureGate } from '../ui/FeatureGate'

export function FeaturesSection() {
  const { t } = useTranslation()

  return (
    <section id="funciones" className="bg-white py-20 lg:py-28">
      <div className="section-container">
        <FadeIn className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            {t('landing.features.subtitle')}
          </span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            {t('landing.features.title')}
          </h2>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FadeIn delay={0.1} className="lg:col-span-2">
            <div className="group h-full rounded-card border border-surface-border bg-surface p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LayoutGrid className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {t('landing.features.management_title')}
              </h3>
              <p className="mt-2 max-w-md text-slate-600">
                {t('landing.features.management_desc')}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Users, label: 'Capacidad' },
                  { icon: Wifi, label: 'Amenidades' },
                  { icon: LayoutGrid, label: 'Paquetes' },
                  { icon: Users, label: 'Servicios' },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 rounded-xl border border-surface-border bg-white p-3 text-center transition-colors group-hover:border-primary/20"
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-xs font-medium text-slate-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="group h-full rounded-card border border-surface-border bg-white p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {t('landing.features.calendar_title')}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{t('landing.features.calendar_desc')}</p>
              <div className="mt-5 rounded-xl border border-surface-border bg-surface p-3">
                <CalendarMiniPreview />
              </div>
            </div>
          </FadeIn>

          <FeatureGate name="sms_integration">
            <FadeIn delay={0.3} className="lg:col-span-3">
              <div className="group grid gap-6 rounded-card border border-surface-border bg-gradient-to-r from-primary/5 via-white to-primary/5 p-8 shadow-card transition-all hover:shadow-card-hover md:grid-cols-2">
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                    <QrCode className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {t('landing.features.guest_title')}
                  </h3>
                  <p className="mt-2 text-slate-600">{t('landing.features.guest_desc')}</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {t('featuressection.plantillas_para_boda_xv_infantil_y_corpo')}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {t('featuressection.confirmacin_con_acompaantes_en_un_solo_e')}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {t('featuressection.checkin_ultrarpido_el_da_del_evento')}
                    </li>
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <InvitationPreview />
                </div>
              </div>
            </FadeIn>
          </FeatureGate>
        </div>
      </div>
    </section>
  )
}

function CalendarMiniPreview() {

  const colors = ['bg-primary', 'bg-primary-800', 'bg-gold', 'bg-primary-400']
  return (
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 14 }, (_, i) => (
        <div
          key={i}
          className={`flex h-6 items-center justify-center rounded-md text-[9px] font-medium ${
            i % 3 === 0 ? `${colors[i % colors.length]} text-white` : 'bg-white text-slate-500'
          }`}
        >
          {i + 10}
        </div>
      ))}
    </div>
  )
}

function InvitationPreview() {
  const { t } = useTranslation()
  return (
    <div className="w-full max-w-xs animate-float rounded-2xl border border-surface-border bg-white p-5 shadow-card-hover">
      <div className="mb-3 h-24 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5" />
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary">
        {t('featuressection.ests_invitado')}
      </p>
      <p className="mt-1 text-center text-lg font-bold text-slate-900">
        {t('featuressection.boda_valentina_martn')}
      </p>
      <p className="mt-1 text-center text-xs text-slate-500">
        {t('featuressection.15_de_agosto_2000_hs')}
      </p>
      <div className="mt-4 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5">
          <QrCode className="h-8 w-8 text-primary" />
        </div>
      </div>
      <button type="button" className="btn-primary mt-4 w-full py-2 text-xs">
        {t('featuressection.confirmar_asistencia')}
      </button>
    </div>
  )
}
