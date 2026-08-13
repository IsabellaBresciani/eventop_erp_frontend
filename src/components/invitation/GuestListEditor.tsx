import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import {
  createEmptyGuest,
  deleteRsvp,
  formatConfirmedAt,
  upsertRsvp,
} from '../../data/invitations-storage'
import type { GuestCompanion, GuestConfirmation } from '../../types/guest-invitation'
import { useTranslation } from 'react-i18next'

interface GuestListEditorProps {
  eventId: string
  guests: GuestConfirmation[]
  onChange: (guests: GuestConfirmation[]) => void
}

export function GuestListEditor({ eventId, guests, onChange }: GuestListEditorProps) {
  const { t } = useTranslation()
  const [editing, setEditing] = useState<GuestConfirmation | null>(null)
  const [error, setError] = useState<string | null>(null)

  const startCreate = () => {
    setError(null)
    setEditing(createEmptyGuest())
  }

  const startEdit = (guest: GuestConfirmation) => {
    setError(null)
    setEditing({
      ...guest,
      companions: guest.companions.map((c) => ({ ...c })),
    })
  }

  const cancel = () => {
    setEditing(null)
    setError(null)
  }

  const updateField = <K extends keyof GuestConfirmation>(key: K, value: GuestConfirmation[K]) => {
    setEditing((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const addCompanion = () => {
    setEditing((prev) =>
      prev
        ? {
            ...prev,
            companions: [
              ...prev.companions,
              { id: `c-${Date.now()}`, firstName: '', lastName: '' },
            ],
          }
        : prev,
    )
  }

  const updateCompanion = (id: string, patch: Partial<GuestCompanion>) => {
    setEditing((prev) =>
      prev
        ? {
            ...prev,
            companions: prev.companions.map((c) => (c.id === id ? { ...c, ...patch } : c)),
          }
        : prev,
    )
  }

  const removeCompanion = (id: string) => {
    setEditing((prev) =>
      prev ? { ...prev, companions: prev.companions.filter((c) => c.id !== id) } : prev,
    )
  }

  const save = () => {
    if (!editing) return
    if (!editing.firstName.trim() || !editing.lastName.trim()) {
      setError('Completá nombre y apellido')
      return
    }
    if (!editing.email.trim() || !editing.email.includes('@')) {
      setError('Ingresá un email válido')
      return
    }
    const cleaned: GuestConfirmation = {
      ...editing,
      firstName: editing.firstName.trim(),
      lastName: editing.lastName.trim(),
      email: editing.email.trim(),
      companions: editing.companions.filter((c) => c.firstName.trim()),
    }
    onChange(upsertRsvp(eventId, cleaned))
    setEditing(null)
    setError(null)
  }

  const remove = (guestId: string) => {
    onChange(deleteRsvp(eventId, guestId))
    if (editing?.id === guestId) cancel()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {t('guestlisteditor.lista_de_invitados')}
          </h3>
          <p className="mt-0.5 text-sm text-slate-500">
            {guests.length} {t('guestlisteditor.confirmaciones')}{' '}
            {guests.reduce((n, g) => n + 1 + g.companions.length, 0)}{' '}
            {t('guestlisteditor.personas')}
          </p>
        </div>
        {!editing && (
          <button type="button" onClick={startCreate} className="dash-btn-primary py-2 text-sm">
            <Plus className="h-3.5 w-3.5" />
            {t('guestlisteditor.agregar')}
          </button>
        )}
      </div>

      {editing && (
        <div className="space-y-3 rounded-xl border border-primary/20 bg-primary/[0.03] p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">
              {guests.some((g) => g.id === editing.id) ? 'Editar invitado' : 'Nuevo invitado'}
            </p>
            <button
              type="button"
              onClick={cancel}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={editing.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              placeholder={t('guestlisteditor.nombre')}
              className="input-field"
            />
            <input
              type="text"
              value={editing.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              placeholder={t('guestlisteditor.apellido')}
              className="input-field"
            />
          </div>
          <input
            type="email"
            value={editing.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder={t('guestlisteditor.email')}
            className="input-field"
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500">
                {t('guestlisteditor.acompaantes')}
              </p>
              <button type="button" onClick={addCompanion} className="btn-ghost py-1 text-xs">
                <Plus className="h-3 w-3" />
                {t('guestlisteditor.agregar')}
              </button>
            </div>
            {editing.companions.map((c) => (
              <div key={c.id} className="flex gap-2">
                <input
                  type="text"
                  value={c.firstName}
                  onChange={(e) => updateCompanion(c.id, { firstName: e.target.value })}
                  placeholder={t('guestlisteditor.nombre')}
                  className="input-field"
                />
                <input
                  type="text"
                  value={c.lastName}
                  onChange={(e) => updateCompanion(c.id, { lastName: e.target.value })}
                  placeholder={t('guestlisteditor.apellido')}
                  className="input-field"
                />
                <button
                  type="button"
                  onClick={() => removeCompanion(c.id)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={cancel} className="dash-btn-secondary py-2 text-sm">
              {t('guestlisteditor.cancelar')}
            </button>
            <button type="button" onClick={save} className="dash-btn-primary py-2 text-sm">
              <Check className="h-3.5 w-3.5" />
              {t('guestlisteditor.guardar')}
            </button>
          </div>
        </div>
      )}

      {guests.length === 0 && !editing ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
          {t('guestlisteditor.todava_no_hay_invitados_agreg_el_primero')}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">{t('guestlisteditor.invitado')}</th>
                  <th className="px-4 py-3">{t('guestlisteditor.contacto')}</th>
                  <th className="px-4 py-3">{t('guestlisteditor.acompaantes')}</th>
                  <th className="px-4 py-3">{t('guestlisteditor.qr')}</th>
                  <th className="px-4 py-3">{t('guestlisteditor.confirm')}</th>
                  <th className="px-4 py-3 text-right">{t('guestlisteditor.acciones')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {guests.map((guest) => (
                  <tr key={guest.id} className="align-top">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {guest.firstName} {guest.lastName}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{guest.email}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {guest.companions.length === 0 ? (
                        <span className="text-slate-400">—</span>
                      ) : (
                        <ul className="space-y-0.5">
                          {guest.companions.map((c) => (
                            <li key={c.id}>
                              {c.firstName} {c.lastName}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-700">
                        {guest.qrCode}
                      </code>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                      {formatConfirmedAt(guest.confirmedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(guest)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-primary/5 hover:text-primary"
                          aria-label="Editar invitado"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(guest.id)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                          aria-label="Eliminar invitado"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
