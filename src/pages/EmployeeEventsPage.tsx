import { motion } from 'framer-motion'
import { Calendar, CalendarClock, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EventAuditSlideover } from '../components/dashboard/EventAuditSlideover'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { DEFAULT_TABLE_PAGE_SIZE, TablePagination } from '../components/ui/TablePagination'
import { EVENT_STATUS_CONFIG } from '../data/dashboard'
import {
  filterEmployeeEventsByDateRange,
  getEmployeeById,
  getEmployeeEventStats,
} from '../data/employees'
import { loadEvents } from '../data/events-storage'
import { useAuthGuard } from '../hooks/useAuthGuard'
import { usePagination } from '../hooks/usePagination'
import type { CalendarEvent } from '../types/dashboard'

const DEMO_TODAY = new Date(2026, 7, 3)

export default function EmployeeEventsPage() {
  const { salon, session } = useAuthGuard({ allowedRoles: ['employee'] })
  const [query, setQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [slideoverOpen, setSlideoverOpen] = useState(false)

  const employeeId = session?.userId ?? ''
  const employee = useMemo(() => getEmployeeById(employeeId), [employeeId])

  const events = useMemo(() => loadEvents(), [slideoverOpen])

  const stats = useMemo(
    () => getEmployeeEventStats(events, employeeId, DEMO_TODAY),
    [events, employeeId],
  )

  const filteredEvents = useMemo(() => {
    let list = filterEmployeeEventsByDateRange(events, employeeId, dateFrom || undefined, dateTo || undefined)

    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter((event) =>
        [event.clientName, event.eventType, event.date].join(' ').toLowerCase().includes(q),
      )
    }

    return list
  }, [events, employeeId, dateFrom, dateTo, query])

  const { page, setPage, totalPages, paginatedItems, totalItems } = usePagination(
    filteredEvents,
    DEFAULT_TABLE_PAGE_SIZE,
  )

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setSlideoverOpen(true)
  }

  const handleCloseSlideover = () => {
    setSlideoverOpen(false)
    setTimeout(() => setSelectedEvent(null), 350)
  }

  const firstName = session?.name?.split(' ')[0] ?? employee?.firstName ?? 'equipo'

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <DashboardLayout
        salonName={salon}
        title={`Hola, ${firstName}`}
        subtitle="Estos son los eventos a los que estás asignado"
      >
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <SummaryCard
            icon={CalendarClock}
            label="Próximos eventos"
            value={String(stats.upcoming)}
            hint="Eventos por realizar"
          />
          <SummaryCard
            icon={Calendar}
            label="Eventos realizados"
            value={String(stats.completed)}
            hint="Historial de trabajo"
          />
        </div>

        <section className="dash-card overflow-hidden">
          <div className="space-y-4 border-b border-black/[0.05] px-5 py-5 sm:px-6">
            <div className="relative max-w-md">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-apple-label"
                strokeWidth={1.75}
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por cliente o tipo de evento..."
                className="catalog-search w-full rounded-full py-2.5 pl-10"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Desde
                </span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="input-field w-full sm:w-40"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Hasta
                </span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="input-field w-full sm:w-40"
                />
              </label>
              {(dateFrom || dateTo) && (
                <button
                  type="button"
                  onClick={() => {
                    setDateFrom('')
                    setDateTo('')
                  }}
                  className="dash-btn-secondary shrink-0"
                >
                  Limpiar fechas
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-black/[0.05] bg-apple-fill/50 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
                  <th className="px-5 py-3.5 sm:px-6">Fecha</th>
                  <th className="px-4 py-3.5">Cliente</th>
                  <th className="px-4 py-3.5">Tipo</th>
                  <th className="px-4 py-3.5">Horario</th>
                  <th className="px-5 py-3.5 sm:px-6">Estado</th>
                </tr>
              </thead>
              <tbody>
                {totalItems === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-14 text-center text-sm text-slate-500">
                      No hay eventos que coincidan con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((event) => {
                    const status = EVENT_STATUS_CONFIG[event.status]

                    return (
                      <tr
                        key={event.id}
                        onClick={() => handleSelectEvent(event)}
                        className="cursor-pointer border-b border-black/[0.04] last:border-0 transition-colors hover:bg-apple-fill/40"
                      >
                        <td className="px-5 py-4 text-slate-700 sm:px-6">
                          {new Date(`${event.date}T12:00:00`).toLocaleDateString('es-AR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-4 font-medium text-slate-900">{event.clientName}</td>
                        <td className="px-4 py-4 text-slate-600">{event.eventType}</td>
                        <td className="px-4 py-4 text-slate-600">
                          {event.startTime} – {event.endTime}
                        </td>
                        <td className="px-5 py-4 sm:px-6">
                          <span
                            className="inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                            style={{ backgroundColor: status.color }}
                          >
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          <TablePagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={DEFAULT_TABLE_PAGE_SIZE}
            onPageChange={setPage}
            itemLabel="eventos"
          />
        </section>
      </DashboardLayout>

      <EventAuditSlideover
        event={selectedEvent}
        isOpen={slideoverOpen}
        onClose={handleCloseSlideover}
      />
    </motion.div>
  )
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Calendar
  label: string
  value: string
  hint: string
}) {
  return (
    <div className="dash-card p-5">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4 text-primary" />
        <p className="text-[12px] font-semibold uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-[13px] text-slate-500">{hint}</p>
    </div>
  )
}
