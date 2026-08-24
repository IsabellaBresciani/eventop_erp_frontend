import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { MarketplaceBreadcrumbs } from '../components/marketplace/layout/MarketplaceBreadcrumbs'
import { MarketplaceLayout } from '../components/marketplace/layout/MarketplaceLayout'
import { HostAccountLayout } from '../components/marketplace/host-account/HostAccountLayout'
import {
  getFavoriteSalonIds,
  getHostBudgets,
  getHostInquiries,
  getHostVisits,
  getVenueProfile,
} from '../data/marketplace-venues'
import { useHostSession } from '../hooks/useHostSession'
import { loginHost, registerHost } from '../lib/host-session'

export default function MarketplaceHostRegisterPage() {
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    registerHost(
      String(form.get('email')),
      String(form.get('birthDate')),
      String(form.get('name')),
    )
    navigate('/marketplace/cuenta')
  }

  return (
    <MarketplaceLayout>
      <div className="mk-container flex min-h-[60vh] items-center justify-center py-16">
        <div className="w-full max-w-md">
          <Link
            to="/marketplace"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al marketplace
          </Link>

          <div className="mk-card p-8">
            <MarketplaceBreadcrumbs items={[{ label: 'Registro' }]} />
            <h1 className="mk-title mt-4 text-2xl">Registrate como anfitrión</h1>
            <p className="mt-2 text-sm text-ink-muted">
              Creá tu cuenta con email y fecha de nacimiento para buscar salones, guardar favoritos
              y hacer seguimiento de consultas.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-muted">Nombre</label>
                <input name="name" type="text" className="mk-input" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-muted">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="mk-input"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-muted">
                  Fecha de nacimiento
                </label>
                <input name="birthDate" type="date" required className="mk-input" />
              </div>
              <button type="submit" className="mk-btn-primary w-full">
                Crear cuenta
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-ink-muted">
              ¿Ya tenés cuenta?{' '}
              <Link to="/marketplace/ingresar" className="font-semibold text-primary hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  )
}

export function MarketplaceHostLoginPage() {
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const session = loginHost(String(form.get('email')), String(form.get('birthDate')))
    if (session) navigate('/marketplace/cuenta')
  }

  return (
    <MarketplaceLayout>
      <div className="mk-container flex min-h-[60vh] items-center justify-center py-16">
        <div className="w-full max-w-md">
          <Link
            to="/marketplace"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al marketplace
          </Link>

          <div className="mk-card p-8">
            <MarketplaceBreadcrumbs items={[{ label: 'Ingresar' }]} />
            <h1 className="mk-title mt-4 text-2xl">Iniciar sesión</h1>
            <p className="mt-2 text-sm text-ink-muted">
              Accedé a tus invitaciones, consultas, visitas agendadas y favoritos.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-muted">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="mk-input"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-muted">
                  Fecha de nacimiento
                </label>
                <input name="birthDate" type="date" required className="mk-input" />
              </div>
              <button type="submit" className="mk-btn-primary w-full">
                Ingresar
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-ink-muted">
              ¿No tenés cuenta?{' '}
              <Link to="/marketplace/registro" className="font-semibold text-primary hover:underline">
                Registrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  )
}

export function MarketplaceHostDashboardPage() {
  const { session } = useHostSession()

  if (!session) {
    return <Navigate to="/marketplace/ingresar" replace />
  }

  const favorites = getFavoriteSalonIds()
  const visits = getHostVisits()
  const inquiries = getHostInquiries()
  const budgets = getHostBudgets()

  return (
    <HostAccountLayout title={`Hola, ${session.name}`} subtitle="Panel del anfitrión">
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardPanel title="Invitaciones virtuales" count={0} empty="No tenés invitaciones activas." />
        <DashboardPanel title="Mis eventos" count={0} empty="Todavía no organizaste eventos." />
        <DashboardPanel
          title="Consultas enviadas"
          count={inquiries.length}
          empty="No enviaste consultas aún."
        >
          {inquiries.slice(0, 3).map((inq) => (
            <li key={inq.id} className="text-sm text-ink-muted">
              <span className="font-medium text-ink">{inq.salonName}</span> — {inq.subject} (
              {inq.status})
            </li>
          ))}
        </DashboardPanel>
        <DashboardPanel title="Visitas agendadas" count={visits.length} empty="No tenés visitas pendientes.">
          {visits.slice(0, 3).map((visit) => (
            <li key={visit.id} className="text-sm text-ink-muted">
              <span className="font-medium text-ink">{visit.salonName}</span> — {visit.date} {visit.slot} (
              {visit.status})
            </li>
          ))}
        </DashboardPanel>
        <DashboardPanel title="Presupuestos guardados" count={budgets.length} empty="No guardaste presupuestos.">
          {budgets.slice(0, 3).map((budget) => (
            <li key={budget.id} className="text-sm text-ink-muted">
              <span className="font-medium text-ink">{budget.salonName}</span> —{' '}
              {budget.total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
            </li>
          ))}
        </DashboardPanel>
        <DashboardPanel id="favoritos" title="Favoritos" count={favorites.length} empty="No destacaste salones aún.">
          {favorites.map((id) => {
            const profile = getVenueProfile(id)
            if (!profile) return null
            return (
              <li key={id}>
                <Link
                  to={`/marketplace/salones/${id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {profile.name}
                </Link>
              </li>
            )
          })}
        </DashboardPanel>
      </div>
    </HostAccountLayout>
  )
}

function DashboardPanel({
  id,
  title,
  count,
  empty,
  children,
}: {
  id?: string
  title: string
  count: number
  empty: string
  children?: ReactNode
}) {
  return (
    <section id={id} className="mk-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-ink">{title}</h2>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
          {count}
        </span>
      </div>
      {count === 0 ? (
        <p className="text-sm text-ink-muted">{empty}</p>
      ) : (
        <ul className="space-y-2">{children}</ul>
      )}
    </section>
  )
}
