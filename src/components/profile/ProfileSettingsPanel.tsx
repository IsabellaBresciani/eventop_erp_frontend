import { Check, Loader2, Pencil, X } from 'lucide-react'
import type { ReactNode } from 'react'

export function ProfileSettingsPanel({
  editing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  children,
}: {
  editing: boolean
  isSaving?: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-end gap-2 border-b border-slate-100 px-4 py-3 sm:px-5">
        {editing ? (
          <>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-800 disabled:opacity-70"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Guardar
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-primary"
            aria-label="Editar"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="px-5 py-5 sm:px-6 sm:py-6">{children}</div>
    </div>
  )
}
