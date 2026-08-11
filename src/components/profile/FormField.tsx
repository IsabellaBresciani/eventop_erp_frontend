import type { ReactNode } from 'react'

interface FormFieldProps {
  label?: string
  htmlFor?: string
  required?: boolean
  error?: string
  isComplete?: boolean
  children: ReactNode
  hint?: string
  hideLabel?: boolean
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  isComplete,
  children,
  hint,
  hideLabel = false,
}: FormFieldProps) {
  const showLabel = Boolean(label) && !hideLabel

  return (
    <div className="space-y-1.5">
      {showLabel && (
        <label
          htmlFor={htmlFor}
          className={`block text-sm font-semibold ${
            error ? 'text-red-500' : isComplete ? 'text-slate-800' : 'text-slate-700'
          }`}
        >
          {label}
          {required && <span className="text-red-400"> *</span>}
        </label>
      )}
      <div
        className={
          error
            ? '[&_input]:input-field-error [&_textarea]:input-field-error [&_select]:input-field-error'
            : isComplete
              ? '[&_input]:border-primary/35 [&_textarea]:border-primary/35'
              : ''
        }
      >
        {children}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && !hideLabel && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

export function StepCard({
  title,
  description,
  children,
  embedded = false,
}: {
  title: string
  description?: string
  children: ReactNode
  embedded?: boolean
}) {
  if (embedded) {
    return <div className="space-y-5">{children}</div>
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {children}
    </div>
  )
}
