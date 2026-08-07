import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { AGENDA_TABS, DEFAULT_AGENDA_SETTINGS } from '../data/agenda-defaults'
import { useAuthGuard } from '../hooks/useAuthGuard'
import type { AgendaSettings, AgendaTab } from '../types/agenda-settings'
import { CalendarMiniPreview } from '../components/agenda/CalendarMiniPreview'
import { SaveBar } from '../components/agenda/SaveBar'
import { AvailabilityTab } from '../components/agenda/tabs/AvailabilityTab'
import { EventTemplatesTab } from '../components/agenda/tabs/EventTemplatesTab'
import { MarketplaceTab } from '../components/agenda/tabs/MarketplaceTab'
import { VisualTab } from '../components/agenda/tabs/VisualTab'
import { VisitsTab } from '../components/agenda/tabs/VisitsTab'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'

const STORAGE_KEY = 'eventop_agenda_settings'

function loadSettings(): AgendaSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return { ...DEFAULT_AGENDA_SETTINGS, ...JSON.parse(stored) }
  } catch {
    /* use defaults */
  }
  return DEFAULT_AGENDA_SETTINGS
}

export default function AgendaSettingsPage() {
  const { salon } = useAuthGuard()
  const [activeTab, setActiveTab] = useState<AgendaTab>('availability')
  const [settings, setSettings] = useState<AgendaSettings>(loadSettings)
  const [savedSnapshot, setSavedSnapshot] = useState(JSON.stringify(loadSettings()))
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const isDirty = JSON.stringify(settings) !== savedSnapshot

  const updateSettings = useCallback((patch: Partial<AgendaSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
    setShowSuccess(false)
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    setSavedSnapshot(JSON.stringify(settings))
    setIsSaving(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-24"
    >
      <DashboardLayout
        salonName={salon}
        title="Configuración Avanzada de Agenda"
        subtitle="RF-003 · Reglas de negocio para el ERP y el Marketplace"
      >
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-1 rounded-xl border border-surface-border bg-white p-1 shadow-card">
            {AGENDA_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 rounded-lg px-4 py-2.5 text-left transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-600 hover:bg-surface hover:text-slate-900'
                }`}
              >
                <span className="block text-sm font-semibold">{tab.label}</span>
                <span
                  className={`block text-[10px] ${
                    activeTab === tab.id ? 'text-primary-100' : 'text-slate-400'
                  }`}
                >
                  {tab.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {activeTab === 'availability' && (
              <AvailabilityTab settings={settings} onChange={updateSettings} />
            )}
            {activeTab === 'marketplace' && (
              <MarketplaceTab settings={settings} onChange={updateSettings} />
            )}
            {activeTab === 'visits' && <VisitsTab settings={settings} onChange={updateSettings} />}
            {activeTab === 'templates' && (
              <EventTemplatesTab settings={settings} onChange={updateSettings} />
            )}
            {activeTab === 'visual' && <VisualTab settings={settings} onChange={updateSettings} />}
          </div>

          <div className="lg:col-span-4">
            <CalendarMiniPreview settings={settings} />
          </div>
        </div>
      </DashboardLayout>

      <SaveBar
        isDirty={isDirty}
        isSaving={isSaving}
        showSuccess={showSuccess}
        onSave={handleSave}
      />
    </motion.div>
  )
}
