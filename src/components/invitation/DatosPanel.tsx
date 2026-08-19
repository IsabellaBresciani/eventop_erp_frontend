import { Upload } from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import type { InvitationConfig } from '../../types/invitation'
import { MUSIC_TRACKS } from '../../types/invitation'

interface DatosPanelProps {
  config: InvitationConfig
  onChange: (patch: Partial<InvitationConfig>) => void
}

export function DatosPanel({ config, onChange }: DatosPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleCoverUpload = (files: FileList | null) => {
    if (!files?.[0]) return
    onChange({ coverUrl: URL.createObjectURL(files[0]) })
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Foto de portada
        </label>
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
          className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 transition-colors hover:bg-primary/10"
        >
          <div className="h-16 w-24 overflow-hidden rounded-lg bg-slate-100">
            <img src={config.coverUrl} alt="" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
              <Upload className="h-4 w-4 text-primary" />
              Cambiar portada
            </p>
            <p className="mt-0.5 text-xs text-slate-500">JPG o PNG</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleCoverUpload(e.target.files)}
          />
        </div>
      </div>

      <Field label="Título del evento">
        <input
          type="text"
          value={config.eventTitle}
          onChange={(e) => onChange({ eventTitle: e.target.value })}
          className="input-field"
        />
      </Field>

      <Field label="Nombres de anfitriones" hint="Se muestra en tipografía script sobre la invitación">
        <input
          type="text"
          value={config.hostNames}
          onChange={(e) => onChange({ hostNames: e.target.value })}
          placeholder="Ej: Valentina & Martín"
          className="input-field"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Fecha">
          <input
            type="date"
            value={config.eventDate}
            onChange={(e) => onChange({ eventDate: e.target.value })}
            className="input-field"
          />
        </Field>
        <Field label="Horario">
          <input
            type="text"
            value={config.eventTime}
            onChange={(e) => onChange({ eventTime: e.target.value })}
            className="input-field"
            placeholder="21:00 hrs"
          />
        </Field>
      </div>

      <Field label="Lugar">
        <input
          type="text"
          value={config.venue}
          onChange={(e) => onChange({ venue: e.target.value })}
          className="input-field"
        />
      </Field>

      <Field label="Dirección">
        <input
          type="text"
          value={config.venueAddress}
          onChange={(e) => onChange({ venueAddress: e.target.value })}
          placeholder="Av. Libertador 1234, Ciudad"
          className="input-field"
        />
      </Field>

      <Field label="Música de fondo">
        <select
          value={config.musicTrack}
          onChange={(e) => onChange({ musicTrack: e.target.value })}
          className="input-field"
        >
          {MUSIC_TRACKS.map((track) => (
            <option key={track.id} value={track.id}>
              {track.label}
            </option>
          ))}
        </select>
      </Field>
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
    </div>
  )
}
