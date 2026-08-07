import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail, User, X } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from './Logo'

type AuthMode = 'login' | 'register'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: AuthMode
}

export function AuthModal({ isOpen, onClose, initialMode = 'register' }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isOpen) setMode(initialMode)
  }, [isOpen, initialMode])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md rounded-card border border-surface-border bg-white/90 p-8 shadow-card-hover backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 flex justify-center">
              <Logo />
            </div>

            <div className="mb-6 flex rounded-xl bg-surface p-1">
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  mode === 'register'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Registrarse
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  mode === 'login'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Iniciar sesión
              </button>
            </div>

            <h2 className="mb-1 text-center text-2xl font-semibold text-slate-900">
              {mode === 'register' ? 'Comienza tu prueba gratis' : 'Bienvenido de nuevo'}
            </h2>
            <p className="mb-6 text-center text-sm text-slate-500">
              {mode === 'register'
                ? 'Crea tu cuenta y profesionaliza la gestión de tu salón en minutos.'
                : 'Accede a tu panel de administración.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Nombre del salón"
                    className="input-field pl-10"
                    required
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className="input-field pl-10"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {mode === 'login' && (
                <div className="text-right">
                  <Link to="/login" onClick={onClose} className="text-xs font-medium text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              )}

              <button type="submit" className="btn-primary w-full">
                {mode === 'register' ? 'Comenzar Prueba Gratis' : 'Entrar al Panel'}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400">o continúa con</span>
              </div>
            </div>

            <button type="button" className="btn-secondary w-full">
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
