import { Check, ChevronDown, ChevronUp, LogOut, Settings, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSalonInitials } from '../../data/admin-salons'
import type { ManagedSalon } from '../../types/auth'

interface ProfileAccountMenuProps {
  salonName: string
  userName?: string
  userEmail?: string
  activeSalonId?: string
  salons?: ManagedSalon[]
  settingsPath: string
  showLabel?: boolean
  align?: 'left' | 'right'
  placement?: 'up' | 'down'
  onNavigate?: () => void
  onSwitchSalon?: (salonId: string) => void
  onLogout: () => void
}

function SalonAvatar({
  salon,
  size = 'sm',
}: {
  salon: Pick<ManagedSalon, 'name' | 'accent'>
  size?: 'sm' | 'lg'
}) {
  const sizeClass = size === 'lg' ? 'h-16 w-16 text-lg' : 'h-9 w-9 text-xs'
  const accent = salon.accent ?? '#6A24E3'

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${sizeClass}`}
      style={{ backgroundColor: accent }}
    >
      {getSalonInitials(salon.name)}
    </span>
  )
}

export function ProfileAccountMenu({
  salonName,
  userName,
  userEmail,
  activeSalonId,
  salons = [],
  settingsPath,
  showLabel = false,
  align = 'left',
  placement = 'up',
  onNavigate,
  onSwitchSalon,
  onLogout,
}: ProfileAccountMenuProps) {
  const [open, setOpen] = useState(false)
  const [showAllSalons, setShowAllSalons] = useState(true)
  const rootRef = useRef<HTMLDivElement>(null)

  const canSwitchSalons = salons.length > 1 && Boolean(onSwitchSalon)
  const activeSalon =
    salons.find((item) => item.id === activeSalonId) ??
    salons.find((item) => item.name === salonName) ??
    salons[0]
  const displayName = userName ?? 'Administrador'
  const firstName = displayName.split(/\s+/)[0] ?? displayName
  const triggerInitials = getSalonInitials(activeSalon?.name ?? salonName)
  const triggerAccent = activeSalon?.accent ?? '#6A24E3'

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

  const handleSwitchSalon = (salonId: string) => {
    if (salonId === activeSalonId) {
      setOpen(false)
      return
    }
    onSwitchSalon?.(salonId)
    setOpen(false)
    onNavigate?.()
  }

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
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ backgroundColor: triggerAccent }}
        >
          {triggerInitials}
        </span>
        {showLabel && <span className="truncate">{salonName}</span>}
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute z-50 w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_16px_48px_rgba(15,23,42,0.14)] ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${placement === 'down' ? 'top-full mt-2' : 'bottom-full mb-2'} ${
            showLabel ? 'lg:w-[min(20rem,calc(100vw-1.5rem))]' : ''
          }`}
        >
          {canSwitchSalons ? (
            <>
              <div className="relative border-b border-black/[0.06] px-4 pb-4 pt-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute right-2 top-2 rounded-lg p-1.5 text-apple-label transition-colors hover:bg-black/[0.04] hover:text-ink-muted"
                  aria-label="Cerrar menú"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} />
                </button>

                {userEmail && (
                  <p className="truncate pr-8 text-center text-sm text-ink-muted">{userEmail}</p>
                )}

                <div className="mt-4 flex flex-col items-center text-center">
                  <SalonAvatar
                    salon={activeSalon ?? { name: salonName, accent: triggerAccent }}
                    size="lg"
                  />
                  <p className="mt-3 text-lg font-normal text-ink">
                    ¡Hola, {firstName}!
                  </p>
                  <Link
                    role="menuitem"
                    to={settingsPath}
                    onClick={() => {
                      setOpen(false)
                      onNavigate?.()
                    }}
                    className="mt-3 inline-flex items-center rounded-full border border-primary/25 px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/[0.06]"
                  >
                    Administrar tu salón
                  </Link>
                </div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => setShowAllSalons((prev) => !prev)}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-ink-muted transition-colors hover:bg-apple-fill"
                >
                  <span>{showAllSalons ? 'Ocultar más salones' : 'Mostrar más salones'}</span>
                  {showAllSalons ? (
                    <ChevronUp className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  )}
                </button>

                {showAllSalons && (
                  <div className="border-t border-black/[0.06] py-1">
                    {salons.map((salon) => {
                      const isActive = salon.id === activeSalonId
                      return (
                        <button
                          key={salon.id}
                          role="menuitem"
                          type="button"
                          onClick={() => handleSwitchSalon(salon.id)}
                          className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-apple-fill ${
                            isActive ? 'bg-primary/[0.04]' : ''
                          }`}
                        >
                          <SalonAvatar salon={salon} />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-ink">
                              {salon.name}
                            </span>
                            {salon.location && (
                              <span className="block truncate text-xs text-ink-muted">
                                {salon.location}
                              </span>
                            )}
                          </span>
                          {isActive && (
                            <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={2} />
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="border-t border-black/[0.06] py-1">
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    onLogout()
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-ink transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  Cerrar sesión
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="truncate px-3 pb-1.5 pt-3 text-[11px] font-medium uppercase tracking-wider text-apple-label">
                Cuenta
              </p>
              <Link
                role="menuitem"
                to={settingsPath}
                onClick={() => {
                  setOpen(false)
                  onNavigate?.()
                }}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-primary/[0.06] hover:text-primary"
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
            </>
          )}
        </div>
      )}
    </div>
  )
}
