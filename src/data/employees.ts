import type { CalendarEvent } from '../types/dashboard'
import type { Employee, EmployeeFormData, EmployeeMonthlyStat } from '../types/employees'

const STORAGE_KEY = 'eventop_employees'

export const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    firstName: 'Lucía',
    lastName: 'Fernández',
    dni: '32456789',
    email: 'lucia.fernandez@eventop.com',
    phone: '+54 11 4521-8890',
    active: true,
    createdAt: '2026-06-10T10:00:00.000Z',
    invitedAt: '2026-06-10T10:00:00.000Z',
    tempPassword: 'emp3245',
  },
  {
    id: 'emp-002',
    firstName: 'Martín',
    lastName: 'Acosta',
    dni: '30123456',
    email: 'martin.acosta@eventop.com',
    phone: '+54 11 4789-2234',
    active: true,
    createdAt: '2026-07-02T14:30:00.000Z',
    invitedAt: '2026-07-02T14:30:00.000Z',
    tempPassword: 'emp3012',
  },
]

export function loadEmployees(): Employee[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as Employee[]
  } catch {
    /* use defaults */
  }
  return DEFAULT_EMPLOYEES
}

export function saveEmployees(employees: Employee[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees))
}

export function getEmployeeFullName(employee: Employee): string {
  return `${employee.firstName} ${employee.lastName}`
}

function generateTempPassword(dni: string): string {
  return `emp${dni.slice(-4)}`
}

export function createEmployee(data: EmployeeFormData): Employee {
  const employee: Employee = {
    id: `emp-${Date.now()}`,
    ...data,
    active: true,
    createdAt: new Date().toISOString(),
    invitedAt: new Date().toISOString(),
    tempPassword: generateTempPassword(data.dni),
  }

  const employees = loadEmployees()
  saveEmployees([...employees, employee])
  return employee
}

export function updateEmployee(id: string, patch: Partial<EmployeeFormData> & { active?: boolean }): Employee | null {
  const employees = loadEmployees()
  const index = employees.findIndex((e) => e.id === id)
  if (index === -1) return null

  const updated: Employee = {
    ...employees[index],
    ...patch,
    tempPassword:
      patch.dni !== undefined
        ? generateTempPassword(patch.dni)
        : employees[index].tempPassword,
  }
  employees[index] = updated
  saveEmployees(employees)
  return updated
}

export function deleteEmployee(id: string): void {
  saveEmployees(loadEmployees().filter((e) => e.id !== id))
}

export function findEmployeeByEmail(email: string): Employee | undefined {
  return loadEmployees().find(
    (e) => e.email.toLowerCase() === email.toLowerCase() && e.active,
  )
}

export function authenticateEmployee(email: string, password: string): Employee | null {
  const employee = findEmployeeByEmail(email)
  if (!employee || employee.tempPassword !== password) return null
  return employee
}

/** Simula el envío del email de invitación al empleado */
export function sendEmployeeInviteEmail(employee: Employee): void {
  console.info(
    `[EvenTop] Email de invitación enviado a ${employee.email} — contraseña temporal: ${employee.tempPassword}`,
  )
}

export function getEmployeeMonthlyStats(
  events: CalendarEvent[],
  employees: Employee[],
  year: number,
  month: number,
): EmployeeMonthlyStat[] {
  return employees
    .filter((e) => e.active)
    .map((employee) => {
      const assigned = events.filter((event) => {
        if (!event.assignedEmployeeIds?.includes(employee.id)) return false
        const d = new Date(`${event.date}T12:00:00`)
        return d.getFullYear() === year && d.getMonth() === month
      })

      return {
        employeeId: employee.id,
        employeeName: getEmployeeFullName(employee),
        eventCount: assigned.length,
        events: assigned.map((e) => ({
          id: e.id,
          clientName: e.clientName,
          date: e.date,
          eventType: e.eventType,
        })),
      }
    })
    .sort((a, b) => b.eventCount - a.eventCount)
}

export function getEmployeeById(id: string): Employee | undefined {
  return loadEmployees().find((e) => e.id === id)
}

export function countEmployeeEvents(events: CalendarEvent[], employeeId: string): number {
  return events.filter((e) => e.assignedEmployeeIds?.includes(employeeId)).length
}

export function filterEmployeeEventsByDateRange(
  events: CalendarEvent[],
  employeeId: string,
  dateFrom?: string,
  dateTo?: string,
): CalendarEvent[] {
  return getEventsForEmployee(events, employeeId).filter((event) => {
    if (dateFrom && event.date < dateFrom) return false
    if (dateTo && event.date > dateTo) return false
    return true
  })
}

export function getEventsForEmployee(events: CalendarEvent[], employeeId: string): CalendarEvent[] {
  return events
    .filter((e) => e.assignedEmployeeIds?.includes(employeeId))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function getEmployeeEventStats(
  events: CalendarEvent[],
  employeeId: string,
  referenceDate: Date,
): {
  upcoming: number
  completed: number
} {
  const assigned = getEventsForEmployee(events, employeeId)
  const reference = referenceDate.getTime()

  return assigned.reduce(
    (stats, event) => {
      const eventTime = new Date(`${event.date}T12:00:00`).getTime()
      if (eventTime >= reference) stats.upcoming += 1
      else stats.completed += 1
      return stats
    },
    { upcoming: 0, completed: 0 },
  )
}
