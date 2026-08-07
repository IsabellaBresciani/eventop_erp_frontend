import { motion } from 'framer-motion'
import { ChevronRight, Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmployeeFormModal } from '../components/employees/EmployeeFormModal'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { DEFAULT_TABLE_PAGE_SIZE, TablePagination } from '../components/ui/TablePagination'
import {
  countEmployeeEvents,
  createEmployee,
  getEmployeeFullName,
  loadEmployees,
  sendEmployeeInviteEmail,
} from '../data/employees'
import { loadEvents } from '../data/events-storage'
import { useAuthGuard } from '../hooks/useAuthGuard'
import { usePagination } from '../hooks/usePagination'

export default function EmployeesPage() {
  const { salon } = useAuthGuard({ allowedRoles: ['admin'] })
  const [employees, setEmployees] = useState(loadEmployees)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const events = useMemo(() => loadEvents(), [employees])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return employees

    return employees.filter((employee) => {
      const haystack = [
        employee.firstName,
        employee.lastName,
        getEmployeeFullName(employee),
        employee.dni,
        employee.email,
        employee.phone,
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [employees, query])

  const { page, setPage, totalPages, paginatedItems, totalItems } = usePagination(
    filtered,
    DEFAULT_TABLE_PAGE_SIZE,
  )

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 5000)
  }

  const refresh = () => setEmployees(loadEmployees())

  const handleCreate = (data: Parameters<typeof createEmployee>[0]) => {
    const employee = createEmployee(data)
    sendEmployeeInviteEmail(employee)
    refresh()
    showToast(
      `Invitación enviada a ${employee.email}. Contraseña temporal: ${employee.tempPassword}`,
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <DashboardLayout
        salonName={salon}
        title="Empleados"
        subtitle="Gestioná el equipo del salón"
        action={
          <button type="button" onClick={() => setModalOpen(true)} className="dash-btn-primary">
            <Plus className="h-4 w-4" />
            Nuevo empleado
          </button>
        }
      >
        {toast && (
          <div className="mb-6 rounded-[14px] border border-primary/15 bg-primary/5 px-4 py-3 text-[13px] font-medium text-primary">
            {toast}
          </div>
        )}

        <section className="dash-card overflow-hidden">
          <div className="border-b border-black/[0.05] px-5 py-4 sm:px-6">
            <div className="relative max-w-md">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-apple-label"
                strokeWidth={1.75}
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre, DNI o email..."
                className="catalog-search w-full rounded-full py-2.5 pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-black/[0.05] bg-apple-fill/50 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
                  <th className="px-5 py-3.5 sm:px-6">Empleado</th>
                  <th className="px-4 py-3.5">DNI</th>
                  <th className="px-4 py-3.5">Email</th>
                  <th className="px-4 py-3.5">Teléfono</th>
                  <th className="px-4 py-3.5">Estado</th>
                  <th className="px-4 py-3.5 text-center">Eventos</th>
                  <th className="px-5 py-3.5 sm:px-6" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-14 text-center text-sm text-slate-500">
                      {query
                        ? 'No hay empleados que coincidan con la búsqueda.'
                        : 'Todavía no hay empleados registrados.'}
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-b border-black/[0.04] transition-colors last:border-0 hover:bg-apple-fill/40"
                    >
                      <td className="px-5 py-4 font-medium text-slate-900 sm:px-6">
                        {getEmployeeFullName(employee)}
                      </td>
                      <td className="px-4 py-4 text-slate-600">{employee.dni}</td>
                      <td className="px-4 py-4 text-slate-600">{employee.email}</td>
                      <td className="px-4 py-4 text-slate-600">{employee.phone}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            employee.active
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {employee.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex min-w-[1.75rem] justify-center rounded-full bg-primary/10 px-2 py-0.5 text-[12px] font-bold text-primary">
                          {countEmployeeEvents(events, employee.id)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right sm:px-6">
                        <Link
                          to={`/dashboard/empleados/${employee.id}`}
                          className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:text-primary-600"
                        >
                          Ver detalle
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
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
            itemLabel="empleados"
          />
        </section>
      </DashboardLayout>

      <EmployeeFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreate} />
    </motion.div>
  )
}
