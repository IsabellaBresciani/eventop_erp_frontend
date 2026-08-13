import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { InquiryDetail } from '../components/messaging/InquiryDetail'
import { InquiryInbox, type InquiryFilter } from '../components/messaging/InquiryInbox'
import { MOCK_INQUIRIES } from '../data/messaging'
import { useAuthGuard } from '../hooks/useAuthGuard'
import type { Inquiry, InquiryStatus } from '../types/messaging'
import { useTranslation } from 'react-i18next'

export default function MessagingPage() {
  const { t } = useTranslation()
  const { salon } = useAuthGuard()
  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<InquiryFilter>('activas')
  const [search, setSearch] = useState('')

  const selected = useMemo(
    () => inquiries.find((i) => i.id === selectedId) ?? null,
    [inquiries, selectedId],
  )

  const handleSelect = (id: string) => {
    setSelectedId(id)
    setInquiries((prev) =>
      prev.map((i) =>
        i.id === id && i.status === 'nueva' ? { ...i, status: 'leida' as const } : i,
      ),
    )
  }

  const handleStatusChange = (inquiryId: string, status: InquiryStatus) => {
    setInquiries((prev) => prev.map((i) => (i.id === inquiryId ? { ...i, status } : i)))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col"
    >
      <DashboardLayout
        salonName={salon}
        title={t('messagingpage.consultas')}
        subtitle={t('messagingpage.bandeja_de_consultas_respond_por_whatsap')}
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
                {t('messagingpage.volver_a_consultas')}
              </button>
            )}
            <InquiryDetail inquiry={selected} onStatusChange={handleStatusChange} />
          </div>
        </div>
      </DashboardLayout>
    </motion.div>
  )
}
