import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { InquiryDetail } from '../components/messaging/InquiryDetail'
import { InquiryInbox } from '../components/messaging/InquiryInbox'
import { MOCK_INQUIRIES } from '../data/messaging'
import { useAuthGuard } from '../hooks/useAuthGuard'
import type { Inquiry, InquiryStatus } from '../types/messaging'

export default function MessagingPage() {
  const { salon } = useAuthGuard()
  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES)
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_INQUIRIES[0]?.id ?? null)
  const [filter, setFilter] = useState<InquiryStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const selected = useMemo(
    () => inquiries.find((i) => i.id === selectedId) ?? null,
    [inquiries, selectedId],
  )

  const handleSelect = (id: string) => {
    setSelectedId(id)
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, unread: false } : i)),
    )
  }

  const handleSendMessage = (inquiryId: string, text: string) => {
    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'salon' as const,
      text,
      timestamp: new Date().toISOString(),
    }
    setInquiries((prev) =>
      prev.map((i) =>
        i.id === inquiryId
          ? {
              ...i,
              messages: [...i.messages, newMsg],
              lastMessage: text,
              lastActivity: 'Ahora',
            }
          : i,
      ),
    )
  }

  const handleStatusChange = (inquiryId: string, status: Inquiry['status']) => {
    setInquiries((prev) =>
      prev.map((i) => (i.id === inquiryId ? { ...i, status } : i)),
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col"
    >
      <DashboardLayout
        salonName={salon}
        title="Central de Mensajería"
        subtitle="RF-006 · Consultas, presupuestos y respuestas rápidas"
      >
        <div className="grid min-h-[600px] flex-1 gap-4 lg:grid-cols-12">
          <div className={`lg:col-span-4 ${selectedId ? 'hidden lg:block' : ''}`}>
            <InquiryInbox
              inquiries={inquiries}
              selectedId={selectedId}
              filter={filter}
              onSelect={handleSelect}
              onFilterChange={setFilter}
              search={search}
              onSearchChange={setSearch}
            />
          </div>

          <div className={`lg:col-span-8 ${!selectedId ? 'hidden lg:block' : ''}`}>
            {selectedId && (
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="mb-2 flex items-center gap-1 text-sm text-primary lg:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al inbox
              </button>
            )}
            <InquiryDetail
              inquiry={selected}
              onSendMessage={handleSendMessage}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </DashboardLayout>
    </motion.div>
  )
}
