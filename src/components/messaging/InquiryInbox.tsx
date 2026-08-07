import { Search } from 'lucide-react'
import { INQUIRY_STATUS_CONFIG } from '../../data/messaging'
import type { Inquiry, InquiryStatus } from '../../types/messaging'

interface InquiryInboxProps {
  inquiries: Inquiry[]
  selectedId: string | null
  filter: InquiryStatus | 'all'
  onSelect: (id: string) => void
  onFilterChange: (filter: InquiryStatus | 'all') => void
  search: string
  onSearchChange: (value: string) => void
}

const FILTERS: { id: InquiryStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'nueva', label: 'Nuevas' },
  { id: 'seguimiento', label: 'En Seguimiento' },
  { id: 'presupuesto_enviado', label: 'Presupuesto Enviado' },
]

export function InquiryInbox({
  inquiries,
  selectedId,
  filter,
  onSelect,
  onFilterChange,
  search,
  onSearchChange,
}: InquiryInboxProps) {
  const filtered = inquiries.filter((inq) => {
    const matchesFilter = filter === 'all' || inq.status === filter
    const matchesSearch =
      !search ||
      inq.clientName.toLowerCase().includes(search.toLowerCase()) ||
      inq.eventType.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="flex h-full flex-col rounded-card border border-surface-border bg-white shadow-card">
      <div className="border-b border-surface-border p-4">
        <h2 className="text-sm font-bold text-slate-900">Inbox Inteligente</h2>
        <p className="text-xs text-slate-500">{inquiries.filter((i) => i.unread).length} sin leer</p>

        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Buscar consultas..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field py-2 pl-9 text-sm"
          />
        </div>

        <div className="mt-3 flex gap-1 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onFilterChange(f.id)}
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
                filter === f.id
                  ? 'bg-primary text-white'
                  : 'bg-surface text-slate-600 hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-400">No hay consultas</p>
        ) : (
          filtered.map((inq) => {
            const status = INQUIRY_STATUS_CONFIG[inq.status]
            const isSelected = selectedId === inq.id

            return (
              <button
                key={inq.id}
                type="button"
                onClick={() => onSelect(inq.id)}
                className={`w-full border-b border-surface-border px-4 py-3.5 text-left transition-colors hover:bg-surface/50 ${
                  isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold ${inq.unread ? 'text-slate-900' : 'text-slate-700'}`}
                      >
                        {inq.clientName}
                      </span>
                      {inq.unread && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {inq.eventType} · {inq.guests} invitados
                    </p>
                    <p className="mt-1 truncate text-sm text-slate-600">{inq.lastMessage}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-[10px] text-slate-400">{inq.lastActivity}</span>
                    <span
                      className={`mt-1 block rounded-full px-2 py-0.5 text-[9px] font-bold ${status.bg} ${status.text}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
