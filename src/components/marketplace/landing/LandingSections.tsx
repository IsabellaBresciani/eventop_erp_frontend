import { ArrowRight, Calendar, MapPin, Search, Users } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EVENT_TYPE_OPTIONS } from '../../../data/marketplace-venues'
import { FadeIn } from '../../ui/FadeIn'
import { publicAsset } from '../../../lib/app-url'

const MARKETPLACE_HERO_VIDEO = publicAsset('videos/marketplace-hero.mp4')

const QUICK_CHIPS = ['La Plata', 'Palermo', 'Casamiento', 'Infantil'] as const

export function HeroSearch() {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [eventType, setEventType] = useState('infantil')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (date) params.set('date', date)
    if (eventType) params.set('tipo', eventType)
    navigate(`/marketplace/salones?${params.toString()}`)
  }

  return (
    <section className="relative">
      <div className="relative flex h-[min(100svh,800px)] min-h-[640px] flex-col overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        >
          <source src={MARKETPLACE_HERO_VIDEO} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-[#1a0a3e]/80" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/45 via-[#2d1260]/55 to-[#0f0624]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.25),transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#f5f5f7]" />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col pt-24 lg:pt-28">
          <div className="mk-container flex flex-1 flex-col justify-center pb-4">
            <FadeIn>
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-medium text-violet-100/90">EvenTop Marketplace</p>
                <h1 className="mt-3 text-[2.25rem] font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-[2.75rem] lg:text-[3.25rem]">
                  Encontrá el salón perfecto para tu celebración
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-[1.5] text-violet-50/85 sm:text-lg">
                  Buscá por zona, fecha y tipo de evento. Compará precios, guardá favoritos y
                  contactá salones en pocos pasos.
                </p>
              </div>
            </FadeIn>
          </div>

          <div className="mk-container shrink-0 pb-8 lg:pb-10">
            <FadeIn delay={0.08}>
              <div className="mk-search-bar-hero mx-auto max-w-4xl">
                <p className="mb-4 text-[15px] font-semibold text-ink">¿Qué estás organizando?</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="text-left">
                    <label className="mb-1.5 block text-[13px] font-medium text-ink-muted">
                      Ubicación
                    </label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ej: La Plata, Palermo..."
                        className="mk-input mk-input-glass !pl-10"
                      />
                    </div>
                  </div>
                  <div className="text-left">
                    <label className="mb-1.5 block text-[13px] font-medium text-ink-muted">Fecha</label>
                    <div className="relative">
                      <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mk-input mk-input-glass !pl-10"
                      />
                    </div>
                  </div>
                  <div className="text-left">
                    <label className="mb-1.5 block text-[13px] font-medium text-ink-muted">
                      Tipo de evento
                    </label>
                    <div className="relative">
                      <Users className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="mk-input mk-input-glass !pl-10"
                      >
                        {EVENT_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button type="button" onClick={handleSearch} className="mk-btn-primary w-full !py-3">
                      <Search className="h-4 w-4" />
                      Buscar salones
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HeroStatsStrip() {
  const navigate = useNavigate()

  const stats = [
    { value: '12+', label: 'Salones verificados' },
    { value: '4.8', label: 'Valoración promedio' },
    { value: '2 ciudades', label: 'Buenos Aires y La Plata' },
  ]

  return (
    <section className="mk-stat-strip">
      <div className="mk-container">
        <div className="mk-stat-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="mk-stat-item">
              <p className="mk-stat-value">{stat.value}</p>
              <p className="mk-stat-label">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mk-chip-row">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              className="mk-chip"
              onClick={() => {
                const params = new URLSearchParams()
                if (chip === 'La Plata' || chip === 'Palermo') params.set('location', chip)
                if (chip === 'Casamiento') params.set('tipo', 'casamiento')
                if (chip === 'Infantil') params.set('tipo', 'infantil')
                navigate(`/marketplace/salones?${params.toString()}`)
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PromoControlSection() {
  return (
    <section className="mk-section mk-section-dark">
      <div className="mk-container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="mk-card overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=700&fit=crop"
            alt="Evento infantil"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
        <div>
          <p className="mk-eyebrow">Para anfitriones</p>
          <h2 className="mk-title mt-3 text-2xl sm:text-3xl">Todo tu evento, en un solo lugar</h2>
          <p className="mk-lead mt-4">
            Compará salones, armá presupuestos, agendá visitas y seguí tus consultas desde tu cuenta
            personal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/marketplace/registro" className="mk-btn-primary inline-flex">
              Crear cuenta gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/marketplace/salones" className="mk-btn-soft inline-flex">
              Explorar salones
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function AboutPurposeSection() {
  return (
    <section id="sobre" className="mk-section mk-section-alt">
      <div className="mk-container space-y-20 lg:space-y-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="mk-card overflow-hidden lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=700&fit=crop"
              alt="Salón de eventos"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="lg:order-2">
            <p className="mk-eyebrow">Para salones</p>
            <h2 className="mk-title mt-3 text-2xl sm:text-3xl">Más visibilidad para tu espacio</h2>
            <p className="mk-lead mt-4">
              Publicá tu salón en EvenTop y llegá a anfitriones que buscan exactamente lo que
              ofrecés.
            </p>
            <Link to="/" className="mk-btn-soft mt-8 inline-flex">
              Conocer EvenTop ERP
            </Link>
          </div>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mk-eyebrow">Nuestra misión</p>
            <h2 className="mk-title mt-3 text-2xl sm:text-3xl">
              Conectar personas con espacios increíbles
            </h2>
            <p className="mk-lead mt-4">
              Simplificamos la búsqueda de salones con información clara, precios transparentes y
              herramientas para decidir con confianza.
            </p>
            <Link to="/marketplace/salones" className="mk-btn-primary mt-8 inline-flex">
              Explorar salones
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mk-card overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=700&fit=crop"
              alt="Organizadora de eventos"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
