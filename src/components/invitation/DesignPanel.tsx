import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  GripVertical,
  Italic,
  Plus,
  Underline,
  Upload,
} from 'lucide-react'
import { useRef, useState } from 'react'
import {
  DYNAMIC_FIELDS,
  FONT_OPTIONS,
  TEXT_COLOR_SWATCHES,
  TEXTURES,
} from '../../data/invitation-templates'
import type { InvitationConfig, InvitationTextAlign, InvitationTexture } from '../../types/invitation'

interface DesignPanelProps {
  config: InvitationConfig
  onChange: (patch: Partial<InvitationConfig>) => void
}

export function DesignPanel({ config, onChange }: DesignPanelProps) {
  const textureFileRef = useRef<HTMLInputElement>(null)
  const [customColor, setCustomColor] = useState(config.textColor)

  const insertToken = (token: string) => {
    const separator = config.invitationMessage.trim().length ? ' ' : ''
    onChange({ invitationMessage: `${config.invitationMessage}${separator}${token}` })
  }

  const handleTextureUpload = (files: FileList | null) => {
    if (!files?.[0]) return
    onChange({ texture: 'custom', customTextureUrl: URL.createObjectURL(files[0]) })
  }

  return (
    <div className="space-y-6">
      {/* Tipografía */}
      <section>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Tipografía
        </p>

        <div className="space-y-3">
          <select
            value={config.fontFamily}
            onChange={(e) => onChange({ fontFamily: e.target.value })}
            className="input-field"
            style={{ fontFamily: config.fontFamily }}
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font.id} value={font.id} style={{ fontFamily: font.stack }}>
                {font.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-lg border border-surface-border">
              {(
                [
                  { id: 'left', icon: AlignLeft },
                  { id: 'center', icon: AlignCenter },
                  { id: 'right', icon: AlignRight },
                ] as { id: InvitationTextAlign; icon: typeof AlignLeft }[]
              ).map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChange({ textAlign: id })}
                  aria-label={`Alinear ${id}`}
                  className={`px-2.5 py-2 transition-colors ${
                    config.textAlign === id
                      ? 'bg-primary text-white'
                      : 'bg-white text-slate-400 hover:bg-primary/5 hover:text-primary'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>

            <div className="flex overflow-hidden rounded-lg border border-surface-border">
              <ToggleIconButton
                active={config.textBold}
                onClick={() => onChange({ textBold: !config.textBold })}
                icon={Bold}
                label="Negrita"
              />
              <ToggleIconButton
                active={config.textItalic}
                onClick={() => onChange({ textItalic: !config.textItalic })}
                icon={Italic}
                label="Cursiva"
              />
              <ToggleIconButton
                active={config.textUnderline}
                onClick={() => onChange({ textUnderline: !config.textUnderline })}
                icon={Underline}
                label="Subrayado"
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold text-slate-500">Color de Texto</p>
            <div className="flex flex-wrap items-center gap-2">
              {TEXT_COLOR_SWATCHES.map((swatch) => {
                const isActive = config.textColor.toLowerCase() === swatch.value.toLowerCase()
                return (
                  <button
                    key={swatch.id}
                    type="button"
                    onClick={() => onChange({ textColor: swatch.value })}
                    aria-label={swatch.label}
                    title={swatch.label}
                    className={`flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-offset-2 transition-all ${
                      isActive ? 'ring-primary' : 'ring-transparent'
                    }`}
                    style={{ backgroundColor: swatch.value }}
                  >
                    {isActive && <Check className="h-3.5 w-3.5 text-white" />}
                  </button>
                )
              })}

              <label
                className="relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-slate-300 text-slate-400 hover:border-primary hover:text-primary"
                title="Agregar color"
              >
                <Plus className="h-3.5 w-3.5" />
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value)
                    onChange({ textColor: e.target.value })
                  }}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Fondo & Textura */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Fondo &amp; Textura
          </p>
          <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold-800">
            Premium
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {TEXTURES.filter((t) => t.id !== 'custom').map((texture) => {
            const isSelected = config.texture === texture.id
            return (
              <button
                key={texture.id}
                type="button"
                onClick={() => onChange({ texture: texture.id as InvitationTexture })}
                className={`group relative overflow-hidden rounded-xl border-2 text-left transition-all ${
                  isSelected ? 'border-primary shadow-glow' : 'border-surface-border hover:border-primary/30'
                }`}
              >
                <div
                  className="h-14 w-full"
                  style={{ backgroundImage: texture.backgroundStyle, backgroundSize: 'cover' }}
                />
                {isSelected && (
                  <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
                    <Check className="h-2.5 w-2.5" />
                  </div>
                )}
                <p className="bg-white px-2 py-1 text-[10px] font-semibold text-slate-700">
                  {texture.label}
                </p>
              </button>
            )
          })}

          <button
            type="button"
            onClick={() => textureFileRef.current?.click()}
            className={`flex h-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed p-2 text-center transition-colors ${
              config.texture === 'custom'
                ? 'border-primary bg-primary/5'
                : 'border-slate-300 hover:border-primary/40 hover:bg-primary/5'
            }`}
          >
            <Upload className="h-4 w-4 text-primary" />
            <span className="text-[9px] font-semibold text-slate-600">Subir Imagen</span>
            <input
              ref={textureFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleTextureUpload(e.target.files)}
            />
          </button>
        </div>
      </section>

      {/* Campos Dinámicos */}
      <section>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Campos Dinámicos
        </p>
        <p className="mb-3 text-[11px] text-slate-500">
          Arrastrá o hacé click para insertar en el texto de la invitación
        </p>

        <div className="space-y-2">
          {DYNAMIC_FIELDS.map((field) => (
            <div
              key={field.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', field.token)}
              onClick={() => insertToken(field.token)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && insertToken(field.token)}
              className="flex cursor-grab items-center gap-2 rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5 active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 shrink-0 text-slate-300" />
              {field.label}
            </div>
          ))}
        </div>

        <label
          htmlFor="inv-message"
          className="mb-1.5 mt-4 block text-[11px] font-semibold text-slate-500"
        >
          Texto de la invitación
        </label>
        <textarea
          id="inv-message"
          value={config.invitationMessage}
          onChange={(e) => onChange({ invitationMessage: e.target.value })}
          onDrop={(e) => {
            e.preventDefault()
            const token = e.dataTransfer.getData('text/plain')
            if (token) insertToken(token)
          }}
          onDragOver={(e) => e.preventDefault()}
          rows={3}
          className="input-field resize-none text-sm"
        />
      </section>
    </div>
  )
}

function ToggleIconButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: typeof Bold
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`px-2.5 py-2 transition-colors ${
        active ? 'bg-primary text-white' : 'bg-white text-slate-400 hover:bg-primary/5 hover:text-primary'
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  )
}
