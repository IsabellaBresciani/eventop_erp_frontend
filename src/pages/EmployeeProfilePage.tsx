import { motion } from 'framer-motion'
import { Mail, Phone, UserCircle } from 'lucide-react'
import { type ReactNode, useMemo } from 'react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import {
  getEmployeeById,
  getEmployeeEventStats,
  getEmployeeFullName,
} from '../data/employees'
import { loadEvents } from '../data/events-storage'
import { useAuthGuard } from '../hooks/useAuthGuard'

const DEMO_TODAY = new Date(2026, 7, 3)

export default function EmployeeProfilePage() {
  const { salon, session } = useAuthGuard({ allowedRoles: ['employee'] })

  const employee = useMemo(
    () => (session?.userId ? getEmployeeById(session.userId) : undefined),
    [session?.userId],
  )

  const stats = useMemo(() => {
    if (!session?.userId) return null
    return getEmployeeEventStats(loadEvents(), session.userId, DEMO_TODAY)
  }, [session?.userId])

  if (!employee) {
    return null
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <DashboardLayout
        salonName={salon}
        title="Mi perfil"
        subtitle="Tus datos de acceso al ERP del salón"
      >
        <div className="grid gap-6 lg:grid-cols-12">
          <section className="dash-card p-6 sm:p-8 lg:col-span-7">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UserCircle className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {getEmployeeFullName(employee)}
                </h2>
                <p className="text-[13px] text-slate-500">Empleado del salón</p>
              </div>
            </div>

            <dl className="mt-8 space-y-4">
              <ProfileField label="DNI" value={employee.dni} />
              <ProfileField
                label="Email"
                value={employee.email}
                icon={<Mail className="h-4 w-4 text-slate-400" />}
              />
              <ProfileField
                label="Teléfono"
                value={employee.phone}
                icon={<Phone className="h-4 w-4 text-slate-400" />}
              />
              <ProfileField
                label="Estado"
                value={employee.active ? 'Activo' : 'Inactivo'}
              />
            </dl>
          </section>

          <section className="dash-card p-6 sm:p-8 lg:col-span-5">
            <h3 className="text-base font-semibold text-slate-900">Resumen de trabajo</h3>
            <p className="mt-1 text-[13px] text-slate-500">
              Actividad registrada en EvenTop
            </p>

            {stats && (
              <div className="mt-6 space-y-3">
                <StatRow label="Próximos eventos" value={stats.upcoming} />
                <StatRow label="Eventos realizados" value={stats.completed} />
              </div>
            )}

            <div className="mt-6 rounded-xl border border-primary/10 bg-primary/5 px-4 py-3 text-[12px] leading-relaxed text-slate-600">
              Si necesitás actualizar tus datos de contacto, comunicate con el administrador del
              salón.
            </div>
          </section>
        </div>
      </DashboardLayout>
    </motion.div>
  )
}

function ProfileField({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-black/[0.05] pb-4 last:border-0 last:pb-0">
      <dt className="text-[13px] font-medium text-slate-500">{label}</dt>
      <dd className="flex items-center gap-2 text-right text-[13px] font-semibold text-slate-900">
        {icon}
        {value}
      </dd>
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-apple-fill/50 px-4 py-3">
      <span className="text-[13px] text-slate-600">{label}</span>
      <span className="text-base font-semibold text-slate-900">{value}</span>
    </div>
  )
}
