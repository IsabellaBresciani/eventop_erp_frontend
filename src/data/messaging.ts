import type { Inquiry } from '../types/messaging'

export const INQUIRY_STATUS_CONFIG = {
  nueva: { label: 'Nueva', color: '#6A24E3', bg: 'bg-primary/10', text: 'text-primary' },
  leida: { label: 'Leída', color: '#64748b', bg: 'bg-slate-100', text: 'text-slate-600' },
  en_seguimiento: {
    label: 'En seguimiento',
    color: '#F5C518',
    bg: 'bg-gold/15',
    text: 'text-gold-800',
  },
  respondida: {
    label: 'Respondida',
    color: '#10b981',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  archivada: {
    label: 'Archivada',
    color: '#94a3b8',
    bg: 'bg-slate-50',
    text: 'text-slate-500',
  },
} as const

export const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-001',
    clientName: 'Florencia Acosta',
    email: 'florencia.acosta@email.com',
    phone: '+54 11 5566-7788',
    eventType: 'Boda',
    eventDate: '2026-10-15',
    guests: 120,
    status: 'nueva',
    source: 'marketplace',
    preview: '¿Tienen grupo electrógeno? Necesito confirmar para 120 invitados.',
    message:
      'Hola! Estoy buscando salón para mi boda el 15 de octubre. Somos 120 invitados.\n\n¿Tienen grupo electrógeno? Necesito confirmar para 120 invitados. También me interesa saber si incluyen decoración básica.',
    receivedAt: '2026-08-04T14:15:00',
    lastActivity: 'Hace 12 min',
    estimatedBudget: 920000,
  },
  {
    id: 'inq-002',
    clientName: 'Diego Romero',
    email: 'diego.romero@corp.com',
    phone: '+54 11 3344-9901',
    eventType: 'Corporativo',
    eventDate: '2026-09-20',
    guests: 80,
    status: 'en_seguimiento',
    source: 'email',
    preview: 'Necesitamos salón para evento corporativo con proyector y coffee break.',
    message:
      'Buenos días. Necesitamos un salón para evento corporativo el 20 de septiembre, 80 personas, con proyector y coffee break.\n\n¿Podrían enviarnos disponibilidad y un presupuesto formal?',
    receivedAt: '2026-08-03T09:00:00',
    lastActivity: 'Hace 2 horas',
    estimatedBudget: 480000,
  },
  {
    id: 'inq-003',
    clientName: 'Sofía Benítez',
    email: 'sofia.b@email.com',
    phone: '+54 351 4422-1100',
    eventType: 'XV Años',
    eventDate: '2026-11-08',
    guests: 100,
    status: 'respondida',
    source: 'whatsapp',
    preview: 'Quiero cotizar XV años para 100 invitados en noviembre.',
    message:
      'Hola, quiero cotizar XV años para 100 invitados en noviembre (8/11). ¿Tienen paquetes con DJ y candy bar incluidos?',
    receivedAt: '2026-08-01T16:00:00',
    lastActivity: 'Ayer',
    estimatedBudget: 720000,
  },
  {
    id: 'inq-004',
    clientName: 'Pablo Méndez',
    email: 'pablo.mendez@email.com',
    phone: '+54 11 8877-6655',
    eventType: 'Cumpleaños Infantil',
    eventDate: '2026-08-30',
    guests: 45,
    status: 'nueva',
    source: 'marketplace',
    preview: '¿Hay estacionamiento? ¿Cuánto sale el paquete infantil?',
    message:
      'Hola, estoy armando el cumpleaños de mi hijo para el 30 de agosto (45 niños aprox).\n\n¿Hay estacionamiento? ¿Cuánto sale el paquete infantil? ¿Incluyen animación?',
    receivedAt: '2026-08-04T13:50:00',
    lastActivity: 'Hace 45 min',
    estimatedBudget: 320000,
  },
  {
    id: 'inq-005',
    clientName: 'Empresa Logística Sur',
    email: 'eventos@logsur.com',
    phone: '+54 11 2233-4400',
    eventType: 'Corporativo',
    eventDate: '2026-12-05',
    guests: 150,
    status: 'leida',
    source: 'web',
    preview: 'Necesitamos confirmar si el salón tiene Wi-Fi de alta velocidad.',
    message:
      'Estamos evaluando sedes para nuestra fiesta de fin de año (5 de diciembre, ~150 personas).\n\nNecesitamos confirmar si el salón tiene Wi-Fi de alta velocidad y espacios para stands de sponsors.',
    receivedAt: '2026-08-04T11:00:00',
    lastActivity: 'Hace 3 horas',
    estimatedBudget: 650000,
  },
  {
    id: 'inq-006',
    clientName: 'María Eugenia López',
    email: 'meugenia.lopez@email.com',
    phone: '+54 11 6677-8899',
    eventType: 'Aniversario',
    eventDate: '2026-07-12',
    guests: 60,
    status: 'archivada',
    source: 'email',
    preview: 'Consulta por aniversario — fecha ya pasó / no concretó.',
    message:
      'Hola, quería consultar por un aniversario de 60 invitados. Al final no pudimos concretar por temas de fecha.',
    receivedAt: '2026-06-20T10:00:00',
    lastActivity: 'Hace 3 semanas',
    estimatedBudget: 410000,
  },
]

/** Digits only for wa.me links (Argentina: keep country code). */
export function phoneToWhatsAppDigits(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('54')) return digits
  if (digits.startsWith('0')) return `54${digits.slice(1)}`
  return digits
}

export function buildWhatsAppUrl(phone: string, text: string): string {
  const digits = phoneToWhatsAppDigits(phone)
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}

export function buildMailtoUrl(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function defaultReplyDraft(inquiry: Inquiry): string {
  return `Hola ${inquiry.clientName.split(' ')[0]}, gracias por tu consulta sobre ${inquiry.eventType.toLowerCase()} para el ${formatInquiryDate(inquiry.eventDate)} (${inquiry.guests} invitados). `
}

export function formatInquiryDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
