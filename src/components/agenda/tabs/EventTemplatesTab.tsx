import { GripVertical, Plus, Trash2 } from 'lucide-react'
import type { AgendaSettings } from '../../../types/agenda-settings'
import { DEFAULT_TABLE_PAGE_SIZE, TablePagination } from '../../ui/TablePagination'
import { usePagination } from '../../../hooks/usePagination'
import { SettingsCard } from '../SettingsCard'
import { useTranslation } from 'react-i18next'

interface EventTemplatesTabProps {
  settings: AgendaSettings
  onChange: (patch: Partial<AgendaSettings>) => void
}

export function EventTemplatesTab({ settings, onChange }: EventTemplatesTabProps) {
  const { t } = useTranslation()
  const updateTemplate = (id: string, field: 'name' | 'durationHours', value: string | number) => {
    onChange({
      eventTemplates: settings.eventTemplates.map((t) =>
        t.id === id ? { ...t, [field]: value } : t,
      ),
    })
  }

  const addTemplate = () => {
    onChange({
      eventTemplates: [
        ...settings.eventTemplates,
        { id: `tpl-${Date.now()}`, name: 'Nuevo tipo', durationHours: 4 },
      ],
    })
  }

  const removeTemplate = (id: string) => {
    onChange({ eventTemplates: settings.eventTemplates.filter((t) => t.id !== id) })
  }

  const { page, setPage, totalPages, paginatedItems, totalItems } = usePagination(
    settings.eventTemplates,
    DEFAULT_TABLE_PAGE_SIZE,
  )

  return (
    <div className="space-y-6">
      <SettingsCard
        title={t('eventtemplatestab.plantillas_de_eventos')}
        description="Duraciones por defecto. Al arrastrar un tipo al calendario, el bloque se ajusta automáticamente."
      >
        <div className="overflow-hidden rounded-xl border border-surface-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border bg-surface/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t('eventtemplatestab.tipo_de_evento')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t('eventtemplatestab.duracin')}
                </th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((tpl) => (
                <tr key={tpl.id} className="border-b border-surface-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 cursor-grab text-slate-300" />
                      <input
                        type="text"
                        value={tpl.name}
                        onChange={(e) => updateTemplate(tpl.id, 'name', e.target.value)}
                        className="input-field border-0 bg-transparent px-0 py-1 focus:shadow-none"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={24}
                        value={tpl.durationHours}
                        onChange={(e) =>
                          updateTemplate(tpl.id, 'durationHours', Number(e.target.value))
                        }
                        className="input-field w-20"
                      />
                      <span className="text-slate-500">{t('eventtemplatestab.horas')}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => removeTemplate(tpl.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                      aria-label="Eliminar plantilla"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <TablePagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={DEFAULT_TABLE_PAGE_SIZE}
            onPageChange={setPage}
            itemLabel="plantillas"
            className="border-t-0"
          />
        </div>

        <button type="button" onClick={addTemplate} className="btn-secondary mt-4">
          <Plus className="h-4 w-4" />
          {t('eventtemplatestab.agregar_tipo_de_evento')}
        </button>

        <div className="mt-5 rounded-xl bg-primary/5 p-4">
          <p className="text-xs font-medium text-primary">
            {t('eventtemplatestab.impacto_en_el_calendario')}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {t('eventtemplatestab.al_seleccionar_boda_xv_en_el_calendario_')}{' '}
            {settings.eventTemplates.find((t) => t.name.includes('Boda'))?.durationHours ?? 8}{' '}
            {t('eventtemplatestab.horas_1')}
            {settings.bufferHours}
            {t('eventtemplatestab.h_de_buffer_de_limpieza')}
          </p>
        </div>
      </SettingsCard>

      <SettingsCard
        title={t('eventtemplatestab.vista_previa_de_bloques')}
        description="Cómo se verán los bloques en el calendario."
      >
        <div className="space-y-2">
          {settings.eventTemplates.map((tpl) => (
            <div key={tpl.id} className="flex items-center gap-3">
              <div
                className="h-8 rounded-lg bg-primary/80 transition-all"
                style={{ width: `${Math.min(tpl.durationHours * 12, 100)}%` }}
              />
              <span className="shrink-0 text-xs text-slate-500">
                {tpl.name} · {tpl.durationHours}h
              </span>
            </div>
          ))}
        </div>
      </SettingsCard>
    </div>
  )
}
