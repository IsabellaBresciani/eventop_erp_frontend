import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, UserX, XCircle } from 'lucide-react'
import type { ScanResult } from '../../types/checkin'

interface ScanFeedbackProps {
  result: ScanResult | null
  onDismiss: () => void
}

const CONFIG = {
  welcome: {
    bg: 'bg-emerald-500',
    icon: CheckCircle2,
    title: '¡BIENVENIDO!',
  },
  duplicate: {
    bg: 'bg-red-500',
    icon: XCircle,
    title: 'YA INGRESADO',
  },
  not_found: {
    bg: 'bg-red-600',
    icon: UserX,
    title: 'INVITADO NO ENCONTRADO',
  },
}

export function ScanFeedback({ result, onDismiss }: ScanFeedbackProps) {
  return (
    <AnimatePresence>
      {result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${CONFIG[result.type].bg}`}
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-center text-white"
          >
            {(() => {
              const Icon = CONFIG[result.type].icon
              return <Icon className="mx-auto h-24 w-24 sm:h-32 sm:w-32" strokeWidth={1.5} />
            })()}
            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
              {CONFIG[result.type].title}
            </h1>
            {result.guest && (
              <p className="mt-4 text-xl font-semibold sm:text-2xl">
                {result.guest.firstName} {result.guest.lastName}
                {result.guest.plusOnes > 0 && ` +${result.guest.plusOnes}`}
              </p>
            )}
            <p className="mt-2 text-sm text-white/80">{result.message}</p>
            <p className="mt-8 text-xs text-white/50">Tocá para continuar</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
