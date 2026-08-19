import { Link } from 'react-router-dom'
import { MarketplaceLogo } from './MarketplaceLogo'

export function MarketplaceFooter() {
  return (
    <footer id="ayuda" className="border-t border-black/[0.06] bg-[#f5f5f7] py-14">
      <div className="mk-container">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <MarketplaceLogo />
            <p className="mt-4 text-[15px] leading-[1.5] text-ink-muted">
              Encontrá el salón ideal, compará opciones y organizá tu evento con tranquilidad.
            </p>
          </div>
          <div>
            <p className="mk-eyebrow">Explorar</p>
            <ul className="mt-4 space-y-2.5 text-[15px] text-ink-muted">
              <li>
                <Link to="/marketplace/salones" className="transition-colors hover:text-ink">
                  Buscar salones
                </Link>
              </li>
              <li>
                <Link to="/marketplace/salones?map=1" className="transition-colors hover:text-[var(--mk-text)]">
                  Ver en mapa
                </Link>
              </li>
              <li>
                <Link to="/marketplace#categorias" className="transition-colors hover:text-[var(--mk-text)]">
                  Categorías
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mk-eyebrow">Anfitriones</p>
            <ul className="mt-4 space-y-2.5 text-[15px] text-ink-muted">
              <li>
                <Link to="/marketplace/registro" className="transition-colors hover:text-[var(--mk-text)]">
                  Crear cuenta
                </Link>
              </li>
              <li>
                <Link to="/marketplace/ingresar" className="transition-colors hover:text-[var(--mk-text)]">
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link to="/marketplace/cuenta" className="transition-colors hover:text-[var(--mk-text)]">
                  Mi panel
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mk-eyebrow">Para salones</p>
            <ul className="mt-4 space-y-2.5 text-[15px] text-ink-muted">
              <li>
                <Link to="/" className="transition-colors hover:text-[var(--mk-text)]">
                  EvenTop ERP
                </Link>
              </li>
              <li>
                <Link to="/login" className="transition-colors hover:text-[var(--mk-text)]">
                  Acceso administradores
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-black/[0.06] pt-8 text-center text-xs text-ink-muted">
          © {new Date().getFullYear()} EvenTop Marketplace. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
