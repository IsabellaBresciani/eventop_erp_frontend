import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface SaveBarProps {
  isDirty: boolean
  isSaving: boolean
  showSuccess: boolean
  onSave: () => void
}

export function SaveBar({ isDirty, isSaving, showSuccess, onSave }: SaveBarProps) {
  const { t } = useTranslation()
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-border bg-white/90 backdrop-blur-xl">
      <div className="section-container flex items-center justify-between gap-4 py-4">
        <div className="text-sm text-slate-500">
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.span
                key="success"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 font-medium text-emerald-600"
              >
                <Check className="h-4 w-4" />
                {t('savebar.cambios_guardados_correctamente')}
              </motion.span>
            ) : isDirty ? (
              <motion.span
                key="dirty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {t('savebar.tens_cambios_sin_guardar')}
              </motion.span>
            ) : (
              <motion.span key="clean" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {t('savebar.configuracin_sincronizada_con_erp_y_mark')}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="btn-primary min-w-[160px] disabled:opacity-70"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('savebar.guardando')}
            </>
          ) : (
            'Guardar Cambios'
          )}
        </button>
      </div>
    </div>
  )
}
