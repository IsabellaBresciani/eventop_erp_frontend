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

export type InvitationTextAlign = 'left' | 'center' | 'right'

export type InvitationTexture = 'algodon' | 'terciopelo' | 'marmol' | 'custom'

export interface InvitationConfig {
  eventId: string
  templateId: InvitationTemplateId
  coverUrl: string
  eventTitle: string
  hostNames: string
  invitationMessage: string
  eventDate: string
  eventTime: string
  venue: string
  venueAddress: string
  musicTrack: string
  countdownEnabled: boolean
  publicUrl: string
  // Diseño (RF-203 hi-fi editor)
  fontFamily: string
  textAlign: InvitationTextAlign
  textBold: boolean
  textItalic: boolean
  textUnderline: boolean
  textColor: string
  texture: InvitationTexture
  customTextureUrl: string | null
  // Ajustes
  rsvpDeadline: string
  allowPlusOnes: boolean
  maxCompanions: number
}

export const MUSIC_TRACKS = [
  { id: 'none', label: 'Sin música' },
  { id: 'romantic', label: 'Romántica suave' },
  { id: 'celebration', label: 'Celebración' },
  { id: 'kids', label: 'Infantil alegre' },
  { id: 'elegant', label: 'Elegante instrumental' },
]
