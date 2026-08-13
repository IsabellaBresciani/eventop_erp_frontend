import {
  Bell,
  CalendarDays,
  Inbox,
  LayoutGrid,
  LogOut,
  Plus,
  QrCode,
  UserCircle,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface DashboardHeaderProps {
  salonName: string
}

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutGrid, label: 'Inicio', exact: true },
  { to: '/dashboard/mensajeria', icon: Inbox, label: 'Consultas', exact: false },
  { to: '/dashboard/checkin', icon: QrCode, label: 'Check-in', exact: false },
  { to: '/dashboard/perfil', icon: UserCircle, label: 'Perfil', exact: false },
] as const

export function DashboardHeader({ salonName }: DashboardHeaderProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    sessionStorage.removeItem('eventop_auth')
    navigate('/login', { replace: true })
  }

  const isActive = (to: string, exact: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to)

  return (
    <header className="enterprise-header">
      <div className="section-container flex h-[3.75rem] items-center gap-3 sm:h-16 sm:gap-5">
        <Link
          to="/dashboard"
          className="group flex shrink-0 items-center gap-2.5 rounded-full py-1 pr-2 transition-colors hover:bg-white/50 sm:pr-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-800 text-white shadow-soft">
            <CalendarDays className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </div>
          <span className="hidden text-[15px] font-semibold tracking-tight text-slate-900 sm:inline">
            {t('dashboardheader.even')}
            <span className="text-primary">{t('dashboardheader.top')}</span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          <div className="inline-flex items-center gap-0.5 rounded-full border border-white/50 bg-white/30 p-1 shadow-sm backdrop-blur-md">
            {NAV_ITEMS.map(({ to, icon: Icon, label, exact }) => {
              const active = isActive(to, exact)
              return (
                <Link
                  key={to}
                  to={to}
                  className={`enterprise-nav-link ${active ? 'enterprise-nav-link-active' : ''}`}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  <span>{label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        <nav className="flex flex-1 items-center gap-0.5 overflow-x-auto md:hidden">
          {NAV_ITEMS.map(({ to, icon: Icon, label, exact }) => {
            const active = isActive(to, exact)
            return (
              <Link
                key={to}
                to={to}
                className={`enterprise-nav-link shrink-0 ${active ? 'enterprise-nav-link-active' : ''}`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                <span className="text-xs">{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5">
          {location.pathname.startsWith('/dashboard') && (
            <button
              type="button"
              onClick={() => navigate('/dashboard?nuevo=1')}
              className="btn-primary hidden px-4 py-2 text-sm sm:inline-flex"
            >
              <Plus className="h-4 w-4" />
              {t('dashboardheader.nuevo_evento')}
            </button>
          )}

          <button
            type="button"
            className="relative rounded-full p-2.5 text-slate-600 transition-all hover:bg-white/70 hover:text-slate-900"
            aria-label="Notificaciones"
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-white/80" />
          </button>

          <Link
            to="/dashboard/perfil"
            className="hidden items-center gap-2 rounded-full border border-white/50 bg-white/40 py-1 pl-1 pr-3 shadow-sm backdrop-blur-md transition-all hover:bg-white/70 md:flex"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-800 text-[11px] font-bold text-white">
              {salonName.slice(0, 2).toUpperCase()}
            </div>
            <span className="max-w-[6.5rem] truncate text-sm font-medium text-slate-800">
              {salonName}
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full p-2.5 text-slate-500 transition-all hover:bg-red-500/10 hover:text-red-600"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  )
}
