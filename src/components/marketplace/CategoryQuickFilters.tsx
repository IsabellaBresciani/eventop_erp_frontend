import { Link } from 'react-router-dom'
import { MARKETPLACE_CATEGORIES } from '../../data/marketplace-venues'

interface CategoryQuickFiltersProps {
  activeCategory: string
  onSelect: (category: string) => void
}

export function CategoryQuickFilters({ activeCategory, onSelect }: CategoryQuickFiltersProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect('')}
        className={`mk-pill ${!activeCategory ? 'mk-pill-active' : ''}`}
      >
        Todos
      </button>
      {MARKETPLACE_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onSelect(cat.id)}
          className={`mk-pill ${activeCategory === cat.id ? 'mk-pill-active' : ''}`}
        >
          {cat.label}
        </button>
      ))}
      <Link to="/marketplace/salones?map=1" className="mk-pill ml-auto hidden sm:inline-flex">
        Ver mapa →
      </Link>
    </div>
  )
}
