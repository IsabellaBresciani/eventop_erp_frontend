import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  to?: string
}

interface MarketplaceBreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function MarketplaceBreadcrumbs({ items }: MarketplaceBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mk-breadcrumb mb-4">
      <Link to="/marketplace" className="inline-flex items-center gap-1 hover:text-primary">
        <Home className="h-3.5 w-3.5" />
        Inicio
      </Link>
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2">
          <ChevronRight className="mk-breadcrumb-sep h-3.5 w-3.5" />
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span className="font-medium text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
