export type InvitationTemplateId = 'boda' | 'infantil' | 'xv' | 'corporativo'

export interface InvitationTemplate {
  id: InvitationTemplateId
  name: string
  description: string
  previewGradient: string
  accentColor: string
  fontStyle: 'elegant' | 'playful' | 'glamour' | 'minimal'
  defaultCover: string
}

export interface InvitationConfig {
  eventId: string
  templateId: InvitationTemplateId
  coverUrl: string
  eventTitle: string
  eventDate: string
  eventTime: string
  venue: string
  musicTrack: string
  countdownEnabled: boolean
  publicUrl: string
}

export const MUSIC_TRACKS = [
  { id: 'none', label: 'Sin música' },
  { id: 'romantic', label: 'Romántica suave' },
  { id: 'celebration', label: 'Celebración' },
  { id: 'kids', label: 'Infantil alegre' },
  { id: 'elegant', label: 'Elegante instrumental' },
]
