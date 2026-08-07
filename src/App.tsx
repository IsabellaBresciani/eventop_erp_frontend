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
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import MarketplaceSalonPage from './pages/MarketplaceSalonPage'
import MessagingPage from './pages/MessagingPage'
import SalonProfilePage from './pages/SalonProfilePage'

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
              <MarketplaceSalonPage />
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
              <InvitationEditorPage />
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
