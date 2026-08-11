import { Quote, Star } from 'lucide-react'
import { FadeIn } from '../ui/FadeIn'

const testimonials = [
  {
    name: 'María González',
    role: 'Dueña, Quinta Los Olivos',
    location: 'Córdoba',
    metric: '+30% reservas',
    quote:
      'Antes pasaba horas respondiendo las mismas consultas. Con EvenTop, los presupuestos se generan solos y el calendario nunca más se desordenó.',
    initials: 'MG',
    color: 'from-primary to-primary-800',
  },
  {
    name: 'Carlos Méndez',
    role: 'Director, Salón Jardines del Sur',
    location: 'Buenos Aires',
    metric: '−5 hs/semana admin',
    quote:
      'El Marketplace nos trajo clientes que no conocíamos. Y las invitaciones con QR impresionaron a cada anfitrión que pasó por acá.',
    initials: 'CM',
    color: 'from-primary-800 to-primary-700',
  },
  {
    name: 'Lucía Fernández',
    role: 'Gerente, Espacio Multieventos Nova',
    location: 'Rosario',
    metric: '98% ocupación',
    quote:
      'La ficha de auditoría de cada evento es oro puro. Tengo todo — pagos, servicios, invitados — en un panel lateral sin recargar nada.',
    initials: 'LF',
    color: 'from-secondary-400 to-secondary-600',
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonios" className="py-20 lg:py-28">
      <div className="section-container">
        <FadeIn className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Confianza
          </span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Salones que ya recuperaron su tiempo
          </h2>
          <p className="mt-4 text-slate-600">
            Más de 200 salones en Argentina confían en EvenTop para gestionar sus eventos.
          </p>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={0.1 * i}>
              <div className="group flex h-full flex-col rounded-card border border-surface-border bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
                <div className="mb-4 flex items-center justify-between">
                  <Quote className="h-8 w-8 text-primary/20" />
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="flex-1 text-sm leading-relaxed text-slate-600">"{t.quote}"</p>

                <div className="mt-6 flex items-center gap-3 border-t border-surface-border pt-5">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-sm font-bold text-white`}
                  >
                    {t.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">
                      {t.role} · {t.location}
                    </p>
                  </div>
                  <div className="rounded-lg bg-primary/5 px-2.5 py-1 text-xs font-bold text-primary">
                    {t.metric}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4} className="mt-12">
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {['Salones BA', 'Eventos Pro', 'Quinta Real', 'Nova Events', 'Jardines VIP'].map(
              (brand) => (
                <span key={brand} className="text-sm font-semibold tracking-wide text-slate-400">
                  {brand}
                </span>
              ),
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
