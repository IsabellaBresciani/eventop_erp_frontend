# EvenTop ERP Frontend

Landing page y aplicación frontend del ecosistema EvenTop para gestión de salones de eventos.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion (animaciones de scroll)
- Lucide React (iconografía)

## Desarrollo

```bash
npm install
npm run dev
```

## Pantallas

- **Pantalla 1** — Landing Page pública (`/`)
- **Pantalla 2** — Login de usuarios (`/login`)
- **Pantalla 3** — Dashboard Home (`/dashboard`) — Centro de mando operativo
- **Pantalla 4** — Configuración Avanzada de Agenda (`/dashboard/agenda`) — RF-003
- **Pantalla 5** — Gestión del Perfil del Salón (`/dashboard/perfil`) — RF-001
- **Pantalla 6** — Ficha de Auditoría de Evento (slide-over en Dashboard) — RF-005, RF-007, RF-012
- **Pantalla 7** — Editor de Invitaciones Virtuales (`/dashboard/invitaciones`) — RF-201, RF-202, RF-203
- **Pantalla 8** — Landing de Invitación pública (`/inv/:eventId`) — RF-205, RF-206, RF-207, RF-208
- **Pantalla 9** — Marketplace Perfil Público (`/marketplace`) — RF-001, RF-004, RF-008
- **Pantalla 10** — Central de Mensajería y Presupuestos (`/dashboard/mensajeria`) — RF-006
- **Pantalla 11** — Check-in con QR (`/dashboard/checkin`) — RF-214

### Credenciales demo (Login)

| Campo | Valor |
|-------|-------|
| Email | `admin@eventop.com` |
| Contraseña | `eventop2024` |

## Design System

| Token | Valor |
|-------|-------|
| Primario | `#5e17eb` |
| Fondo | `#f4f7fe` |
| Borde | `#e0e7ff` |
| Radio tarjetas | `24px` |
| Tipografía | Inter |
