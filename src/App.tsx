import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { PageTransition } from './components/layout/PageTransition'
import AgendaSettingsPage from './pages/AgendaSettingsPage'
import CheckinPage from './pages/CheckinPage'
import EmployeesPage from './pages/EmployeesPage'
import EmployeeDetailPage from './pages/EmployeeDetailPage'
import EmployeeEventsPage from './pages/EmployeeEventsPage'
import EmployeeProfilePage from './pages/EmployeeProfilePage'
import DashboardPage from './pages/DashboardPage'
import InvitationEditorPage from './pages/InvitationEditorPage'
import InvitationGuestPage from './pages/InvitationGuestPage'
import InvitationsPage from './pages/InvitationsPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import MarketplaceSalonPage from './pages/MarketplaceSalonPage'
import MessagingPage from './pages/MessagingPage'
import ReportsPage from './pages/ReportsPage'
import SalonProfilePage from './pages/SalonProfilePage'

const routes = [
  { path: '/', element: <LandingPage /> },
  { path: '/marketplace', element: <MarketplaceSalonPage /> },
  { path: '/inv/:eventId', element: <InvitationGuestPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/dashboard/invitaciones', element: <InvitationsPage /> },
  { path: '/dashboard/invitaciones/:eventId', element: <InvitationEditorPage /> },
  { path: '/dashboard/reportes', element: <ReportsPage /> },
  { path: '/dashboard/checkin', element: <CheckinPage /> },
  { path: '/dashboard/mensajeria', element: <MessagingPage /> },
  { path: '/dashboard/perfil', element: <SalonProfilePage /> },
  { path: '/dashboard/agenda', element: <AgendaSettingsPage /> },
  { path: '/dashboard/empleados/:employeeId', element: <EmployeeDetailPage /> },
  { path: '/dashboard/empleados', element: <EmployeesPage /> },
  { path: '/dashboard/mi-perfil', element: <EmployeeProfilePage /> },
  { path: '/dashboard/mis-eventos', element: <EmployeeEventsPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
]

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={<PageTransition>{element}</PageTransition>} />
        ))}
      </Routes>
    </AnimatePresence>
  )
}
