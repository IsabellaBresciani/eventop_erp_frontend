import { useNavigate, useSearchParams } from 'react-router-dom'
import { EventWizard } from '../components/event-wizard/EventWizard'
import { loadEvents, saveEvents } from '../data/events-storage'
import { useAuthGuard } from '../hooks/useAuthGuard'
import type { CalendarEvent } from '../types/dashboard'

export default function CreateEventPage() {
  useAuthGuard({ allowedRoles: ['admin'] })
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultDate = searchParams.get('fecha')

  const handleCreate = (event: CalendarEvent) => {
    const events = loadEvents()
    saveEvents([...events, event])
    navigate('/dashboard', { state: { createdEventId: event.id } })
  }

  return (
    <EventWizard
      defaultDate={defaultDate}
      onCancel={() => navigate('/dashboard')}
      onCreate={handleCreate}
    />
  )
}
