export interface Employee {
  id: string
  firstName: string
  lastName: string
  dni: string
  email: string
  phone: string
  active: boolean
  createdAt: string
  invitedAt?: string
  /** Contraseña temporal para primer acceso (demo) */
  tempPassword: string
}

export interface EmployeeFormData {
  firstName: string
  lastName: string
  dni: string
  email: string
  phone: string
}

export interface EmployeeMonthlyStat {
  employeeId: string
  employeeName: string
  eventCount: number
  events: { id: string; clientName: string; date: string; eventType: string }[]
}
