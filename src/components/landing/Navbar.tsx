import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '../ui/Logo'
import { useTranslation } from 'react-i18next'

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'register') => void
}

export function Navbar({ onOpenAuth }: NavbarProps) {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Solución', href: '#solucion' },
    { label: 'Funciones', href: '#funciones' },
    { label: 'Testimonios', href: '#testimonios' },
    { label: 'Contacto', href: '#footer' },
  ]

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'border-b border-surface-border bg-white/80 shadow-sm backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="section-container flex h-16 items-center justify-between lg:h-20">
          <Link to="/" aria-label="EvenTop inicio">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login" className="btn-ghost">
              {t('navbar.login')}
            </Link>
            <button type="button" onClick={() => onOpenAuth('register')} className="btn-primary">
              {t('navbar.comenzar_prueba_gratis')}
            </button>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-surface-border bg-white px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-primary/5 hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-surface-border" />
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="btn-ghost justify-start"
              >
                {t('navbar.login')}
              </Link>
              <button
                type="button"
                onClick={() => {
                  onOpenAuth('register')
                  setMobileOpen(false)
                }}
                className="btn-primary"
              >
                {t('navbar.comenzar_prueba_gratis')}
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
