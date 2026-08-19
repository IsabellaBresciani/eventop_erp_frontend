import { Bell, CalendarDays, Inbox, LayoutGrid, Mail, Menu, Star, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useHostSession } from '../../../hooks/useHostSession'
import { clearHostSession } from '../../../lib/host-session'
import { Logo } from '../../ui/Logo'

const NAV_ITEMS = [
  { to: '/marketplace/cuenta', icon: LayoutGrid, label: 'Resumen' },
  { to: '/marketplace/cuenta/favoritos', icon: Star, label: 'Salones favoritos' },
  { to: '/marketplace/cuenta/agenda', icon: CalendarDays, label: 'Agenda' },
  { to: '/marketplace/cuenta/consultas', icon: Inbox, label: 'Consultas' },
  { to: '/marketplace/cuenta/invitaciones', icon: Mail, label: 'Invitaciones' },
]

interface HostAccountLayoutProps {
  title: string
  subtitle?: string
  headerActions?: ReactNode
  children: ReactNode
}

export function HostAccountLayout({ title, subtitle, headerActions, children }: HostAccountLayoutProps) {
  const { session } = useHostSession()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const initials = (session?.name ?? 'Anfitrión')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--mk-bg)' }}>
      {mobileNavOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Cerrar menú"
        />
      )}

      <aside
        className={`dash-sidebar fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <Logo />
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5 text-ink-muted" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const active = to === '/marketplace/cuenta' ? location.pathname === to : location.pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileNavOpen(false)}
                className={`dash-nav-item ${active ? 'dash-nav-item-active' : 'text-ink-muted hover:text-ink'}`}
              >
                <span className="dash-nav-icon-wrap">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </span>
                <span className="truncate text-[13px]">{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex flex-col gap-3 border-t p-4" style={{ borderColor: 'var(--mk-border)' }}>
          <Link
            to="/marketplace/cuenta/ajustes"
            onClick={() => setMobileNavOpen(false)}
            className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 transition-colors hover:bg-primary/5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {initials || 'AN'}
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[13px] font-semibold text-ink">{session?.name ?? 'Anfitrión'}</p>
              <p className="truncate text-[11px] text-ink-muted">Anfitrión</p>
            </div>
          </Link>
          <div className="flex items-center justify-between text-[11px] font-medium text-ink-muted">
            <Link to="/marketplace" className="hover:text-primary">
              Ayuda
            </Link>
            <button
              type="button"
              onClick={() => {
                clearHostSession()
                navigate('/marketplace/ingresar')
              }}
              className="hover:text-primary"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="dash-topbar sticky top-0 z-20 flex h-14 items-center justify-between px-4 sm:px-6 lg:hidden"
          style={{ borderBottom: '1px solid var(--mk-border)' }}
        >
          <button type="button" onClick={() => setMobileNavOpen(true)} aria-label="Abrir menú">
            <Menu className="h-5 w-5 text-ink" />
          </button>
          <span className="truncate text-sm font-semibold text-ink">{title}</span>
          <Bell className="h-[18px] w-[18px] text-ink-muted" />
        </header>

        <main className="flex-1 px-5 py-7 sm:px-7 sm:py-9 lg:px-10">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
            </div>
            {headerActions && <div className="flex shrink-0 items-center gap-2">{headerActions}</div>}
          </header>

          {children}
        </main>
      </div>
    </div>
  )
}
