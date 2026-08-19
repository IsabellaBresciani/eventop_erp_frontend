import { motion } from 'framer-motion'
import {
  Calendar,
  CheckCircle2,
  Edit2,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  UserCheck,
  UserX,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { EventAuditSlideover } from '../components/dashboard/EventAuditSlideover'
import { loadEvents, saveEvents } from '../data/events-storage'
import { useAuthGuard } from '../hooks/useAuthGuard'
import type { CalendarEvent } from '../types/dashboard'

// MOCK EMPLEADOS
const INITIAL_EMPLOYEES = [
  {
    id: '1',
    name: 'Lucía Fernández',
    role: 'Coordinadora General',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
    dni: '32456789',
    phone: '+54 11 4521-8890',
    email: 'lucia.fernandez@eventop.com',
    active: true,
    joinedDate: 'Marzo 2024',
  },
  {
    id: '2',
    name: 'María Gómez',
    role: 'Camarera Senior',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500',
    dni: '23456789',
    phone: '+54 11 3344-5566',
    email: 'maria.gomez@eventop.com',
    active: true,
    joinedDate: 'Enero 2025',
  },
  {
    id: '3',
    name: 'Carlos López',
    role: 'Técnico de Sonido',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
    dni: '34567890',
    phone: '+54 11 4455-6677',
    email: 'carlos.lopez@eventop.com',
    active: false,
    joinedDate: 'Junio 2024',
  },
]

export default function EmployeesPage() {
  const { salon } = useAuthGuard({ allowedRoles: ['admin'] })
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(INITIAL_EMPLOYEES[0].id)

  // ESTADO GLOBAL DE EVENTOS Y SLIDEOVER
  const [events, setEvents] = useState<CalendarEvent[]>(loadEvents)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [slideoverOpen, setSlideoverOpen] = useState(false)

  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedEmployee =
    employees.find((emp) => emp.id === selectedEmployeeId) || employees[0]

  // FILTRADO CON FALLBACK MOCK
  const employeeEvents = useMemo(() => {
    return events.filter((ev, index) => {
      // 1. Verificación directa si está en assignedEmployeeIds
      const isExplicitlyAssigned = ev.assignedEmployeeIds?.includes(selectedEmployee.id)

      // 2. Fallback Mock: Si no hay asignaciones explicitas en el evento,
      // asignamos alternadamente según el ID del empleado para que nunca quede vacío.
      const isMockedAssigned =
        (!ev.assignedEmployeeIds || ev.assignedEmployeeIds.length === 0) &&
        ((selectedEmployee.id === '1' && index % 2 === 0) ||
         (selectedEmployee.id === '2' && index % 2 !== 0) ||
         (selectedEmployee.id === '3' && index === 0))

      const isAssigned = isExplicitlyAssigned || isMockedAssigned

      let passesDateFrom = true
      let passesDateTo = true

      if (fromDate) {
        passesDateFrom = new Date(ev.date) >= new Date(fromDate)
      }
      if (toDate) {
        passesDateTo = new Date(ev.date) <= new Date(toDate)
      }

      return isAssigned && passesDateFrom && passesDateTo
    })
  }, [events, selectedEmployee.id, fromDate, toDate])

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setSlideoverOpen(true)
  }

  const handleCloseSlideover = () => {
    setSlideoverOpen(false)
    setTimeout(() => setSelectedEvent(null), 350)
  }

  const handleEventUpdate = (updated: CalendarEvent) => {
    setEvents((current) => {
      const next = current.map((e) => (e.id === updated.id ? updated : e))
      saveEvents(next)
      return next
    })
    setSelectedEvent(updated)
  }

  const handleToggleActive = () => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === selectedEmployee.id ? { ...emp, active: !emp.active } : emp
      )
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-500 text-white'
      case 'CONFIRMED':
        return 'bg-primary-600 text-white'
      case 'CLOSED':
        return 'bg-slate-500 text-white'
      case 'CANCELLED':
        return 'bg-rose-500 text-white'
      default:
        return 'bg-amber-500 text-white'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <DashboardLayout
        salonName={salon || 'Mi Salón'}
        title="Empleados"
        subtitle="Gestión unificada de personal"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          
          {/* ================= LISTA IZQUIERDA ================= */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-400/80" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-primary-100 bg-white/80 backdrop-blur-md py-2.5 pl-9 pr-4 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 shadow-sm"
                />
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-400 active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                <span>Nuevo</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[calc(100vh-230px)] overflow-y-auto pr-1">
              {filteredEmployees.map((emp) => {
                const isSelected = emp.id === selectedEmployeeId
                return (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => setSelectedEmployeeId(emp.id)}
                    className={`w-full flex items-center gap-3.5 p-3 rounded-2xl text-left transition-all duration-200 ${
                      isSelected
                        ? 'bg-primary-500/10 border border-primary-200/80 shadow-sm backdrop-blur-md'
                        : 'bg-white/70 border border-slate-100 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className={`h-11 w-11 rounded-full object-cover transition-all ${
                          isSelected
                            ? 'ring-2 ring-primary-500 ring-offset-2'
                            : 'border border-slate-200'
                        }`}
                      />
                      <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                          emp.active ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[14px] truncate ${
                          isSelected
                            ? 'font-bold text-primary-900'
                            : 'font-semibold text-slate-700'
                        }`}
                      >
                        {emp.name}
                      </p>
                      <p className="text-[12px] text-primary-600/80 font-medium truncate">
                        {emp.role}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        DNI {emp.dni}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ================= DETALLE DERECHA ================= */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-[28px] border border-primary-100 bg-white/80 backdrop-blur-xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
              
              {/* Encabezado Genérico de Perfil */}
              <div className="flex flex-col gap-6 pb-6 border-b border-primary-100/60 md:flex-row md:items-center md:justify-between">
                
                {/* Datos del Empleado */}
                <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                  <div className="relative flex-shrink-0">
                    <img
                      src={selectedEmployee.avatar}
                      alt={selectedEmployee.name}
                      className="h-20 w-20 rounded-full object-cover ring-4 ring-primary-500/10 shadow-md"
                    />
                    <span
                      className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${
                        selectedEmployee.active ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2 sm:justify-start">
                      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        {selectedEmployee.name}
                      </h1>
                      <CheckCircle2 className="h-5 w-5 text-primary-600 fill-primary-100" />
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          selectedEmployee.active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {selectedEmployee.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    <p className="text-[14px] font-semibold text-primary-600">
                      {selectedEmployee.role}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[13px] text-slate-500 pt-1 sm:justify-start">
                      <span>DNI {selectedEmployee.dni}</span>
                      <span className="text-slate-300">•</span>
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-primary-500" />
                        <span>{selectedEmployee.email}</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-primary-500" />
                        <span>{selectedEmployee.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de Acción Estandarizados */}
                <div className="flex items-center justify-center gap-2 pt-2 md:pt-0 sm:justify-end">
                  <button
                    type="button"
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-[13px] font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
                  >
                    <Edit2 className="h-4 w-4 text-slate-500" />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleActive}
                    className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3.5 text-[13px] font-medium transition active:scale-[0.98] ${
                      selectedEmployee.active
                        ? 'border-amber-200 bg-amber-50/60 text-amber-800 hover:bg-amber-100/70'
                        : 'border-emerald-200 bg-emerald-50/60 text-emerald-800 hover:bg-emerald-100/70'
                    }`}
                  >
                    {selectedEmployee.active ? (
                      <>
                        <UserX className="h-4 w-4 text-amber-600" />
                        <span>Desactivar</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4 text-emerald-600" />
                        <span>Activar</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    title="Eliminar empleado"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-rose-50/50 text-rose-600 transition hover:bg-rose-100 active:scale-[0.98]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

              </div>
              {/* Eventos */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-[16px] font-bold text-slate-900">
                      Historial de Eventos
                    </h2>
                    <p className="text-[12px] text-slate-400">
                      Listado de participación en el salón
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="mb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        DESDE
                      </span>
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="rounded-xl border border-primary-100 bg-slate-50 px-3 py-1 text-[12px] text-slate-700 outline-none focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10 transition-all"
                      />
                    </div>

                    <div className="flex flex-col">
                      <span className="mb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        HASTA
                      </span>
                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="rounded-xl border border-primary-100 bg-slate-50 px-3 py-1 text-[12px] text-slate-700 outline-none focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Tabla de Eventos */}
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="px-4 py-3">FECHA</th>
                        <th className="px-4 py-3">CLIENTE</th>
                        <th className="px-4 py-3">TIPO</th>
                        <th className="px-4 py-3">HORARIO</th>
                        <th className="px-4 py-3">ESTADO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {employeeEvents.length > 0 ? (
                        employeeEvents.map((event) => (
                          <tr
                            key={event.id}
                            onClick={() => handleSelectEvent(event)}
                            className="cursor-pointer transition-colors hover:bg-primary-50/50 active:bg-primary-100/40"
                          >
                            <td className="px-4 py-3.5 font-medium text-slate-700">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary-400" />
                                <span>{event.date}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 font-bold text-slate-900">
                              {event.clientName}
                            </td>
                            <td className="px-4 py-3.5 text-slate-600">
                              {event.eventType}
                            </td>
                            <td className="px-4 py-3.5 text-slate-600">
                              {event.startTime} – {event.endTime}
                            </td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`inline-flex rounded-full px-3 py-0.5 text-[11px] font-semibold ${getStatusBadge(
                                  event.status
                                )}`}
                              >
                                {event.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                            No hay eventos registrados para este empleado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>

        </div>
      </DashboardLayout>

      {/* Audit Slideover */}
      <EventAuditSlideover
        event={selectedEvent}
        isOpen={slideoverOpen}
        onClose={handleCloseSlideover}
        onEventUpdate={handleEventUpdate}
      />
    </motion.div>
  )
}