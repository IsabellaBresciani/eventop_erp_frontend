import { Calendar, LayoutGrid, QrCode, Users, Wifi } from 'lucide-react'
import { FadeIn } from '../ui/FadeIn'

export function FeaturesSection() {
  return (
    <section id="funciones" className="bg-white py-20 lg:py-28">
      <div className="section-container">
        <FadeIn className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Propuesta de valor
          </span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Todo lo que tu salón necesita, en un solo ecosistema
          </h2>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FadeIn delay={0.1} className="lg:col-span-2">
            <div className="group h-full rounded-card border border-surface-border bg-surface p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LayoutGrid className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Gestión 360°</h3>
              <p className="mt-2 max-w-md text-slate-600">
                Registra el perfil completo de tu salón, servicios y amenidades. Tu vitrina
                en el Marketplace se actualiza automáticamente con cada cambio.
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
              <h3 className="text-xl font-bold text-slate-900">Calendario Inteligente</h3>
              <p className="mt-2 text-sm text-slate-600">
                Visualiza el estado de cada evento con códigos de color. Presupuestado,
                señado, pagado o suspendido — todo de un vistazo.
              </p>
              <div className="mt-5 rounded-xl border border-surface-border bg-surface p-3">
                <CalendarMiniPreview />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3} className="lg:col-span-3">
            <div className="group grid gap-6 rounded-card border border-surface-border bg-gradient-to-r from-primary/5 via-white to-primary/5 p-8 shadow-card transition-all hover:shadow-card-hover md:grid-cols-2">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                  <QrCode className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Experiencia del Invitado
                </h3>
                <p className="mt-2 text-slate-600">
                  Invitaciones virtuales personalizables con confirmación de asistencia y
                  código QR de acceso. Un diferencial premium que eleva la imagen de tu
                  salón ante cada anfitrión.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Plantillas para Boda, XV, Infantil y Corporativo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Confirmación con acompañantes en un solo envío
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Check-in ultra-rápido el día del evento
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <InvitationPreview />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

function CalendarMiniPreview() {
  const colors = ['bg-blue-500', 'bg-amber-500', 'bg-emerald-500', 'bg-violet-500']
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
  return (
    <div className="w-full max-w-xs animate-float rounded-2xl border border-surface-border bg-white p-5 shadow-card-hover">
      <div className="mb-3 h-24 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5" />
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary">
        Estás invitado
      </p>
      <p className="mt-1 text-center text-lg font-bold text-slate-900">Boda Valentina & Martín</p>
      <p className="mt-1 text-center text-xs text-slate-500">15 de Agosto · 20:00 hs</p>
      <div className="mt-4 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5">
          <QrCode className="h-8 w-8 text-primary" />
        </div>
      </div>
      <button type="button" className="btn-primary mt-4 w-full py-2 text-xs">
        Confirmar asistencia
      </button>
    </div>
  )
}
