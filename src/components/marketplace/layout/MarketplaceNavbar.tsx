import { Menu, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useHostSession } from '../../../hooks/useHostSession'
import { MarketplaceLogo } from './MarketplaceLogo'

interface MarketplaceNavbarProps {
  transparent?: boolean
}

export function MarketplaceNavbar({ transparent = false }: MarketplaceNavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { session } = useHostSession()
  const location = useLocation()

  const overVideo = transparent && !scrolled

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const navLinks = [
    { label: 'Inicio', to: '/marketplace', match: (p: string) => p === '/marketplace' },
    {
      label: 'Salones',
      to: '/marketplace/salones',
      match: (p: string) => p.startsWith('/marketplace/salones'),
    },
    { label: 'Sobre nosotros', to: '/marketplace#sobre', match: () => false },
    { label: 'Ayuda', to: '/marketplace#ayuda', match: () => false },
  ]

  return (
    <header
      className={`z-50 transition-all duration-300 ${
        overVideo
          ? 'absolute inset-x-0 top-0 bg-transparent'
          : 'sticky top-0 border-b border-black/[0.06] bg-white/75 backdrop-blur-2xl'
      }`}
    >
      <div className="mk-container flex h-14 items-center justify-between lg:h-16">
        <MarketplaceLogo light={overVideo} />

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => {
            const active = link.match(location.pathname)
            return (
              <Link
                key={link.to}
                to={link.to}
                className={
                  overVideo
                    ? `rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                        active ? 'text-white' : 'text-white/80 hover:text-white'
                      }`
                    : `mk-nav-link ${active ? 'mk-nav-link-active' : ''}`
                }
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {session ? (
            <Link
              to="/marketplace/cuenta"
              className={
                overVideo
                  ? 'mk-btn-primary !px-4 !py-2 text-[13px]'
                  : 'mk-btn-soft !px-4 !py-2 text-[13px]'
              }
            >
              <User className="h-4 w-4" />
              Mi cuenta
            </Link>
          ) : (
            <>
              <Link
                to="/marketplace/ingresar"
                className={
                  overVideo
                    ? 'rounded-full px-3.5 py-2 text-[13px] font-medium text-white/85 hover:text-white'
                    : 'mk-nav-link'
                }
              >
                Ingresar
              </Link>
              <Link to="/marketplace/registro" className="mk-btn-primary !px-4 !py-2 text-[13px]">
                Registrarse
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className={`rounded-lg p-2 lg:hidden ${
            overVideo ? 'text-white hover:bg-white/10' : 'text-ink-muted hover:bg-black/[0.04]'
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className={`border-t px-5 py-4 lg:hidden ${
            overVideo ? 'border-white/10 bg-black/70 backdrop-blur-xl' : 'border-black/[0.06] bg-white'
          }`}
        >
          <nav className="flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-xl px-3 py-2.5 text-[15px] font-medium ${
                  overVideo
                    ? 'text-white/90 hover:bg-white/10'
                    : 'text-ink-muted hover:bg-black/[0.04] hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className={`my-2 ${overVideo ? 'border-white/10' : 'border-black/[0.06]'}`} />
            {session ? (
              <Link to="/marketplace/cuenta" className="mk-btn-primary justify-center">
                Mi cuenta
              </Link>
            ) : (
              <>
                <Link
                  to="/marketplace/ingresar"
                  className={`rounded-xl px-3 py-2.5 text-[15px] font-medium ${
                    overVideo ? 'text-white/90' : 'text-ink-muted'
                  }`}
                >
                  Ingresar
                </Link>
                <Link to="/marketplace/registro" className="mk-btn-primary justify-center">
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
