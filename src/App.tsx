import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { PageTransition } from './components/layout/PageTransition'
import AccountSettingsPage from './pages/AccountSettingsPage'
import AgendaCalendarPage from './pages/AgendaCalendarPage'
import AgendaSettingsPage from './pages/AgendaSettingsPage'
import CheckinPage from './pages/CheckinPage'
import FavoriteVenuesPage from './pages/FavoriteVenuesPage'
import GuestCapacityRequestPage from './pages/GuestCapacityRequestPage'
import InvitationEmailPreviewPage from './pages/InvitationEmailPreviewPage'
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
import MarketplaceCatalogPage from './pages/MarketplaceCatalogPage'
import MarketplaceLandingPage from './pages/MarketplaceLandingPage'
import MarketplaceHostRegisterPage, {
  MarketplaceHostDashboardPage,
  MarketplaceHostLoginPage,
} from './pages/MarketplaceHostPages'
import MarketplaceSalonPage from './pages/MarketplaceSalonPage'
import MessagingPage from './pages/MessagingPage'
import ReportsPage from './pages/ReportsPage'
import SalonProfilePage from './pages/SalonProfilePage'
import CreateEventPage from './pages/CreateEventPage'

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <LandingPage />
            </PageTransition>
          }
        />
        <Route
          path="/marketplace"
          element={
            <PageTransition>
              <MarketplaceLandingPage />
            </PageTransition>
          }
        />
        <Route
          path="/marketplace/salones"
          element={
            <PageTransition>
              <MarketplaceCatalogPage />
            </PageTransition>
          }
        />
        <Route
          path="/marketplace/salones/:salonId"
          element={
            <PageTransition>
              <MarketplaceSalonPage />
            </PageTransition>
          }
        />
        <Route
          path="/marketplace/registro"
          element={
            <PageTransition>
              <MarketplaceHostRegisterPage />
            </PageTransition>
          }
        />
        <Route
          path="/marketplace/ingresar"
          element={
            <PageTransition>
              <MarketplaceHostLoginPage />
            </PageTransition>
          }
        />
        <Route
          path="/marketplace/cuenta"
          element={
            <PageTransition>
              <MarketplaceHostDashboardPage />
            </PageTransition>
          }
        />
        <Route
          path="/inv/:eventId"
          element={
            <PageTransition>
              <InvitationGuestPage />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <LoginPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/invitaciones"
          element={
            <PageTransition>
              <InvitationsPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/invitaciones/:eventId"
          element={
            <PageTransition>
              <InvitationEditorPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/invitaciones/:eventId/ampliar-cupo"
          element={
            <PageTransition>
              <GuestCapacityRequestPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/invitaciones/:eventId/email-preview"
          element={
            <PageTransition>
              <InvitationEmailPreviewPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/salones-favoritos"
          element={
            <PageTransition>
              <FavoriteVenuesPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/ajustes-cuenta"
          element={
            <PageTransition>
              <AccountSettingsPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/agenda/vista"
          element={
            <PageTransition>
              <AgendaCalendarPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/reportes"
          element={
            <PageTransition>
              <ReportsPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/checkin"
          element={
            <PageTransition>
              <CheckinPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/mensajeria"
          element={
            <PageTransition>
              <MessagingPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/perfil"
          element={
            <PageTransition>
              <SalonProfilePage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/agenda"
          element={
            <PageTransition>
              <AgendaSettingsPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/empleados/:employeeId"
          element={
            <PageTransition>
              <EmployeeDetailPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/empleados"
          element={
            <PageTransition>
              <EmployeesPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/mi-perfil"
          element={
            <PageTransition>
              <EmployeeProfilePage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/mis-eventos"
          element={
            <PageTransition>
              <EmployeeEventsPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard/eventos/nuevo"
          element={
            <PageTransition>
              <CreateEventPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageTransition>
              <DashboardPage />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}
