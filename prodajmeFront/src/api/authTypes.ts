export interface AuthUser {
  id: number
  name?: string
  firstName?: string
  surname?: string
  lastName?: string
  phone?: string
  email?: string
  username?: string
  role?: string
  city?: {
    id?: number
    name?: string
  } | string
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

export interface UpdateProfilePayload {
  name: string
  surname: string
  phone: string
  email: string
  username: string
  role: string
  cityId: number
}
