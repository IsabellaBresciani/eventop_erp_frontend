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
import type { CalendarEvent, Employee } from '../../types/dashboard'
import { useTranslation } from 'react-i18next'

export function EmployeeList({
  searchTerm,
  setSearchTerm,
  filteredEmployees,
  selectedEmployeeId,
  setSelectedEmployeeId,
}: {
  searchTerm: string
  setSearchTerm: (val: string) => void
  filteredEmployees: Employee[]
  selectedEmployeeId: string
  setSelectedEmployeeId: (id: string) => void
}) {
  const { t } = useTranslation()
  return (
    <div className="space-y-3 lg:col-span-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-400/80" />
          <input
            type="text"
            placeholder={t('employeewidgets.buscar')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-primary-100 bg-white/80 py-2.5 pl-9 pr-4 text-[13px] text-slate-800 shadow-sm outline-none backdrop-blur-md transition-all placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
          />
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-400 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          <span>{t('employeewidgets.nuevo')}</span>
        </button>
      </div>

      <div className="max-h-[calc(100vh-230px)] space-y-2 overflow-y-auto pr-1">
        {filteredEmployees.map((emp) => {
          const isSelected = emp.id === selectedEmployeeId
          return (
            <button
              key={emp.id}
              type="button"
              onClick={() => setSelectedEmployeeId(emp.id)}
              className={`flex w-full items-center gap-3.5 rounded-2xl p-3 text-left transition-all duration-200 ${
                isSelected
                  ? 'border border-primary-200/80 bg-primary-500/10 shadow-sm backdrop-blur-md'
                  : 'border border-slate-100 bg-white/70 hover:bg-slate-50/80'
              }`}
            >
              <div className="relative">
                <img
                  src={emp.avatar}
                  alt={emp.name}
                  className={`h-11 w-11 rounded-full object-cover transition-all ${
                    isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : 'border border-slate-200'
                  }`}
                />
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                    emp.active ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-[14px] ${
                    isSelected ? 'font-bold text-primary-900' : 'font-semibold text-slate-700'
                  }`}
                >
                  {emp.name}
                </p>
                <p className="truncate text-[12px] font-medium text-primary-600/80">{emp.role}</p>
                <p className="truncate text-[11px] text-slate-400">
                  {t('employeewidgets.dni')}
                  {emp.dni}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function EmployeeDetailHeader({
  selectedEmployee,
  handleToggleActive,
}: {
  selectedEmployee: Employee
  handleToggleActive: () => void
}) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-6 border-b border-primary-100/60 pb-6 md:flex-row md:items-center md:justify-between">
      {}
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <div className="relative flex-shrink-0">
          <img
            src={selectedEmployee.avatar}
            alt={selectedEmployee.name}
            className="h-20 w-20 rounded-full object-cover shadow-md ring-4 ring-primary-500/10"
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
            <CheckCircle2 className="h-5 w-5 fill-primary-100 text-primary-600" />
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

          <p className="text-[14px] font-semibold text-primary-600">{selectedEmployee.role}</p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-1 text-[13px] text-slate-500 sm:justify-start">
            <span>
              {t('employeewidgets.dni')}
              {selectedEmployee.dni}
            </span>
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

      {}
      <div className="flex items-center justify-center gap-2 pt-2 sm:justify-end md:pt-0">
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-[13px] font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
        >
          <Edit2 className="h-4 w-4 text-slate-500" />
          <span>{t('employeewidgets.editar')}</span>
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
              <span>{t('employeewidgets.desactivar')}</span>
            </>
          ) : (
            <>
              <UserCheck className="h-4 w-4 text-emerald-600" />
              <span>{t('employeewidgets.activar')}</span>
            </>
          )}
        </button>

        <button
          type="button"
          title={t('employeewidgets.eliminar_empleado')}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-rose-50/50 text-rose-600 transition hover:bg-rose-100 active:scale-[0.98]"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function EmployeeEventsList({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  employeeEvents,
  handleSelectEvent,
  getStatusBadge,
}: {
  fromDate: string
  setFromDate: (val: string) => void
  toDate: string
  setToDate: (val: string) => void
  employeeEvents: CalendarEvent[]
  handleSelectEvent: (ev: CalendarEvent) => void
  getStatusBadge: (status: string) => string
}) {
  const { t } = useTranslation()
  return (
    <div className="space-y-4 pt-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[16px] font-bold text-slate-900">
            {t('employeewidgets.historial_de_eventos')}
          </h2>
          <p className="text-[12px] text-slate-400">
            {t('employeewidgets.listado_de_participacin_en_el_saln')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="mb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
              {t('employeewidgets.desde')}
            </span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-xl border border-primary-100 bg-slate-50 px-3 py-1 text-[12px] text-slate-700 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
            />
          </div>

          <div className="flex flex-col">
            <span className="mb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
              {t('employeewidgets.hasta')}
            </span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-xl border border-primary-100 bg-slate-50 px-3 py-1 text-[12px] text-slate-700 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/10"
            />
          </div>
        </div>
      </div>

      {}
      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-4 py-3">{t('employeewidgets.fecha')}</th>
              <th className="px-4 py-3">{t('employeewidgets.cliente')}</th>
              <th className="px-4 py-3">{t('employeewidgets.tipo')}</th>
              <th className="px-4 py-3">{t('employeewidgets.horario')}</th>
              <th className="px-4 py-3">{t('employeewidgets.estado')}</th>
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
                  <td className="px-4 py-3.5 font-bold text-slate-900">{event.clientName}</td>
                  <td className="px-4 py-3.5 text-slate-600">{event.eventType}</td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {event.startTime} – {event.endTime}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex rounded-full px-3 py-0.5 text-[11px] font-semibold ${getStatusBadge(
                        event.status,
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
                  {t('employeewidgets.no_hay_eventos_registrados_para_este_emp')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
