import { EVENT_STATUS_CONFIG } from '../../data/dashboard'
import { WEEKDAY_SHORT } from '../../data/agenda-defaults'
import type { AgendaSettings, Weekday } from '../../types/agenda-settings'
import { useTranslation } from 'react-i18next'

interface CalendarMiniPreviewProps {
  settings: AgendaSettings
}

export function CalendarMiniPreview({ settings }: CalendarMiniPreviewProps) {
  const { t } = useTranslation()
  const weekdays = Object.keys(WEEKDAY_SHORT) as Weekday[]
  const openCount = weekdays.filter((d) => settings.openDays[d]).length
  const slotLabel =
    settings.slotGranularity < 60
      ? `${settings.slotGranularity} min`
      : `${settings.slotGranularity / 60}h`

  const previewDays = Array.from({ length: 14 }, (_, i) => {
    const dayNum = i + 3
    const weekdayIndex = (dayNum + 6) % 7
    const weekdayKey = weekdays[weekdayIndex]
    const isOpen = settings.openDays[weekdayKey]
    const isHoliday = settings.blockHolidays && dayNum === 17
    const isException = settings.exceptions.some((e) =>
      e.date.endsWith(`-${String(dayNum).padStart(2, '0')}`),
    )

    let status: 'open' | 'closed' | 'holiday' | 'exception' | 'visit' = 'open'
    if (isException) status = 'exception'
    else if (isHoliday) status = 'holiday'
    else if (!isOpen) status = 'closed'
    else if (settings.visitSlots.some((s) => s.day === weekdayKey)) status = 'visit'

    const eventStatuses = ['presupuestado', 'senado', 'pagado'] as const
    const hasEvent = isOpen && !isHoliday && !isException && i % 3 === 0

    return { dayNum, status, hasEvent, eventStatus: eventStatuses[i % 3] }
  })

  return (
    <div className="sticky top-24 rounded-card border border-surface-border bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {t('calendarminipreview.minipreview')}
          </h3>
          <p className="text-xs text-slate-500">{t('calendarminipreview.vista_en_tiempo_real')}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
          {t('calendarminipreview.slots')}
          {slotLabel}
        </span>
      </div>

      <div className="mb-3 grid grid-cols-7 gap-1">
        {weekdays.map((d) => (
          <div
            key={d}
            className={`py-1 text-center text-[10px] font-semibold ${
              settings.openDays[d] ? 'text-primary' : 'text-slate-300 line-through'
            }`}
          >
            {WEEKDAY_SHORT[d]}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {previewDays.map(({ dayNum, status, hasEvent, eventStatus }) => {
          let bg = 'bg-surface text-slate-600'
          if (status === 'closed') bg = 'bg-slate-100 text-slate-300'
          if (status === 'holiday') bg = 'bg-red-50 text-red-400'
          if (status === 'exception') bg = 'bg-slate-200 text-slate-500'
          if (status === 'visit') bg = 'bg-primary/10 text-primary'
          if (hasEvent) {
            const custom = settings.statusColors.find((c) => c.key === eventStatus)
            const defaultColor = EVENT_STATUS_CONFIG[eventStatus]?.color
            return (
              <div
                key={dayNum}
                className="flex h-8 items-center justify-center rounded-lg text-[11px] font-semibold text-white"
                style={{ backgroundColor: custom?.color ?? defaultColor }}
              >
                {dayNum}
              </div>
            )
          }

          return (
            <div
              key={dayNum}
              className={`flex h-8 items-center justify-center rounded-lg text-[11px] font-medium ${bg}`}
            >
              {dayNum}
            </div>
          )
        })}
      </div>

      <div className="mt-4 space-y-2 border-t border-surface-border pt-4">
        <PreviewStat label={t('calendarminipreview.das_abiertos')} value={`${openCount}/7`} />
        <PreviewStat
          label={t('calendarminipreview.buffer_entre_eventos')}
          value={`${settings.bufferHours}h`}
        />
        <PreviewStat
          label={t('calendarminipreview.antelacin_mnima')}
          value={`${settings.minAdvanceValue} ${settings.minAdvanceUnit === 'hours' ? 'hs' : 'días'}`}
        />
        <PreviewStat
          label={t('calendarminipreview.vencimiento_presupuesto')}
          value={`${settings.quoteExpiryHours}hs`}
        />
        {settings.blockHolidays && (
          <p className="text-[10px] text-amber-600">
            {t('calendarminipreview.feriados_nacionales_bloqueados')}
          </p>
        )}
      </div>
    </div>
  )
}

function PreviewStat({ label, value }: { label: string; value: string }) {

  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  )
}
