import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Menu,
  Inbox,
  Mail,
  QrCode,
  BarChart3,
  Users,
  X,
} from 'lucide-react'
import { type ReactNode, useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearAuthSession, getAuthSession } from '../../lib/auth-session'
import { ProfileAccountMenu } from './ProfileAccountMenu'

interface DashboardLayoutProps {
  salonName: string
  children: ReactNode
  title?: ReactNode
  subtitle?: string
  action?: ReactNode
}

const ADMIN_NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutGrid, label: 'Inicio', exact: true },
  { to: '/dashboard/mensajeria', icon: Inbox, label: 'Consultas', exact: false },
  { to: '/dashboard/invitaciones', icon: Mail, label: 'Invitaciones', exact: false },
  { to: '/dashboard/reportes', icon: BarChart3, label: 'Reportes', exact: false },
  { to: '/dashboard/empleados', icon: Users, label: 'Empleados', exact: false },
  { to: '/dashboard/checkin', icon: QrCode, label: 'Check-in', exact: false },
]

const EMPLOYEE_NAV_ITEMS = [
  { to: '/dashboard/mis-eventos', icon: CalendarDays, label: 'Mis eventos', exact: true },
]

const SIDEBAR_STORAGE_KEY = 'eventop_sidebar_expanded'

function loadSidebarExpanded(): boolean {
  try {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    if (stored !== null) return stored === 'true'
  } catch {
    /* use default */
  }
  return typeof window !== 'undefined' ? window.innerWidth >= 1280 : true
}

export function DashboardLayout({
  salonName,
  children,
  title,
  subtitle,
  action,
}: DashboardLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarExpanded, setSidebarExpanded] = useState(loadSidebarExpanded)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const showLabels = sidebarExpanded || mobileSidebarOpen

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarExpanded))
  }, [sidebarExpanded])

  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileSidebarOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileSidebarOpen])

  const handleLogout = () => {
    clearAuthSession()
    navigate('/login', { replace: true })
  }

  const session = getAuthSession()
  const navItems = session?.role === 'employee' ? EMPLOYEE_NAV_ITEMS : ADMIN_NAV_ITEMS
  const homePath = session?.role === 'employee' ? '/dashboard/mis-eventos' : '/dashboard'
  const profilePath = session?.role === 'employee' ? '/dashboard/mi-perfil' : '/dashboard/perfil'

  const isActive = (to: string, exact: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to)

  const toggleSidebar = useCallback(() => {
    setSidebarExpanded((prev) => !prev)
  }, [])

  const sidebarContent = (
    <>
      <div
        className={`flex items-center py-5 ${
          showLabels ? 'justify-between px-4' : 'justify-center px-2'
        }`}
      >
        <Link
          to={homePath}
          className={`flex items-center gap-3 ${showLabels ? '' : 'justify-center'}`}
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-800 text-sm font-bold text-white shadow-soft">
            ET
          </div>
          {showLabels && (
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
              Even<span className="text-primary">Top</span>
            </span>
          )}
        </Link>

        {mobileSidebarOpen && (
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="rounded-xl p-2 text-ink/40 transition-colors hover:bg-white/80 hover:text-ink lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        )}
      </div>

      <nav className={`flex flex-1 flex-col gap-1 py-2 ${showLabels ? 'px-3' : 'px-2'}`}>
        {navItems.map(({ to, icon: Icon, label, exact }) => {
          const active = isActive(to, exact)
          return (
            <Link
              key={to}
              to={to}
              title={label}
              onClick={() => setMobileSidebarOpen(false)}
              className={`dash-nav-item group ${active ? 'dash-nav-item-active' : ''}`}
            >
              <span className="dash-nav-icon-wrap">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              {showLabels && <span className="truncate">{label}</span>}
            </Link>
          )
        })}
      </nav>

      <div
        className={`flex flex-col gap-2 border-t border-black/[0.05] p-3 ${
          showLabels ? '' : 'items-center'
        }`}
      >
        {showLabels && (
          <button
            type="button"
            className="relative flex rounded-xl p-2.5 text-ink/45 transition-colors hover:bg-white/80 hover:text-ink"
            aria-label="Notificaciones"
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-gold ring-2 ring-white" />
          </button>
        )}

        <ProfileAccountMenu
          salonName={salonName}
          settingsPath={profilePath}
          showLabel={showLabels}
          onNavigate={() => setMobileSidebarOpen(false)}
          onLogout={handleLogout}
        />

        <button
          type="button"
          onClick={toggleSidebar}
          className={`dash-nav-item hidden text-ink/40 hover:bg-white/80 hover:text-ink lg:flex ${
            showLabels ? '' : 'justify-center px-2'
          }`}
          aria-label={sidebarExpanded ? 'Contraer menú' : 'Expandir menú'}
          title={sidebarExpanded ? 'Contraer menú' : 'Expandir menú'}
        >
          <span className="dash-nav-icon-wrap">
            {sidebarExpanded ? (
              <ChevronLeft className="h-[18px] w-[18px]" strokeWidth={1.75} />
            ) : (
              <ChevronRight className="h-[18px] w-[18px]" strokeWidth={1.75} />
            )}
          </span>
          {showLabels && <span>{sidebarExpanded ? 'Contraer' : 'Expandir'}</span>}
        </button>
      </div>
    </>
  )

  return (
    <div className="dash-shell flex min-h-screen">
      {mobileSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Cerrar menú"
        />
      )}

      <aside
        data-expanded={showLabels}
        className={`dash-sidebar fixed inset-y-0 left-0 z-50 flex shrink-0 flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] lg:sticky lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${mobileSidebarOpen || sidebarExpanded ? 'w-60' : 'w-[4.5rem]'} lg:flex`}
      >
        {sidebarContent}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="dash-topbar sticky top-0 z-20 flex h-14 items-center justify-between px-4 sm:px-6 lg:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="rounded-xl p-2.5 text-[#6e6e73] transition-colors hover:bg-black/[0.04]"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <Link to={homePath} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-800 text-xs font-bold text-white shadow-soft">
                ET
              </div>
              <span className="text-sm font-semibold text-ink">
                Even<span className="text-primary">Top</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="relative rounded-xl p-2.5 text-slate-500 hover:bg-white/60"
              aria-label="Notificaciones"
            >
              <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-white" />
            </button>
            <ProfileAccountMenu
              salonName={salonName}
              settingsPath={profilePath}
              align="right"
              placement="down"
              onLogout={handleLogout}
            />
          </div>
        </header>

        <main className="dash-main flex-1 px-5 py-7 sm:px-7 sm:py-9 lg:px-9 xl:px-11">
          {(title || action) && (
            <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                {title && (
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                    {title}
                  </h1>
                )}
                {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
              </div>
              {action && <div className="shrink-0">{action}</div>}
            </header>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
