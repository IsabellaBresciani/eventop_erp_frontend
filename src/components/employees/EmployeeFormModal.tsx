import { AnimatePresence, motion } from 'framer-motion'
import { Mail, UserPlus, X } from 'lucide-react'
import { type FormEvent, type ReactNode, useEffect, useState } from 'react'
import type { EmployeeFormData } from '../../types/employees'
import { useTranslation } from 'react-i18next'

interface EmployeeFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: EmployeeFormData) => void
  initial?: EmployeeFormData
  title?: string
}

const EMPTY: EmployeeFormData = {
  firstName: '',
  lastName: '',
  dni: '',
  email: '',
  phone: '',
}

export function EmployeeFormModal({
  isOpen,
  onClose,
  onSubmit,
  initial,
  title = 'Nuevo empleado',
}: EmployeeFormModalProps) {
  const { t } = useTranslation()
  const [form, setForm] = useState<EmployeeFormData>(initial ?? EMPTY)

  useEffect(() => {
    if (isOpen) setForm(initial ?? EMPTY)
  }, [isOpen, initial])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(form)
    if (!initial) setForm(EMPTY)
    onClose()
  }

  const update = (patch: Partial<EmployeeFormData>) => setForm((f) => ({ ...f, ...patch }))

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Cerrar"
          />
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto w-full max-w-lg overflow-hidden rounded-[20px] border border-black/[0.06] bg-white shadow-elevated"
            >
              <div className="border-b border-black/[0.05] bg-apple-fill/40 px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <UserPlus className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                      <p className="mt-0.5 text-[13px] text-slate-500">
                        {t('employeeformmodal.complet_los_datos_del_miembro_del_equipo')}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white hover:text-slate-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="max-h-[min(70vh,640px)] overflow-y-auto px-6 py-5"
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label={t('employeeformmodal.nombre')} htmlFor="emp-first-name">
                      <input
                        id="emp-first-name"
                        required
                        value={form.firstName}
                        onChange={(e) => update({ firstName: e.target.value })}
                        className="input-field"
                        placeholder={t('employeeformmodal.mara')}
                        autoComplete="given-name"
                      />
                    </Field>
                    <Field label={t('employeeformmodal.apellido')} htmlFor="emp-last-name">
                      <input
                        id="emp-last-name"
                        required
                        value={form.lastName}
                        onChange={(e) => update({ lastName: e.target.value })}
                        className="input-field"
                        placeholder={t('employeeformmodal.gonzlez')}
                        autoComplete="family-name"
                      />
                    </Field>
                  </div>

                  <Field label={t('employeeformmodal.dni')} htmlFor="emp-dni">
                    <input
                      id="emp-dni"
                      required
                      value={form.dni}
                      onChange={(e) => update({ dni: e.target.value.replace(/\D/g, '') })}
                      className="input-field"
                      placeholder="30123456"
                      inputMode="numeric"
                    />
                  </Field>

                  <Field label={t('employeeformmodal.email')} htmlFor="emp-email">
                    <input
                      id="emp-email"
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => update({ email: e.target.value })}
                      className="input-field"
                      placeholder={t('employeeformmodal.empleadosaloncom')}
                      autoComplete="email"
                    />
                  </Field>

                  <Field label={t('employeeformmodal.telfono')} htmlFor="emp-phone">
                    <input
                      id="emp-phone"
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update({ phone: e.target.value })}
                      className="input-field"
                      placeholder="+54 11 1234-5678"
                      autoComplete="tel"
                    />
                  </Field>

                  <div className="flex items-start gap-2.5 rounded-xl border border-primary/10 bg-primary/5 px-4 py-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-[12px] leading-relaxed text-slate-600">
                      {t('employeeformmodal.al_guardar_el_empleado_recibir_un_email_')}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-2 border-t border-black/[0.05] pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="dash-btn-secondary w-full sm:w-auto"
                  >
                    {t('employeeformmodal.cancelar')}
                  </button>
                  <button type="submit" className="dash-btn-primary w-full sm:w-auto">
                    {t('employeeformmodal.guardar_empleado')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: ReactNode
}) {

  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-slate-700">{label}</span>
      {children}
    </label>
  )
}
