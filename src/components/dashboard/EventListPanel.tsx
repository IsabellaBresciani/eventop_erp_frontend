import { motion } from 'framer-motion'
import { ArrowRight, Calendar, ChevronDown, Clock, Search, Users, X } from 'lucide-react'
import { useMemo } from 'react'
import { EVENT_STATUS_CONFIG, formatCurrency } from '../../data/dashboard'
import { TablePagination } from '../ui/TablePagination'
import { usePagination } from '../../hooks/usePagination'
import type { CalendarEvent, EventStatus } from '../../types/dashboard'
import { useTranslation } from 'react-i18next'

export interface EventListFilters {
  query: string
  status: EventStatus | 'all'
  eventType: string | 'all'
}

interface EventListPanelProps {
  events: CalendarEvent[]
  filters: EventListFilters
  selectedDate: string | null
  selectedEventId: string | null
  onFiltersChange: (patch: Partial<EventListFilters>) => void
  onClearCalendarFilter: () => void
  onSelectEvent: (event: CalendarEvent) => void
  eventTypes: string[]
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos los estados' },
  ...Object.entries(EVENT_STATUS_CONFIG).map(([value, { label }]) => ({
    value,
    label,
  })),
]

const PAGE_SIZE = 6

export function EventListPanel({
  events,
  filters,
  selectedDate,
  selectedEventId,
  onFiltersChange,
  onClearCalendarFilter,
  onSelectEvent,
  eventTypes,
}: EventListPanelProps) {
  const { t } = useTranslation()
  const hasActiveFilters =
    filters.query.trim() !== '' ||
    filters.status !== 'all' ||
    filters.eventType !== 'all' ||
    selectedDate !== null ||
    selectedEventId !== null

  const selectedEventLabel = useMemo(
    () => events.find((event) => event.id === selectedEventId)?.clientName ?? null,
    [events, selectedEventId],
  )

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [events],
  )

  const { page, setPage, totalPages, paginatedItems, totalItems } = usePagination(
    sortedEvents,
    PAGE_SIZE,
  )

  const clearFilters = () => {
    onFiltersChange({ query: '', status: 'all', eventType: 'all' })
    onClearCalendarFilter()
  }

  return (
    <section className="dash-card overflow-hidden">
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-apple-label"
              strokeWidth={1.75}
            />
            <input
              type="search"
              value={filters.query}
              onChange={(e) => onFiltersChange({ query: e.target.value })}
              placeholder={t('eventlistpanel.buscar_por_evento_o_cliente')}
              className="catalog-search w-full rounded-full py-2.5 pl-11"
            />
          </div>

          <ToolbarSelect
            value={filters.eventType}
            onChange={(eventType) => onFiltersChange({ eventType })}
            options={[
              { value: 'all', label: 'Todos los tipos' },
              ...eventTypes.map((type) => ({ value: type, label: type })),
            ]}
          />

          <ToolbarSelect
            value={filters.status}
            onChange={(status) => onFiltersChange({ status: status as EventStatus | 'all' })}
            options={STATUS_OPTIONS}
          />
        </div>

        {(selectedDate || selectedEventId || hasActiveFilters) && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {selectedEventId && selectedEventLabel && (
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
                {selectedEventLabel}
                <button
                  type="button"
                  onClick={onClearCalendarFilter}
                  className="rounded-full p-0.5 hover:bg-primary/10"
                  aria-label="Quitar filtro de evento"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
            {selectedDate && !selectedEventId && (
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(`${selectedDate}T12:00:00`).toLocaleDateString('es-AR', {
                  day: 'numeric',
                  month: 'short',
                })}
                <button
                  type="button"
                  onClick={onClearCalendarFilter}
                  className="rounded-full p-0.5 hover:bg-primary/10"
                  aria-label="Quitar filtro de fecha"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-primary transition-colors hover:text-primary-600"
              >
                {t('eventlistpanel.limpiar_filtros')}
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sortedEvents.length === 0 ? (
            <div className="catalog-empty col-span-full">
              <Calendar className="mb-3 h-9 w-9 text-slate-300" strokeWidth={1.5} />
              <p className="text-sm font-medium text-slate-600">
                {t('eventlistpanel.no_hay_eventos_que_coincidan')}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {t('eventlistpanel.prob_con_otros_trminos_o_filtros')}
              </p>
            </div>
          ) : (
            paginatedItems.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                onSelect={() => onSelectEvent(event)}
              />
            ))
          )}
        </div>

        <TablePagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          itemLabel="eventos"
          className="mt-8 px-0"
        />
      </div>
    </section>
  )
}

function ToolbarSelect({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {

  return (
    <div className="relative w-full shrink-0 lg:w-auto lg:min-w-[11.5rem]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="catalog-select w-full appearance-none rounded-full py-2.5 pl-4 pr-9"
        aria-label={options.find((o) => o.value === value)?.label}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-apple-label" />
    </div>
  )
}

function EventCard({
  event,
  index,
  onSelect,
}: {
  event: CalendarEvent
  index: number
  onSelect: () => void
}) {
  const { t } = useTranslation()
  const status = EVENT_STATUS_CONFIG[event.status]

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      className="catalog-card group text-left"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-medium text-slate-400">
          {event.eventType} / {formatCardDate(event.date)}
        </span>
        <span
          className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
          style={{ backgroundColor: status.color }}
        >
          {status.label}
        </span>
      </div>

      <h3 className="mt-4 text-base font-semibold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-primary">
        {event.clientName}
      </h3>

      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">
        {t('eventlistpanel.evento_de')}
        {event.eventType.toLowerCase()} {t('eventlistpanel.con')}
        {event.guests} {t('eventlistpanel.invitados_horario')} {event.startTime} – {event.endTime}{' '}
        {t('eventlistpanel.hs_presupuesto_total')} {formatCurrency(event.totalAmount)}.
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1 text-xs">
            <Users className="h-3.5 w-3.5" />
            {event.guests}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <Clock className="h-3.5 w-3.5" />
            {event.startTime}
          </span>
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: status.color }} />
        </div>
        <span className="flex items-center gap-1 text-sm font-semibold text-primary">
          {t('eventlistpanel.ver')}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </motion.button>
  )
}

function formatCardDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
  })
}
