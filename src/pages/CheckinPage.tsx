import { motion } from 'framer-motion'
import { ArrowLeft, QrCode, Users } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ManualSearch } from '../components/checkin/ManualSearch'
import { ScanFeedback } from '../components/checkin/ScanFeedback'
import { ScannerView } from '../components/checkin/ScannerView'
import {
  DEFAULT_CHECKIN_EVENT,
  findGuestByCode,
  getCheckedInCount,
  searchGuests,
} from '../data/checkin'
import { useAuthGuard } from '../hooks/useAuthGuard'
import type { CheckinEvent, EventGuest, ScanResult } from '../types/checkin'

export default function CheckinPage() {
  useAuthGuard()
  const [event, setEvent] = useState<CheckinEvent>(DEFAULT_CHECKIN_EVENT)
  const [feedback, setFeedback] = useState<ScanResult | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [codeInput, setCodeInput] = useState('')

  const checkedIn = useMemo(() => getCheckedInCount(event), [event])
  const searchResults = useMemo(
    () => searchGuests(event, searchQuery),
    [event, searchQuery],
  )

  const processGuest = useCallback((guest: EventGuest) => {
    if (guest.checkedIn) {
      setFeedback({
        type: 'duplicate',
        guest,
        message: `Ingresó anteriormente${guest.checkedInAt ? ` a las ${guest.checkedInAt}` : ''}`,
      })
      return
    }

    const now = new Date().toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    })

    setEvent((prev) => ({
      ...prev,
      guests: prev.guests.map((g) =>
        g.id === guest.id ? { ...g, checkedIn: true, checkedInAt: now } : g,
      ),
    }))

    setFeedback({
      type: 'welcome',
      guest,
      message: guest.plusOnes > 0 ? `Grupo de ${1 + guest.plusOnes} personas` : 'Acceso autorizado',
    })
  }, [])

  const processCode = useCallback(
    (code: string) => {
      const guest = findGuestByCode(event, code)
      if (!guest) {
        setFeedback({
          type: 'not_found',
          message: 'El código no corresponde a este evento',
        })
        return
      }
      processGuest(guest)
    },
    [event, processGuest],
  )

  useEffect(() => {
    if (!feedback) return
    const timer = setTimeout(() => setFeedback(null), 2000)
    return () => clearTimeout(timer)
  }, [feedback])

  const handleSelectFromSearch = (guest: EventGuest) => {
    setSearchQuery('')
    processGuest(guest)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Salir
          </Link>
          <div className="flex items-center gap-2">
            <QrCode className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold">Check-in QR</span>
          </div>
          <span className="text-[10px] text-white/40">RF-214</span>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-4 pb-8">
        <div className="mb-4 text-center">
          <h1 className="text-lg font-bold">{event.name}</h1>
          <p className="text-xs text-white/50">Anfitrión: {event.clientName}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <p className="text-sm text-white/80">Han ingresado</p>
          </div>
          <p className="mt-1 text-3xl font-black">
            <span className="text-primary">{checkedIn}</span>
            <span className="text-white/40"> / {event.maxCapacity}</span>
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(checkedIn / event.maxCapacity) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </motion.div>

        <ScannerView active={!feedback} onScan={processCode} />

        <div className="mt-4">
          <ManualSearch
            query={searchQuery}
            onQueryChange={setSearchQuery}
            results={searchResults}
            onSelect={handleSelectFromSearch}
            codeInput={codeInput}
            onCodeInputChange={setCodeInput}
            onCodeSubmit={() => {
              if (codeInput.trim()) {
                processCode(codeInput)
                setCodeInput('')
              }
            }}
          />
        </div>

        <div className="mt-4 rounded-xl bg-white/5 p-3 text-center text-[10px] text-white/40">
          Códigos de prueba: EVT-M3N4O5P6 (Diego) · EVT-Q7R8S9T0 (María) · EVT-INVALID (error)
        </div>
      </main>

      <ScanFeedback result={feedback} onDismiss={() => setFeedback(null)} />
    </div>
  )
}
