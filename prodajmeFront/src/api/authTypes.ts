export interface AuthUser {
  id: number
  name?: string
  surname?: string
  phone?: string
  email?: string
  username?: string
  role?: string
}

export interface City {
  id: number
  name: string
}

export interface RegisterPayload {
  name: string
  surname: string
  phone: string
  email: string
  username: string
  password: string
  role: 'USER'
  cityId: number
}

export interface VerifyEmailPayload {
  email: string
  code: string
}
