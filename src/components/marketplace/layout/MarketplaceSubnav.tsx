import { Compass, Heart, Map, Search, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useHostSession } from '../../../hooks/useHostSession'

const tabs = [
  { id: 'home', label: 'Inicio', to: '/marketplace', icon: Compass, match: (path: string, _search: string) => path === '/marketplace' },
  {
    id: 'search',
    label: 'Buscar',
    to: '/marketplace/salones',
    icon: Search,
    match: (path: string, search: string) =>
      path.startsWith('/marketplace/salones') && !search.includes('map=1'),
  },
  {
    id: 'map',
    label: 'Mapa',
    to: '/marketplace/salones?map=1',
    icon: Map,
    match: (path: string, search: string) =>
      path.startsWith('/marketplace/salones') && search.includes('map=1'),
  },
]

export function MarketplaceSubnav() {
  const location = useLocation()
  const { session } = useHostSession()
  const accountTo = session ? '/marketplace/cuenta' : '/marketplace/ingresar'

  const isAccountActive =
    location.pathname.startsWith('/marketplace/cuenta') ||
    location.pathname.startsWith('/marketplace/ingresar') ||
    location.pathname.startsWith('/marketplace/registro')

  return (
    <div className="mk-subnav hidden md:block">
      <div className="mk-container flex items-center gap-2 py-3">
        {tabs.map((tab) => {
          const active = tab.match(location.pathname, location.search)
          const Icon = tab.icon
          return (
            <Link
              key={tab.id}
              to={tab.to}
              className={`mk-nav-link inline-flex items-center gap-2 ${active ? 'mk-nav-link-active' : ''}`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Link>
          )
        })}
        <div className="ml-auto flex items-center gap-2">
          <Link
            to={accountTo}
            className={`mk-nav-link inline-flex items-center gap-2 ${isAccountActive ? 'mk-nav-link-active' : ''}`}
          >
            <User className="h-4 w-4" />
            {session ? 'Mi cuenta' : 'Ingresar'}
          </Link>
          {session && (
            <Link to="/marketplace/cuenta#favoritos" className="mk-nav-link inline-flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favoritos
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export function MarketplaceMobileNav() {
  const location = useLocation()
  const { session } = useHostSession()
  const accountTo = session ? '/marketplace/cuenta' : '/marketplace/ingresar'

  const mobileTabs = [
    ...tabs,
    {
      id: 'account',
      label: session ? 'Cuenta' : 'Ingresar',
      to: accountTo,
      icon: User,
      match: (path: string, _search: string) =>
        path.startsWith('/marketplace/cuenta') ||
        path.startsWith('/marketplace/ingresar') ||
        path.startsWith('/marketplace/registro'),
    },
  ]

  return (
    <nav className="mk-mobile-nav" aria-label="Navegación principal">
      <div className="grid grid-cols-4 gap-1 px-2 py-2">
        {mobileTabs.map((tab) => {
          const active = tab.match(location.pathname, location.search)
          const Icon = tab.icon
          return (
            <Link
              key={tab.id}
              to={tab.to}
              className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold transition-colors ${
                active ? 'bg-primary/10 text-primary' : 'text-ink-muted'
              }`}
            >
              <Icon className="h-5 w-5" />
              {tab.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
