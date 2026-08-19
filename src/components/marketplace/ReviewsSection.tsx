import { Star } from 'lucide-react'
import type { SalonReview } from '../../types/marketplace-host'

interface ReviewsSectionProps {
  reviews: SalonReview[]
  salonName: string
  averageRating: number
  onSubmitReview?: (rating: number, comment: string, eventType: string) => void
  canReview?: boolean
}

export function ReviewsSection({
  reviews,
  salonName,
  averageRating,
  onSubmitReview,
  canReview = false,
}: ReviewsSectionProps) {
  return (
    <section className="mt-12 border-t border-[var(--mk-border)] pt-12">
      <p className="mk-eyebrow">Testimonios {salonName}</p>
      <h2 className="mk-title mt-2 text-2xl">Experiencias que inspiran</h2>
      <p className="mk-subtitle">
        Conocé lo que otros anfitriones dicen sobre su experiencia en este salón.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="mk-card overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b8?w=800&h=500&fit=crop"
            alt={salonName}
            className="h-64 w-full object-cover lg:h-full lg:min-h-[280px]"
          />
        </div>

        <div className="flex flex-col justify-center rounded-apple-lg bg-gradient-to-br from-primary to-primary-800 p-8 text-white shadow-card">
          <p className="text-4xl font-bold">{averageRating.toFixed(1)}/5</p>
          <div className="mt-2 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.round(averageRating) ? 'fill-gold text-gold' : 'text-white/30'}`}
              />
            ))}
          </div>
          <p className="mt-3 text-sm text-white/80">
            Basado en {reviews.length} reseñas de anfitriones verificados.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <article key={review.id} className="mk-card p-5">
            <div className="flex gap-0.5">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">&ldquo;{review.comment}&rdquo;</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                {review.hostName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{review.hostName}</p>
                <p className="text-xs text-primary">{review.eventType}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {canReview && onSubmitReview && <ReviewForm onSubmit={onSubmitReview} />}
    </section>
  )
}

function ReviewForm({
  onSubmit,
}: {
  onSubmit: (rating: number, comment: string, eventType: string) => void
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    onSubmit(
      Number(form.get('rating')),
      String(form.get('comment')),
      String(form.get('eventType')),
    )
    e.currentTarget.reset()
  }

  return (
    <form onSubmit={handleSubmit} className="mk-card mt-8 p-6">
      <h3 className="font-semibold text-ink">Dejá tu reseña</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-muted">Calificación</label>
          <select name="rating" className="mk-input" defaultValue="5">
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} estrellas
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-muted">Tipo de evento</label>
          <input name="eventType" type="text" placeholder="Casamiento" className="mk-input" required />
        </div>
      </div>
      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-semibold text-ink-muted">Comentario</label>
        <textarea
          name="comment"
          rows={3}
          required
          placeholder="Contanos tu experiencia..."
          className="mk-input"
        />
      </div>
      <button type="submit" className="mk-btn-primary mt-4">
        Publicar reseña
      </button>
    </form>
  )
}
