import { ArrowRight, Headphones, Instagram, Linkedin, Mail } from 'lucide-react'
import { FadeIn } from '../ui/FadeIn'
import { Logo } from '../ui/Logo'
import { useTranslation } from 'react-i18next'

interface CtaSectionProps {
  onOpenRegister: () => void
}

export function CtaSection({ onOpenRegister }: CtaSectionProps) {
  const { t } = useTranslation()
  return (
    <section className="py-20">
      <div className="section-container">
        <FadeIn>
          <div className="relative overflow-hidden rounded-card bg-primary px-8 py-14 text-center sm:px-16 sm:py-16">
            <div className="pointer-events-none absolute inset-0 opacity-20">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                {t('footer.listo_para_profesionalizar_tu_saln')}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-100">
                {t('footer.nete_a_los_salones_que_ya_automatizaron_')}
              </p>
              <button
                type="button"
                onClick={onOpenRegister}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                {t('footer.comenzar_prueba_gratis')}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer id="footer" className="border-t border-surface-border bg-white py-12">
      <div className="section-container">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-slate-500">
              {t('footer.el_ecosistema_digital_para_la_gestin_pro')}
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border text-slate-500 transition-colors hover:border-primary/30 hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border text-slate-500 transition-colors hover:border-primary/30 hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border text-slate-500 transition-colors hover:border-primary/30 hover:text-primary"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">{t('footer.producto')}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
              <li>
                <a href="#funciones" className="hover:text-primary">
                  {t('footer.funciones')}
                </a>
              </li>
              <li>
                <a href="#solucion" className="hover:text-primary">
                  {t('footer.solucin')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  {t('footer.marketplace')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  {t('footer.precios')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">{t('footer.soporte')}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
              <li>
                <a href="#" className="flex items-center gap-1.5 hover:text-primary">
                  <Headphones className="h-3.5 w-3.5" />
                  {t('footer.centro_de_ayuda')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  {t('footer.poltica_de_privacidad')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  {t('footer.trminos_de_servicio')}
                </a>
              </li>
              <li>
                <a href="mailto:soporte@eventop.com" className="hover:text-primary">
                  {t('footer.soporteeventopcom')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-surface-border pt-8 sm:flex-row">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} {t('footer.eventop_todos_los_derechos_reservados')}
          </p>
          <p className="text-xs text-slate-400">
            {t('footer.hecho_con_para_salones_de_eventos_en_lat')}
          </p>
        </div>
      </div>
    </footer>
  )
}
