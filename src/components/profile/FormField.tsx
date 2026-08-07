import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  isComplete?: boolean
  children: ReactNode
  hint?: string
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  isComplete,
  children,
  hint,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className={`block text-xs font-semibold uppercase tracking-wider ${
          error ? 'text-red-500' : isComplete ? 'text-primary' : 'text-slate-400'
        }`}
      >
        {label}
        {required && <span className="text-red-400"> *</span>}
      </label>
      <div
        className={
          error
            ? '[&_input]:input-field-error [&_textarea]:input-field-error [&_select]:input-field-error'
            : isComplete
              ? '[&_input]:border-primary/40 [&_input]:bg-primary/[0.02] [&_textarea]:border-primary/40 [&_textarea]:bg-primary/[0.02]'
              : ''
        }
      >
        {children}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

export function StepCard({ title, description, children }: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <div className="rounded-card border border-surface-border bg-white p-6 shadow-card sm:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {children}
    </div>
  )
}
