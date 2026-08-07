import { CalendarDays } from 'lucide-react'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-card">
        <CalendarDays className="h-5 w-5" strokeWidth={2.25} />
      </div>
      <span className="text-xl font-bold tracking-tight text-slate-900">
        Even<span className="text-primary">Top</span>
      </span>
    </div>
  )
}

export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl bg-primary text-white shadow-card ${className}`}
    >
      <CalendarDays className="h-5 w-5" strokeWidth={2.25} />
    </div>
  )
}
