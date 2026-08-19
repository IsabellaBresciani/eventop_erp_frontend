import { motion } from 'framer-motion'
import { KeyRound, Lock, Mail, Phone, User } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { Toggle } from '../components/agenda/SettingsCard'
import { FormField, StepCard } from '../components/profile/FormField'
import {
  loadAccountSettings,
  saveAccountSettings,
  type AccountSettings,
} from '../data/account-settings'
import { useAuthGuard } from '../hooks/useAuthGuard'

export default function AccountSettingsPage() {
  const { salon, session } = useAuthGuard()
  const [settings, setSettings] = useState<AccountSettings>(() => {
    const stored = loadAccountSettings()
    return {
      ...stored,
      fullName: session?.name ?? stored.fullName,
      email: session?.email ?? stored.email,
    }
  })
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })
  const [passwordError, setPasswordError] = useState('')
  const [saved, setSaved] = useState(false)

  const updateSettings = (patch: Partial<AccountSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
    setSaved(false)
  }

  const handleSave = () => {
    saveAccountSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!password.current || !password.next) {
      setPasswordError('Completá todos los campos')
      return
    }
    if (password.next.length < 8) {
      setPasswordError('La nueva contraseña debe tener al menos 8 caracteres')
      return
    }
    if (password.next !== password.confirm) {
      setPasswordError('Las contraseñas no coinciden')
      return
    }
    setPasswordError('')
    setPassword({ current: '', next: '', confirm: '' })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pb-12">
      <DashboardLayout
        salonName={salon}
        title="Ajustes de cuenta"
        subtitle="Gestioná tus datos personales, seguridad y preferencias"
        action={
          <button
            type="button"
            onClick={handleSave}
            className={`dash-btn-primary ${saved ? 'bg-emerald-600 hover:bg-emerald-600' : ''}`}
          >
            {saved ? 'Guardado ✓' : 'Guardar cambios'}
          </button>
        }
      >
        <div className="mx-auto max-w-2xl space-y-6">
          <StepCard title="Datos personales" description="Tu información de contacto como anfitrión">
            <div className="space-y-4">
              <FormField label="Nombre completo" htmlFor="acc-name" required>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="acc-name"
                    type="text"
                    value={settings.fullName}
                    onChange={(e) => updateSettings({ fullName: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </FormField>

              <FormField label="Email" htmlFor="acc-email" required>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="acc-email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSettings({ email: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </FormField>

              <FormField label="Teléfono" htmlFor="acc-phone" hint="Usado para notificaciones por SMS">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="acc-phone"
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => updateSettings({ phone: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </FormField>
            </div>
          </StepCard>

          <StepCard title="Seguridad" description="Actualizá tu contraseña de acceso">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <FormField label="Contraseña actual" htmlFor="acc-pass-current">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="acc-pass-current"
                    type="password"
                    value={password.current}
                    onChange={(e) => setPassword((p) => ({ ...p, current: e.target.value }))}
                    className="input-field pl-10"
                    autoComplete="current-password"
                  />
                </div>
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Nueva contraseña" htmlFor="acc-pass-new">
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="acc-pass-new"
                      type="password"
                      value={password.next}
                      onChange={(e) => setPassword((p) => ({ ...p, next: e.target.value }))}
                      className="input-field pl-10"
                      autoComplete="new-password"
                    />
                  </div>
                </FormField>
                <FormField label="Confirmar contraseña" htmlFor="acc-pass-confirm">
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="acc-pass-confirm"
                      type="password"
                      value={password.confirm}
                      onChange={(e) => setPassword((p) => ({ ...p, confirm: e.target.value }))}
                      className="input-field pl-10"
                      autoComplete="new-password"
                    />
                  </div>
                </FormField>
              </div>

              {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}

              <button type="submit" className="dash-btn-secondary py-2 text-sm">
                Actualizar contraseña
              </button>
            </form>
          </StepCard>

          <StepCard title="Notificaciones" description="Elegí cómo querés recibir recordatorios y novedades">
            <div className="space-y-4">
              <Toggle
                enabled={settings.notifyEmailReminders}
                onChange={(v) => updateSettings({ notifyEmailReminders: v })}
                label="Recordatorios por email"
                description="Recibí avisos sobre consultas, eventos y RSVPs"
              />
              <Toggle
                enabled={settings.notifySmsReminders}
                onChange={(v) => updateSettings({ notifySmsReminders: v })}
                label="Recordatorios por SMS"
                description="Alertas urgentes al teléfono registrado"
              />
              <Toggle
                enabled={settings.notifyMarketing}
                onChange={(v) => updateSettings({ notifyMarketing: v })}
                label="Novedades de EvenTop"
                description="Tips, actualizaciones y ofertas de la plataforma"
              />
            </div>
          </StepCard>
        </div>
      </DashboardLayout>
    </motion.div>
  )
}
