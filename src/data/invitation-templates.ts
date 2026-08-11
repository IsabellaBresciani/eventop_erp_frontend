import type { InvitationConfig, InvitationTemplate } from '../types/invitation'

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
    eventDate,
    eventTime,
    venue,
    musicTrack: 'none',
    countdownEnabled: true,
    publicUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/inv/${eventId}`,
  }
}
