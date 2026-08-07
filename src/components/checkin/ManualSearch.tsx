import { Search, UserCheck } from 'lucide-react'
import type { EventGuest } from '../../types/checkin'

interface ManualSearchProps {
  query: string
  onQueryChange: (q: string) => void
  results: EventGuest[]
  onSelect: (guest: EventGuest) => void
  codeInput: string
  onCodeInputChange: (code: string) => void
  onCodeSubmit: () => void
}

export function ManualSearch({
  query,
  onQueryChange,
  results,
  onSelect,
  codeInput,
  onCodeInputChange,
  onCodeSubmit,
}: ManualSearchProps) {
  return (
    <div className="rounded-2xl border border-surface-border bg-white p-4 shadow-card">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Búsqueda manual
      </p>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Buscar por nombre o apellido..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="input-field py-2.5 pl-10 text-sm"
        />
      </div>

      {results.length > 0 && (
        <div className="mb-3 max-h-40 space-y-1 overflow-y-auto">
          {results.map((guest) => (
            <button
              key={guest.id}
              type="button"
              onClick={() => onSelect(guest)}
              className="flex w-full items-center justify-between rounded-xl border border-surface-border px-3 py-2.5 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {guest.firstName} {guest.lastName}
                </p>
                <p className="text-[10px] text-slate-400">{guest.qrCode}</p>
              </div>
              <div className="flex items-center gap-2">
                {guest.checkedIn && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600">
                    Ingresó
                  </span>
                )}
                <UserCheck className="h-4 w-4 text-primary" />
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Código QR manual (EVT-...)"
          value={codeInput}
          onChange={(e) => onCodeInputChange(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && onCodeSubmit()}
          className="input-field flex-1 py-2.5 font-mono text-sm"
        />
        <button type="button" onClick={onCodeSubmit} className="btn-primary shrink-0 px-4">
          OK
        </button>
      </div>
    </div>
  )
}
