import { LogOut, Settings } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

interface ProfileAccountMenuProps {
  salonName: string
  settingsPath: string
  showLabel?: boolean
  align?: 'left' | 'right'
  placement?: 'up' | 'down'
  onNavigate?: () => void
  onLogout: () => void
}

export function ProfileAccountMenu({
  salonName,
  settingsPath,
  showLabel = false,
  align = 'left',
  placement = 'up',
  onNavigate,
  onLogout,
}: ProfileAccountMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const initials = salonName.slice(0, 2).toUpperCase()

  return (
    <div ref={rootRef} className={`relative ${showLabel ? 'w-full' : ''}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`dash-nav-item ${showLabel ? 'w-full' : 'justify-center px-2'} ${
          open ? 'bg-white/80 text-ink' : ''
        }`}
        title={salonName}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menú de cuenta"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
          {initials}
        </span>
        {showLabel && <span className="truncate">{salonName}</span>}
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute z-50 min-w-[11.5rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-[0_12px_40px_rgba(15,23,42,0.12)] ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${
            placement === 'down' ? 'top-full mt-2' : 'bottom-full mb-2'
          } ${showLabel ? 'w-full' : ''}`}
        >
          <p className="truncate px-3 pb-1.5 pt-1 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Cuenta
          </p>
          <Link
            role="menuitem"
            to={settingsPath}
            onClick={() => {
              setOpen(false)
              onNavigate?.()
            }}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-primary/[0.06] hover:text-primary"
          >
            <Settings className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            Configuración
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              setOpen(false)
              onLogout()
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
