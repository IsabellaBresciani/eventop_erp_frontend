import { Star } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isFavoriteSalon, toggleFavoriteSalon } from '../../data/marketplace-venues'
import { useHostSession } from '../../hooks/useHostSession'

interface FavoriteButtonProps {
  salonId: string
  className?: string
  onChange?: (active: boolean) => void
}

export function FavoriteButton({ salonId, className = '', onChange }: FavoriteButtonProps) {
  const navigate = useNavigate()
  const { isAuthenticated } = useHostSession()
  const [active, setActive] = useState(() => isFavoriteSalon(salonId))

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/marketplace/registro')
      return
    }
    const next = toggleFavoriteSalon(salonId)
    setActive(next)
    onChange?.(next)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-[var(--mk-border)] bg-[var(--mk-bg-elevated)] shadow-soft backdrop-blur-sm transition-transform hover:scale-105 ${className}`}
    >
      <Star
        className={`h-4 w-4 ${active ? 'fill-primary text-primary' : 'text-ink-muted'}`}
      />
    </button>
  )
}
