import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Mail,
  Pencil,
  Phone,
  Trash2,
  UserCheck,
  UserX,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { EventAuditSlideover } from '../components/dashboard/EventAuditSlideover'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { EmployeeFormModal } from '../components/employees/EmployeeFormModal'
import { DEFAULT_TABLE_PAGE_SIZE, TablePagination } from '../components/ui/TablePagination'
import { EVENT_STATUS_CONFIG } from '../data/dashboard'
import {
  deleteEmployee,
  filterEmployeeEventsByDateRange,
  getEmployeeById,
  getEmployeeFullName,
  updateEmployee,
} from '../data/employees'
import { loadEvents, saveEvents } from '../data/events-storage'
import { useAuthGuard } from '../hooks/useAuthGuard'
import { usePagination } from '../hooks/usePagination'
import type { CalendarEvent } from '../types/dashboard'
import type { EmployeeFormData } from '../types/employees'

export default function EmployeeDetailPage() {
  const { salon } = useAuthGuard({ allowedRoles: ['admin'] })
  const { employeeId } = useParams<{ employeeId: string }>()
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [slideoverOpen, setSlideoverOpen] = useState(false)

  const employee = useMemo(
    () => (employeeId ? getEmployeeById(employeeId) : undefined),
    [employeeId, refreshKey],
  )

  const events = useMemo(() => loadEvents(), [refreshKey])

  const assignedEvents = useMemo(() => {
    if (!employeeId) return []
    return filterEmployeeEventsByDateRange(events, employeeId, dateFrom || undefined, dateTo || undefined)
  }, [events, employeeId, dateFrom, dateTo])

  const { page, setPage, totalPages, paginatedItems, totalItems } = usePagination(
    assignedEvents,
    DEFAULT_TABLE_PAGE_SIZE,
  )

  if (!employeeId || !employee) {
    return <Navigate to="/dashboard/empleados" replace />
  }

  const handleUpdate = (data: EmployeeFormData) => {
    updateEmployee(employee.id, data)
    setRefreshKey((k) => k + 1)
  }

  const handleToggleActive = () => {
    updateEmployee(employee.id, { active: !employee.active })
    setRefreshKey((k) => k + 1)
  }

  const handleDelete = () => {
    if (!window.confirm('¿Eliminar este empleado?')) return
    deleteEmployee(employee.id)
    navigate('/dashboard/empleados')
  }

  const clearDateFilters = () => {
    setDateFrom('')
    setDateTo('')
  }

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setSlideoverOpen(true)
  }

  const handleCloseSlideover = () => {
    setSlideoverOpen(false)
    setTimeout(() => setSelectedEvent(null), 350)
  }

  const handleEventUpdate = (updated: CalendarEvent) => {
    const next = events.map((e) => (e.id === updated.id ? updated : e))
    saveEvents(next)
    setSelectedEvent(updated)
    setRefreshKey((k) => k + 1)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <DashboardLayout salonName={salon}>
        <div className="mb-6">
          <Link
            to="/dashboard/empleados"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a empleados
          </Link>
        </div>

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                {getEmployeeFullName(employee)}
              </h1>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  employee.active
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {employee.active ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-[13px] text-slate-500">
              <span>DNI {employee.dni}</span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {employee.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                {employee.phone}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setEditOpen(true)} className="dash-btn-secondary">
              <Pencil className="h-4 w-4" />
              Editar
            </button>
            <button type="button" onClick={handleToggleActive} className="dash-btn-secondary">
              {employee.active ? (
                <>
                  <UserX className="h-4 w-4" />
                  Desactivar
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4" />
                  Activar
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-5 py-2.5 text-[13px] font-semibold text-red-600 transition-all hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </button>
          </div>
        </div>

        <section className="dash-card overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-black/[0.05] px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Eventos participados</h2>
              <p className="mt-1 text-[13px] text-slate-500">
                {totalItems === 1
                  ? '1 evento en el rango seleccionado'
                  : `${totalItems} eventos en el rango seleccionado`}
              </p>
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
                  onClick={clearDateFilters}
                  className="dash-btn-secondary shrink-0"
                >
                  Limpiar fechas
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[13px]">
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
                      {dateFrom || dateTo
                        ? 'No hay eventos en el rango de fechas seleccionado.'
                        : 'Este empleado aún no participó en ningún evento.'}
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
                          <span className="inline-flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            {new Date(`${event.date}T12:00:00`).toLocaleDateString('es-AR', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-medium text-slate-900">
                          {event.clientName}
                        </td>
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

      <EmployeeFormModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
        title="Editar empleado"
        initial={{
          firstName: employee.firstName,
          lastName: employee.lastName,
          dni: employee.dni,
          email: employee.email,
          phone: employee.phone,
        }}
      />

      <EventAuditSlideover
        event={selectedEvent}
        isOpen={slideoverOpen}
        onClose={handleCloseSlideover}
        onEventUpdate={handleEventUpdate}
      />
    </motion.div>
  )
}
