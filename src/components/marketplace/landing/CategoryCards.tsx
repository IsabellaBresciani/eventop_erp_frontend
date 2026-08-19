import { Link } from 'react-router-dom'
import { MARKETPLACE_CATEGORIES } from '../../../data/marketplace-venues'
import { FadeIn } from '../../ui/FadeIn'

export function CategoryCards() {
  return (
    <section id="categorias" className="mk-section bg-white">
      <div className="mk-container">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="mk-eyebrow">Categorías</p>
            <h2 className="mk-title mt-2 text-2xl sm:text-3xl">Pensados para cada ocasión</h2>
            <p className="mk-subtitle">
              Elegí el tipo de evento y descubrí salones curados para vos.
            </p>
          </div>
          <Link to="/marketplace/salones" className="mk-btn-soft !py-2 text-[13px]">
            Ver todos
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MARKETPLACE_CATEGORIES.map((cat, index) => (
            <FadeIn key={cat.id} delay={index * 0.06}>
              <Link
                to={`/marketplace/salones?categoria=${cat.id}`}
                className="mk-card mk-card-hover group relative block aspect-[3/4] overflow-hidden"
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xl font-semibold tracking-[-0.02em] text-white">{cat.label}</p>
                  <p className="mt-1.5 text-[15px] text-white/80">Explorar salones</p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
