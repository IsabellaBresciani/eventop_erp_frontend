import {
  EmployeeList,
  EmployeeDetailHeader,
  EmployeeEventsList,
} from '../components/employees/EmployeeWidgets'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { EventAuditSlideover } from '../components/dashboard/EventAuditSlideover'
import { loadEvents, saveEvents } from '../data/events-storage'
import { useAuthGuard } from '../hooks/useAuthGuard'
import type { CalendarEvent } from '../types/dashboard'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
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
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedEmployee = employees.find((emp) => emp.id === selectedEmployeeId) || employees[0]

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
      prev.map((emp) => (emp.id === selectedEmployee.id ? { ...emp, active: !emp.active } : emp)),
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
        title={t('employeespage.empleados')}
        subtitle={t('employeespage.gestin_unificada_de_personal')}
      >
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {}
          <EmployeeList
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredEmployees={filteredEmployees}
            selectedEmployeeId={selectedEmployeeId}
            setSelectedEmployeeId={setSelectedEmployeeId}
          />

          {}
          <div className="space-y-6 lg:col-span-8">
            <div className="space-y-6 rounded-[28px] border border-primary-100 bg-white/80 p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
              {}
              <EmployeeDetailHeader
                selectedEmployee={selectedEmployee}
                handleToggleActive={handleToggleActive}
              />
              {}
              <EmployeeEventsList
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
                employeeEvents={employeeEvents}
                handleSelectEvent={handleSelectEvent}
                getStatusBadge={getStatusBadge}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>

      {}
      <EventAuditSlideover
        event={selectedEvent}
        isOpen={slideoverOpen}
        onClose={handleCloseSlideover}
        onEventUpdate={handleEventUpdate}
      />
    </motion.div>
  )
}
