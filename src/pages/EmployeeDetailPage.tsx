import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Edit2, Mail, Phone, Trash2, UserX } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { getEmployeeFullName, loadEmployees } from '../data/employees'
import { useAuthGuard } from '../hooks/useAuthGuard'
import { useTranslation } from 'react-i18next'

const MOCK_EVENTS = [
  {
    id: 'e1',
    date: 'mié, 5 ago 2026',
    client: 'Valentina García',
    type: 'Boda',
    time: '20:00 – 04:00',
    status: 'Pagado',
  },
  {
    id: 'e2',
    date: 'mié, 12 ago 2026',
    client: 'Empresa TechNova',
    type: 'Corporativo',
    time: '09:00 – 14:00',
    status: 'Presupuestado',
  },
  {
    id: 'e3',
    date: 'mar, 25 ago 2026',
    client: 'Grupo Inmobiliario Sur',
    type: 'Corporativo',
    time: '18:00 – 22:00',
    status: 'Cerrado',
  },
  {
    id: 'e4',
    date: 'vie, 28 ago 2026',
    client: 'Lucía Fernández',
    type: 'Boda',
    time: '20:00 – 04:00',
    status: 'Pagado',
  },
]

export default function EmployeeDetailPage() {
  const { t } = useTranslation()
  const { employeeId } = useParams<{ employeeId: string }>()
  const { salon } = useAuthGuard({ allowedRoles: ['admin'] })

  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  // 2. Buscar datos reales o usar fallback estático de Lucía Fernández para la demo
  const employees = loadEmployees()
  const foundEmployee = employees.find((e) => e.id === employeeId)

  const employee = {
    name: foundEmployee ? getEmployeeFullName(foundEmployee) : 'Lucía Fernández',
    active: foundEmployee ? foundEmployee.active : true,
    dni: foundEmployee?.dni || '32456789',
    email: foundEmployee?.email || 'lucia.fernandez@eventop.com',
    phone: foundEmployee?.phone || '+54 11 4521-8890',
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pagado':
        return 'bg-[#10B981] text-white'
      case 'Presupuestado':
        return 'bg-[#3B82F6] text-white'
      case 'Cerrado':
        return 'bg-[#6B7280] text-white'
      default:
        return 'bg-slate-200 text-slate-700'
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <DashboardLayout
        salonName={salon}
        title={t('employeedetailpage.detalle_del_empleado')}
        subtitle={t('employeedetailpage.gestin_y_eventos_asignados')}
      >
        {}
        <div className="mb-6">
          <Link
            to="/dashboard/empleados"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('employeedetailpage.volver_a_empleados')}
          </Link>
        </div>

        {}
        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">{employee.name}</h1>
              <span
                className={`rounded-full px-3 py-0.5 text-[12px] font-semibold ${
                  employee.active
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {employee.active ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            {}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-slate-500">
              <span>
                {t('employeedetailpage.dni')}
                {employee.dni}
              </span>
              <div className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{employee.phone}</span>
              </div>
            </div>
          </div>

          {}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
            >
              <Edit2 className="h-3.5 w-3.5" />
              {t('employeedetailpage.editar')}
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
            >
              <UserX className="h-3.5 w-3.5" />
              {t('employeedetailpage.desactivar')}
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/50 px-4 py-2 text-[13px] font-medium text-rose-600 shadow-sm transition hover:bg-rose-100/60 active:scale-[0.98]"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t('employeedetailpage.eliminar')}
            </button>
          </div>
        </div>

        {}
        <section className="dash-card overflow-hidden rounded-[22px] border border-black/[0.06] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          {}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-slate-900">
                {t('employeedetailpage.eventos_participados')}
              </h2>
              <p className="text-[13px] text-slate-400">
                {MOCK_EVENTS.length} {t('employeedetailpage.eventos_en_el_rango_seleccionado')}
              </p>
            </div>

            {}
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {t('employeedetailpage.desde')}
                </span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="rounded-[12px] border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-[13px] text-slate-700 outline-none focus:border-primary focus:bg-white"
                />
              </div>

              <div className="flex flex-col">
                <span className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {t('employeedetailpage.hasta')}
                </span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="rounded-[12px] border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-[13px] text-slate-700 outline-none focus:border-primary focus:bg-white"
                />
              </div>
            </div>
          </div>

          {}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">{t('employeedetailpage.fecha')}</th>
                  <th className="px-4 py-3">{t('employeedetailpage.cliente')}</th>
                  <th className="px-4 py-3">{t('employeedetailpage.tipo')}</th>
                  <th className="px-4 py-3">{t('employeedetailpage.horario')}</th>
                  <th className="px-4 py-3">{t('employeedetailpage.estado')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_EVENTS.map((event) => (
                  <tr key={event.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-4 py-4 font-medium text-slate-700">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>{event.date}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-900">{event.client}</td>
                    <td className="px-4 py-4 text-slate-600">{event.type}</td>
                    <td className="px-4 py-4 text-slate-600">{event.time}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${getStatusBadge(
                          event.status,
                        )}`}
                      >
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </DashboardLayout>
    </motion.div>
  )
}
