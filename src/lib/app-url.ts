/** Vite base URL, e.g. `/` locally or `/eventop_erp_frontend/` on GitHub Pages. */
export const APP_BASE = import.meta.env.BASE_URL

/** Basename for React Router (no trailing slash). */
export const ROUTER_BASENAME = APP_BASE.replace(/\/$/, '') || undefined

/** In-app path including deploy base (for hard redirects). */
export function withBasePath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const base = ROUTER_BASENAME
  if (!base) return normalized
  return `${base}${normalized}`
}

/** Asset from `/public`, e.g. videos and favicons. */
export function publicAsset(path: string): string {
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${APP_BASE}${clean}`
}

/** Shareable absolute URL (invitations, comparativas, etc.). */
export function absoluteAppUrl(path: string): string {
  const relative = withBasePath(path)
  if (typeof window === 'undefined') return relative
  return `${window.location.origin}${relative}`
}
