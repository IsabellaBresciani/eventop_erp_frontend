import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DEMO_ADMIN_SALONS } from '../data/admin-salons'
import { authenticateEmployee } from '../data/employees'
import { setAuthSession } from '../lib/auth-session'
import { Logo } from '../components/ui/Logo'
import { GoogleButton } from '../components/auth/GoogleButton'
import tenantConfig from '../config/tenant.json'

const DEMO_EMAIL = 'admin@eventop.com'
const DEMO_PASSWORD = 'eventop2024'
const DEFAULT_ADMIN_SALON = DEMO_ADMIN_SALONS[0]

function buildAdminSession(email: string, name = 'Administrador') {
  return {
    email,
    salon: DEFAULT_ADMIN_SALON.name,
    salonId: DEFAULT_ADMIN_SALON.id,
    salons: DEMO_ADMIN_SALONS,
    role: 'admin' as const,
    name,
  }
}

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ email: false, password: false })
  const [isExiting, setIsExiting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({ email: false, password: false })

    if (!email.trim() || !password.trim()) {
      setError(t('login.error_empty'))
      setFieldErrors({ email: !email.trim(), password: !password.trim() })
      return
    }

    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 900))

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setAuthSession(buildAdminSession(email))
      setIsExiting(true)
      setTimeout(() => navigate('/dashboard', { replace: true }), 400)
      return
    }

    const employee = authenticateEmployee(email, password)
    if (employee) {
      setAuthSession({
        email: employee.email,
        salon: 'Quinta Los Olivos',
        role: 'employee',
        userId: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
      })
      setIsExiting(true)
      setTimeout(() => navigate('/dashboard/mis-eventos', { replace: true }), 400)
      return
    }

    setIsLoading(false)
    setError(t('login.error_invalid'))
    setFieldErrors({ email: true, password: true })
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 700))
    setAuthSession(buildAdminSession('google@eventop.com'))
    setIsExiting(true)
    setTimeout(() => navigate('/dashboard', { replace: true }), 400)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-surface to-surface" />
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/25 blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 h-[450px] w-[450px] rounded-full bg-primary/15 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={isExiting ? { opacity: 0, y: -16, scale: 1.02 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <div className="rounded-card border border-white/60 bg-white/60 p-8 shadow-card-hover backdrop-blur-2xl sm:p-10">
          <div className="absolute left-1/2 top-8 flex -translate-x-1/2 flex-col items-center md:hidden">
            <Logo className="scale-125" />
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {t('login.welcome_title', { appName: tenantConfig.VITE_APP_NAME })}
            </h1>
            <p className="mt-2 text-sm text-slate-500">{t('login.welcome_subtitle')}</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
                role="alert"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="sr-only">
                {t('login.email_placeholder')}
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                    fieldErrors.email ? 'text-red-400' : 'text-slate-400'
                  }`}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: false }))
                    if (error) setError('')
                  }}
                  placeholder={t('login.email_placeholder')}
                  autoComplete="email"
                  disabled={isLoading}
                  className={`input-field pl-10 ${fieldErrors.email ? 'input-field-error' : ''}`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                {t('login.password_placeholder')}
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                    fieldErrors.password ? 'text-red-400' : 'text-slate-400'
                  }`}
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (fieldErrors.password)
                      setFieldErrors((prev) => ({ ...prev, password: false }))
                    if (error) setError('')
                  }}
                  placeholder={t('login.password_placeholder')}
                  autoComplete="current-password"
                  disabled={isLoading}
                  className={`input-field pl-10 pr-10 ${
                    fieldErrors.password ? 'input-field-error' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                    showPassword ? 'text-primary' : 'text-slate-400 hover:text-primary'
                  }`}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-xs font-medium text-slate-500 transition-colors hover:text-primary"
              >
                {t('login.forgot_password')}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-login w-full disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('login.submit_loading')}
                </>
              ) : (
                t('login.submit_button')
              )}
            </button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-border/80" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white/60 px-3 text-xs text-slate-400 backdrop-blur-sm">
                {t('login.or_continue')}
              </span>
            </div>
          </div>

          <GoogleButton onClick={handleGoogleLogin} disabled={isLoading} />

          <p className="mt-8 text-center text-xs text-slate-400">
            {t('login.no_account')}{' '}
            <Link to="/" className="font-medium text-primary hover:underline">
              {t('login.start_trial')}
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-400">
          {t('loginpage.admin')}
          {DEMO_EMAIL} / {DEMO_PASSWORD}
          <br />
          {t('loginpage.empleado_demo_luciafernandezeventopcom_e')}
        </p>
      </motion.div>
    </div>
  )
}
