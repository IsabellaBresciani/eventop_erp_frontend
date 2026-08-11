import { AnimatePresence, motion } from 'framer-motion'
import {
  Calendar,
  Copy,
  ExternalLink,
  Pencil,
  Search,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { GuestListEditor } from '../components/invitation/GuestListEditor'
import { loadEvents } from '../data/events-storage'
import {
  ensureInvitationConfig,
  formatInvitationDate,
  getInvitationListItems,
  type InvitationListItem,
  loadRsvps,
} from '../data/invitations-storage'
import { useAuthGuard } from '../hooks/useAuthGuard'
import type { GuestConfirmation } from '../types/guest-invitation'

export default function InvitationsPage() {
  const { salon } = useAuthGuard({ allowedRoles: ['admin'] })
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const fromStorage = sessionStorage.getItem('eventop_invitations_select')
    if (fromStorage) {
      setSelectedId(fromStorage)
      sessionStorage.removeItem('eventop_invitations_select')
    }
  }, [])

  const items = useMemo(() => {
    void tick
    return getInvitationListItems(loadEvents())
  }, [tick])

  useEffect(() => {
    if (!selectedId && items.length > 0) {
      setSelectedId(items[0].event.id)
    }
  }, [items, selectedId])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (item) =>
        item.event.clientName.toLowerCase().includes(q) ||
        item.event.eventType.toLowerCase().includes(q) ||
        item.config?.eventTitle.toLowerCase().includes(q),
    )
  }, [items, search])

  const selected =
    filtered.find((i) => i.event.id === selectedId) ??
    items.find((i) => i.event.id === selectedId) ??
    null

  const guests = selected ? loadRsvps(selected.event.id) : []

  const handleGuestsChange = (_next: GuestConfirmation[]) => {
    setTick((t) => t + 1)
  }

  const ensureAndRefresh = (item: InvitationListItem) => {
    ensureInvitationConfig(item.event, salon)
    setTick((t) => t + 1)
  }

  const publicUrl = (item: InvitationListItem) =>
    item.config?.publicUrl ||
    `${typeof window !== 'undefined' ? window.location.origin : ''}/inv/${item.event.id}`

  const copyLink = async (item: InvitationListItem) => {
    ensureAndRefresh(item)
    try {
      await navigator.clipboard.writeText(publicUrl(item))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <DashboardLayout
        salonName={salon}
        title="Invitaciones virtuales"
        subtitle="Editá invitaciones y revisá las listas de invitados confirmados"
      >
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por evento o cliente…"
              className="input-field pl-10"
            />
          </div>
          <p className="text-sm text-slate-500">
            {filtered.length} evento{filtered.length === 1 ? '' : 's'}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-5 xl:col-span-4">
            {filtered.map((item) => {
              const active = selected?.event.id === item.event.id
              const totalPeople = item.guestCount + item.companionCount
              return (
                <button
                  key={item.event.id}
                  type="button"
                  onClick={() => setSelectedId(item.event.id)}
                  className={`flex w-full gap-3 overflow-hidden rounded-2xl border bg-white p-3 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all ${
                    active
                      ? 'border-primary/40 ring-2 ring-primary/15'
                      : 'border-slate-200 hover:border-primary/25'
                  }`}
                >
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-20">
                    <img
                      src={item.coverUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 py-0.5">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {item.config?.eventTitle ??
                        `${item.event.clientName} — ${item.event.eventType}`}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {item.event.clientName} · {item.templateName}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {formatInvitationDate(item.event.date)} · {item.event.startTime}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          item.hasInvitation
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.hasInvitation ? 'Creada' : 'Sin crear'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
                        <Users className="h-3 w-3 text-primary" />
                        {item.guestCount} conf. · {totalPeople} pers.
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}

            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
                No hay invitaciones que coincidan con la búsqueda.
              </div>
            )}
          </div>

          <div className="lg:col-span-7 xl:col-span-8">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.event.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                >
                  <div className="relative h-36 bg-slate-200 sm:h-44">
                    <img
                      src={selected.coverUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-lg font-bold text-white sm:text-xl">
                        {selected.config?.eventTitle ??
                          `${selected.event.clientName} — ${selected.event.eventType}`}
                      </p>
                      <p className="text-sm text-white/80">
                        {formatInvitationDate(selected.event.date)} · {selected.event.startTime} hs
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/55 lg:hidden"
                      aria-label="Cerrar"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">
                    <Link
                      to={`/dashboard/invitaciones/${selected.event.id}`}
                      onClick={() => ensureAndRefresh(selected)}
                      className="dash-btn-primary py-2 text-sm"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Editar invitación
                    </Link>
                    <button
                      type="button"
                      onClick={() => copyLink(selected)}
                      className="dash-btn-secondary py-2 text-sm"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copied ? 'Copiado' : 'Copiar enlace'}
                    </button>
                    <a
                      href={publicUrl(selected)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dash-btn-secondary py-2 text-sm"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Vista pública
                    </a>
                  </div>

                  <div className="px-4 py-5 sm:px-5">
                    <GuestListEditor
                      eventId={selected.event.id}
                      guests={guests}
                      onChange={handleGuestsChange}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex min-h-[22rem] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 text-center"
                >
                  <Users className="h-10 w-10 text-slate-300" />
                  <p className="mt-3 text-sm font-medium text-slate-700">
                    Seleccioná una invitación
                  </p>
                  <p className="mt-1 max-w-sm text-xs text-slate-500">
                    Vas a poder editarla, copiar el enlace y ver quién confirmó asistencia.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DashboardLayout>
    </motion.div>
  )
}
