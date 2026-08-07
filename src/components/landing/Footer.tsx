import { ArrowRight, Headphones, Instagram, Linkedin, Mail } from 'lucide-react'
import { FadeIn } from '../ui/FadeIn'
import { Logo } from '../ui/Logo'

interface CtaSectionProps {
  onOpenRegister: () => void
}

export function CtaSection({ onOpenRegister }: CtaSectionProps) {
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
                ¿Listo para profesionalizar tu salón?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-100">
                Únete a los salones que ya automatizaron su gestión. Prueba gratis por 14 días,
                sin compromiso.
              </p>
              <button
                type="button"
                onClick={onOpenRegister}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                Comenzar Prueba Gratis
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
  return (
    <footer id="footer" className="border-t border-surface-border bg-white py-12">
      <div className="section-container">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-slate-500">
              El ecosistema digital para la gestión profesional de salones de eventos.
              ERP, Marketplace e Invitaciones Inteligentes.
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
            <h4 className="text-sm font-semibold text-slate-900">Producto</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
              <li>
                <a href="#funciones" className="hover:text-primary">
                  Funciones
                </a>
              </li>
              <li>
                <a href="#solucion" className="hover:text-primary">
                  Solución
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Marketplace
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Precios
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Soporte</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
              <li>
                <a href="#" className="flex items-center gap-1.5 hover:text-primary">
                  <Headphones className="h-3.5 w-3.5" />
                  Centro de ayuda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Términos de servicio
                </a>
              </li>
              <li>
                <a href="mailto:soporte@eventop.com" className="hover:text-primary">
                  soporte@eventop.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-surface-border pt-8 sm:flex-row">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} EvenTop. Todos los derechos reservados.
          </p>
          <p className="text-xs text-slate-400">Hecho con 💜 para salones de eventos en LATAM</p>
        </div>
      </div>
    </footer>
  )
}
