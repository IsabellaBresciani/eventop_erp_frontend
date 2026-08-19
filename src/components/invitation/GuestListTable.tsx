import { Check, Filter, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { upsertRsvp } from '../../data/invitations-storage'
import { DEFAULT_TABLE_PAGE_SIZE, TablePagination } from '../ui/TablePagination'
import type { GuestConfirmation } from '../../types/guest-invitation'

interface GuestListTableProps {
  eventId: string
  guests: GuestConfirmation[]
  onChange: (guests: GuestConfirmation[]) => void
  venueCapacity?: number
}

const MENU_STYLES: Record<string, string> = {
  Vegetariano: 'bg-emerald-50 text-emerald-700',
  General: 'bg-primary/10 text-primary',
  Celíaco: 'bg-amber-50 text-amber-700',
  'Menú Infantil': 'bg-sky-50 text-sky-700',
}

const MENU_OPTIONS: NonNullable<GuestConfirmation['menuType']>[] = [
  'General',
  'Vegetariano',
  'Celíaco',
  'Menú Infantil',
]

const AGE_OPTIONS: NonNullable<GuestConfirmation['ageType']>[] = ['Adulto', 'Niño']

function resolveStatus(guest: GuestConfirmation): NonNullable<GuestConfirmation['rsvpStatus']> {
  return guest.rsvpStatus ?? (guest.confirmedAt ? 'Confirmado' : 'Pendiente')
}

function initials(guest: GuestConfirmation): string {
  return `${guest.firstName?.[0] ?? ''}${guest.lastName?.[0] ?? ''}`.toUpperCase()
}

export function GuestListTable({
  eventId,
  guests,
  onChange,
  venueCapacity = 285,
}: GuestListTableProps) {
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<GuestConfirmation | null>(null)
  const pageSize = DEFAULT_TABLE_PAGE_SIZE

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return guests
    return guests.filter((g) => `${g.firstName} ${g.lastName}`.toLowerCase().includes(q))
  }, [guests, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  const totalGuestsCount = guests.reduce((n, g) => n + 1 + g.companions.length, 0)
  const pendingCount = guests.filter((g) => resolveStatus(g) === 'Pendiente').length
  const capacityPct = Math.min(100, Math.round((totalGuestsCount / venueCapacity) * 100))

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const startEdit = (guest: GuestConfirmation) => {
    setEditing({ ...guest, companions: guest.companions.map((c) => ({ ...c })) })
  }

  const saveEdit = () => {
    if (!editing) return
    onChange(upsertRsvp(eventId, editing))
    setEditing(null)
  }

  const actionLabel = selectedIds.length === 1 ? 'Editar' : 'Exportar'

  const handleAction = () => {
    if (selectedIds.length === 1) {
      const guest = guests.find((g) => g.id === selectedIds[0])
      if (guest) startEdit(guest)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <p className="text-xs font-medium text-slate-500">Total Invitados</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{totalGuestsCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <p className="text-xs font-medium text-slate-500">Capacidad del Salón</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{capacityPct}%</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${capacityPct}%` }}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <p className="text-xs font-medium text-slate-500">RSVP Pendiente</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{pendingCount}</p>
          <p className="mt-1 text-[11px] text-slate-400">Se enviarán recordatorios en 2 días</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Buscar por nombre..."
              className="input-field pl-10"
            />
          </div>
          <button type="button" className="dash-btn-secondary py-2 text-sm">
            <Filter className="h-3.5 w-3.5" />
            Filtros
          </button>
        </div>
        <button
          type="button"
          onClick={handleAction}
          disabled={selectedIds.length !== 1 && actionLabel === 'Editar'}
          className="dash-btn-primary py-2 text-sm"
        >
          {actionLabel}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="w-10 px-4 py-3" />
                <th className="px-4 py-3">Nombre Completo</th>
                <th className="px-4 py-3">Grupo</th>
                <th className="px-4 py-3">Edad</th>
                <th className="px-4 py-3">Tipo de Menú</th>
                <th className="px-4 py-3">Estado RSVP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {pageItems.map((guest) => {
                const status = resolveStatus(guest)
                const selected = selectedIds.includes(guest.id)
                const menuType = guest.menuType ?? 'General'
                return (
                  <tr
                    key={guest.id}
                    className={selected ? 'bg-primary-50/60 ring-1 ring-inset ring-primary/20' : ''}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleSelect(guest.id)}
                        className="h-4 w-4 accent-primary"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {initials(guest)}
                        </div>
                        <span className="font-semibold text-slate-900">
                          {guest.firstName} {guest.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{guest.group ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{guest.ageType ?? 'Adulto'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          MENU_STYLES[menuType] ?? MENU_STYLES.General
                        }`}
                      >
                        {menuType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          status === 'Confirmado'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                    No hay invitados que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <TablePagination
          page={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setPage}
          itemLabel="invitados"
        />
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8"
          onClick={() => setEditing(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-elevated"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Editar Invitado</p>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={editing.firstName}
                  onChange={(e) => setEditing({ ...editing, firstName: e.target.value })}
                  placeholder="Nombre"
                  className="input-field"
                />
                <input
                  type="text"
                  value={editing.lastName}
                  onChange={(e) => setEditing({ ...editing, lastName: e.target.value })}
                  placeholder="Apellido"
                  className="input-field"
                />
              </div>
              <input
                type="text"
                value={editing.group ?? ''}
                onChange={(e) => setEditing({ ...editing, group: e.target.value })}
                placeholder="Grupo (ej. Familia Novia)"
                className="input-field"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={editing.ageType ?? 'Adulto'}
                  onChange={(e) =>
                    setEditing({ ...editing, ageType: e.target.value as GuestConfirmation['ageType'] })
                  }
                  className="input-field"
                >
                  {AGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <select
                  value={editing.menuType ?? 'General'}
                  onChange={(e) =>
                    setEditing({ ...editing, menuType: e.target.value as GuestConfirmation['menuType'] })
                  }
                  className="input-field"
                >
                  {MENU_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={resolveStatus(editing)}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    rsvpStatus: e.target.value as GuestConfirmation['rsvpStatus'],
                  })
                }
                className="input-field"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Confirmado">Confirmado</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="dash-btn-secondary py-2 text-sm"
              >
                Cancelar
              </button>
              <button type="button" onClick={saveEdit} className="dash-btn-primary py-2 text-sm">
                <Check className="h-3.5 w-3.5" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
