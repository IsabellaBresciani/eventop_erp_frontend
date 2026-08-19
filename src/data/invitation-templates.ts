import type { InvitationConfig, InvitationTemplate, InvitationTexture } from '../types/invitation'
import { absoluteAppUrl } from '../lib/app-url'

export interface FontOption {
  id: string
  label: string
  stack: string
}

export const FONT_OPTIONS: FontOption[] = [
  { id: 'Libre Caslon Text', label: 'Libre Caslon Text', stack: "'Libre Caslon Text', 'Playfair Display', serif" },
  { id: 'Playfair Display', label: 'Playfair Display', stack: "'Playfair Display', serif" },
  { id: 'Inter', label: 'Inter (moderna)', stack: "Inter, system-ui, sans-serif" },
]

export interface TextColorSwatch {
  id: string
  label: string
  value: string
}

export const TEXT_COLOR_SWATCHES: TextColorSwatch[] = [
  { id: 'black', label: 'Negro', value: '#111827' },
  { id: 'olive', label: 'Oliva', value: '#556B2F' },
  { id: 'navy', label: 'Azul noche', value: '#1E3A5F' },
  { id: 'pink', label: 'Rosa', value: '#BE185D' },
]

export interface TextureOption {
  id: InvitationTexture
  label: string
  swatchClass: string
  backgroundStyle: string
}

export const TEXTURES: TextureOption[] = [
  {
    id: 'algodon',
    label: 'Algodón',
    swatchClass: 'bg-[#f6f1e7]',
    backgroundStyle:
      "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.6) 0, transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.4) 0, transparent 45%), linear-gradient(135deg, #f8f3e8 0%, #f1ead9 50%, #f7f1e4 100%)",
  },
  {
    id: 'terciopelo',
    label: 'Terciopelo',
    swatchClass: 'bg-[#3b1730]',
    backgroundStyle:
      "radial-gradient(circle at 30% 10%, rgba(255,255,255,0.08) 0, transparent 40%), linear-gradient(160deg, #3b1730 0%, #2a0f24 55%, #1c0a18 100%)",
  },
  {
    id: 'marmol',
    label: 'Mármol',
    swatchClass: 'bg-[#eceef1]',
    backgroundStyle:
      "linear-gradient(120deg, rgba(120,130,150,0.18) 0%, transparent 18%, transparent 35%, rgba(120,130,150,0.12) 42%, transparent 60%, rgba(120,130,150,0.15) 75%, transparent 90%), linear-gradient(200deg, #f4f5f7 0%, #e7e9ed 50%, #eef0f3 100%)",
  },
  {
    id: 'custom',
    label: 'Imagen propia',
    swatchClass: 'bg-slate-100',
    backgroundStyle: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
  },
]

export interface DynamicFieldChip {
  id: string
  label: string
  token: string
}

export const DYNAMIC_FIELDS: DynamicFieldChip[] = [
  { id: 'fecha', label: 'Fecha del Evento', token: '{{fecha_evento}}' },
  { id: 'hora', label: 'Hora de Inicio', token: '{{hora_inicio}}' },
  { id: 'lugar', label: 'Ubicación del Salón', token: '{{ubicacion_salon}}' },
]

export const INVITATION_TEMPLATES: InvitationTemplate[] = [
  {
    id: 'boda',
    name: 'Boda',
    description: 'Elegante y romántico',
    previewGradient: 'from-rose-100 via-white to-amber-50',
    accentColor: '#be185d',
    fontStyle: 'elegant',
    defaultCover: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
  },
  {
    id: 'infantil',
    name: 'Infantil',
    description: 'Colorido y divertido',
    previewGradient: 'from-sky-100 via-yellow-50 to-pink-100',
    accentColor: '#0ea5e9',
    fontStyle: 'playful',
    defaultCover: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop',
  },
  {
    id: 'xv',
    name: 'XV Años',
    description: 'Glamour y sofisticación',
    previewGradient: 'from-secondary via-primary-50 to-white',
    accentColor: '#6A24E3',
    fontStyle: 'glamour',
    defaultCover: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop',
  },
  {
    id: 'corporativo',
    name: 'Corporativo',
    description: 'Profesional y limpio',
    previewGradient: 'from-slate-100 via-white to-blue-50',
    accentColor: '#1e40af',
    fontStyle: 'minimal',
    defaultCover: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
  },
]

export function getTemplate(id: InvitationConfig['templateId']): InvitationTemplate {
  return INVITATION_TEMPLATES.find((t) => t.id === id) ?? INVITATION_TEMPLATES[0]
}

export function buildDefaultConfig(
  eventId: string,
  eventTitle: string,
  eventDate: string,
  eventTime: string,
  venue: string,
  templateId: InvitationConfig['templateId'] = 'boda',
): InvitationConfig {
  const template = getTemplate(templateId)
  return {
    eventId,
    templateId,
    coverUrl: template.defaultCover,
    eventTitle,
    hostNames: '',
    invitationMessage: 'Tenemos el honor de invitarle a la celebración de',
    eventDate,
    eventTime,
    venue,
    venueAddress: '',
    musicTrack: 'none',
    countdownEnabled: true,
    publicUrl: absoluteAppUrl(`/inv/${eventId}`),
    fontFamily: 'Libre Caslon Text',
    textAlign: 'center',
    textBold: false,
    textItalic: false,
    textUnderline: false,
    textColor: '#111827',
    texture: 'algodon',
    customTextureUrl: null,
    rsvpDeadline: eventDate,
    allowPlusOnes: true,
    maxCompanions: 2,
  }
}
