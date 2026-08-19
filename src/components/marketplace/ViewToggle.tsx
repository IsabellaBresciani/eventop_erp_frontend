import { Grid3X3, Map } from 'lucide-react'

interface ViewToggleProps {
  view: 'grid' | 'map'
  onChange: (view: 'grid' | 'map') => void
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-[var(--mk-border)] bg-[var(--mk-bg-input)] p-1">
      <button
        type="button"
        onClick={() => onChange('grid')}
        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
          view === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-ink-muted hover:text-[var(--mk-text)]'
        }`}
      >
        <Grid3X3 className="h-3.5 w-3.5" />
        Lista
      </button>
      <button
        type="button"
        onClick={() => onChange('map')}
        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
          view === 'map' ? 'bg-primary text-white shadow-sm' : 'text-ink-muted hover:text-[var(--mk-text)]'
        }`}
      >
        <Map className="h-3.5 w-3.5" />
        Mapa
      </button>
    </div>
  )
}
