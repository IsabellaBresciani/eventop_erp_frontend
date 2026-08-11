import type { ManagedSalon } from '../types/auth'

/** Salones demo asociados al admin */
export const DEMO_ADMIN_SALONS: ManagedSalon[] = [
  {
    id: 'salon-olivos',
    name: 'Quinta Los Olivos',
    location: 'Vicente López',
    accent: '#6A24E3',
  },
  {
    id: 'salon-palermo',
    name: 'Salón Palermo Norte',
    location: 'Palermo',
    accent: '#EA580C',
  },
  {
    id: 'salon-pilar',
    name: 'Espacio Pilar Garden',
    location: 'Pilar',
    accent: '#0F766E',
  },
]

export function getSalonInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}
