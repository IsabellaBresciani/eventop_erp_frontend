import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
  Compass,
  FileSpreadsheet,
  Upload,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CalendarEvent } from '../../types/dashboard'
import { formatInvitationDate } from '../../data/invitations-storage'

interface InvitationWizardProps {
  open: boolean
  onClose: () => void
  eligibleEvents: CalendarEvent[]
  onFinish: (eventId: string) => void
}

type UploadState = 'empty' | 'success' | 'error'

const MOCK_VENUE_CAPACITY = 250

export function InvitationWizard({ open, onClose, eligibleEvents, onFinish }: InvitationWizardProps) {
  const [step, setStep] = useState<'select' | 'import'>('select')
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [uploadState, setUploadState] = useState<UploadState>('empty')
  const [fileName, setFileName] = useState<string | null>(null)
  const [importedCount, setImportedCount] = useState<number>(0)

  const hasEligibleEvents = eligibleEvents.length > 0

  const selectedEvent = useMemo(
    () => eligibleEvents.find((e) => e.id === selectedEventId) ?? null,
    [eligibleEvents, selectedEventId],
  )

  const reset = () => {
    setStep('select')
    setSelectedEventId(null)
    setUploadState('empty')
    setFileName(null)
    setImportedCount(0)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const simulateFile = (file: File) => {
    setFileName(file.name)
    const guestCount = 40 + Math.floor(Math.random() * 260)
    setImportedCount(guestCount)
    setUploadState(guestCount > MOCK_VENUE_CAPACITY ? 'error' : 'success')
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) simulateFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) simulateFile(file)
  }

  const finish = () => {
    if (!selectedEventId) return
    onFinish(selectedEventId)
    handleClose()
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8 }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-elevated"
        >
          <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
            <div>
              <p className="text-base font-semibold text-ink">Crear invitación</p>
              <p className="text-xs text-ink-muted">
                {hasEligibleEvents
                  ? step === 'select'
                    ? 'Paso 1 de 2 · Selecciona un evento'
                    : 'Paso 2 de 2 · Importación de invitados'
                  : 'Proceso EvenTop'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-surface-muted"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-6 py-5">
            {!hasEligibleEvents ? (
              <BlockedState onClose={handleClose} />
            ) : step === 'select' ? (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-ink">Selecciona un Evento</h3>
                <div className="space-y-2">
                  {eligibleEvents.map((event) => {
                    const active = selectedEventId === event.id
                    return (
                      <label
                        key={event.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all ${
                          active
                            ? 'border-primary/50 bg-primary/[0.04] ring-2 ring-primary/15'
                            : 'border-surface-border hover:border-primary/25'
                        }`}
                      >
                        <input
                          type="radio"
                          name="wizard-event"
                          checked={active}
                          onChange={() => setSelectedEventId(event.id)}
                          className="h-4 w-4 accent-primary"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-ink">
                            {event.clientName} — {event.eventType}
                          </p>
                          <p className="text-xs text-ink-muted">
                            {formatInvitationDate(event.date)} · {event.startTime} hs
                          </p>
                        </div>
                      </label>
                    )
                  })}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={handleClose} className="dash-btn-secondary py-2 text-sm">
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={!selectedEventId}
                    onClick={() => setStep('import')}
                    className="dash-btn-primary py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continuar
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-ink">
                  Importación masiva de invitados vía Excel
                </h3>
                {selectedEvent && (
                  <p className="text-xs text-ink-muted">
                    Evento seleccionado:{' '}
                    <span className="font-semibold text-ink">
                      {selectedEvent.clientName} — {selectedEvent.eventType}
                    </span>
                  </p>
                )}

                {uploadState === 'empty' && (
                  <label
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-surface-muted px-6 py-12 text-center transition-colors hover:border-primary/40 hover:bg-primary/[0.02]"
                  >
                    <Upload className="h-8 w-8 text-slate-400" />
                    <p className="mt-3 text-sm font-medium text-ink">
                      Arrastrá tu archivo Excel aquí o hacé clic para seleccionar
                    </p>
                    <p className="mt-1 text-xs text-slate-400">Formatos aceptados: .xlsx, .xls, .csv</p>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                      onChange={handleFileInput}
                    />
                  </label>
                )}

                {uploadState === 'success' && (
                  <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-emerald-800">
                          {importedCount} invitados importados
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-emerald-700">
                          <FileSpreadsheet className="h-3.5 w-3.5 shrink-0" />
                          {fileName}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-emerald-100 bg-white/70 px-4 py-3 text-xs text-emerald-800">
                      Capacidad del salón: {MOCK_VENUE_CAPACITY} invitados · Ocupación estimada:{' '}
                      {Math.round((importedCount / MOCK_VENUE_CAPACITY) * 100)}%
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setUploadState('empty')}
                        className="dash-btn-secondary py-2 text-sm"
                      >
                        Reemplazar archivo
                      </button>
                      <button type="button" onClick={finish} className="dash-btn-primary py-2 text-sm">
                        <Check className="h-3.5 w-3.5" />
                        Continuar
                      </button>
                    </div>
                  </div>
                )}

                {uploadState === 'error' && (
                  <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50/70 p-5">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-6 w-6 shrink-0 text-red-600" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-red-800">Límite Excedido</p>
                        <p className="mt-1 text-xs leading-relaxed text-red-700">
                          El archivo <span className="font-semibold">{fileName}</span> contiene{' '}
                          {importedCount} invitados, lo cual supera la capacidad contratada del salón
                          ({MOCK_VENUE_CAPACITY} invitados) en {importedCount - MOCK_VENUE_CAPACITY}{' '}
                          personas.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setUploadState('empty')}
                        className="dash-btn-primary py-2 text-sm"
                      >
                        Reintentar
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex justify-start pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('select')}
                    className="btn-ghost py-1.5 text-xs"
                  >
                    Volver
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function BlockedState({ onClose }: { onClose: () => void }) {
  const stages = [
    { label: 'Explorar', done: true },
    { label: 'Reservar', done: true },
    { label: 'Invitaciones', done: false },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => (
          <div key={stage.label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                  stage.done
                    ? 'bg-emerald-500 text-white'
                    : 'border-2 border-primary bg-primary/10 text-primary'
                }`}
              >
                {stage.done ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <p
                className={`text-[11px] font-medium ${
                  stage.done ? 'text-emerald-600' : 'text-primary'
                }`}
              >
                {stage.label}
              </p>
            </div>
            {index < stages.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 rounded-full ${
                  stage.done ? 'bg-emerald-400' : 'bg-surface-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-surface-border bg-surface-muted px-6 py-8 text-center">
        <Compass className="mx-auto h-8 w-8 text-slate-300" />
        <p className="mt-3 text-sm font-semibold text-ink">
          Todavía no tenés eventos reservados
        </p>
        <p className="mx-auto mt-1.5 max-w-sm text-xs text-ink-muted">
          Para crear una invitación primero necesitás explorar salones disponibles y reservar tu
          evento. Una vez confirmada la reserva, vas a poder generar la invitación digital.
        </p>
        <Link
          to="/marketplace"
          onClick={onClose}
          className="dash-btn-primary mt-4 inline-flex py-2 text-sm"
        >
          Explorar salones
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}
