import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { INVITATION_TEMPLATES } from '../../data/invitation-templates'
import type { InvitationTemplateId } from '../../types/invitation'

interface TemplateCarouselProps {
  selected: InvitationTemplateId
  onSelect: (id: InvitationTemplateId) => void
}

export function TemplateCarousel({ selected, onSelect }: TemplateCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Plantillas (RF-203)
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-primary/5 hover:text-primary"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-primary/5 hover:text-primary"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {INVITATION_TEMPLATES.map((template) => {
          const isSelected = selected === template.id
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template.id)}
              className={`group shrink-0 w-44 overflow-hidden rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-primary shadow-glow scale-[1.02]'
                  : 'border-surface-border hover:border-primary/30'
              }`}
            >
              <div className={`h-24 bg-gradient-to-br ${template.previewGradient} relative`}>
                <img
                  src={template.defaultCover}
                  alt={template.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay"
                />
                <div
                  className="absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                  style={{ backgroundColor: template.accentColor }}
                >
                  {template.name}
                </div>
              </div>
              <div className="bg-white p-2.5">
                <p className="text-xs font-semibold text-slate-800">{template.name}</p>
                <p className="text-[10px] text-slate-400">{template.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
