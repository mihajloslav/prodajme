import axiosClient from '../client/axiosClient'
import { unwrapData } from '../utils/apiUtils'
import type { ApiResponse } from '../utils/apiUtils'
import type { AuthUser, City, RegisterPayload, UpdateProfilePayload, VerifyEmailPayload, ResetPasswordPayload } from './authTypes'

export interface LoginPayload {
  email: string
  password: string
}

// Parsiranje odgovora nakon prijave korisnika.
const getUserFromResponse = (responseData: ApiResponse<{ user?: AuthUser; token?: string }> | undefined): { user: AuthUser; token: string } => {
  const data = unwrapData(responseData, 'Odgovor servera ne sadrži podatke.')
  const user = data.user
  const token = data.token

  if (!user || !token) {
    throw new Error('Odgovor prilikom prijave ne sadrži podatke o korisniku ili tokenu.')
  }

  return { user, token }
}

// Parsiranje odgovora koji vraća jednog korisnika.
const getSingleUserFromResponse = (responseData: ApiResponse<{ user?: AuthUser }> | undefined): AuthUser => {
  const data = unwrapData(responseData, 'Odgovor servera ne sadrži podatke.')
  const user = data.user

  if (!user) {
    throw new Error('Odgovor servera ne sadrži podatke o korisniku.')
  }

  return user
}

// Prijava korisnika.
export const loginUser = async (payload: LoginPayload): Promise<{ user: AuthUser; token: string }> => {
  const response = await axiosClient.post<ApiResponse<{ user?: AuthUser; token?: string }>>('/api/users/login', payload)
  return getUserFromResponse(response.data)
}

// Registracija novog korisnika.
export const registerUser = async (payload: RegisterPayload): Promise<AuthUser> => {
  const response = await axiosClient.post<ApiResponse<{ user?: AuthUser }>>('/api/users', payload)
  return getSingleUserFromResponse(response.data)
}

// Verifikacija naloga preko email koda.
export const verifyEmail = async (payload: VerifyEmailPayload): Promise<AuthUser> => {
  const response = await axiosClient.post<ApiResponse<{ user?: AuthUser }>>('/api/users/verify', payload)
  return getSingleUserFromResponse(response.data)
}

// Učitavanje dostupnih gradova.
export const getCities = async (): Promise<City[]> => {
  const response = await axiosClient.get<ApiResponse<{ cities?: City[] }>>('/api/cities')
  const data = unwrapData(response.data, 'Odgovor servera ne sadrži podatke o gradovima.')
  return Array.isArray(data.cities) ? data.cities : []
}

// Ažuriranje profila korisnika.
export const updateUserProfile = async (userId: number, payload: UpdateProfilePayload): Promise<AuthUser> => {
  const response = await axiosClient.put<ApiResponse<{ user?: AuthUser }>>(`/api/users/${userId}`, {
    name: payload.name,
    surname: payload.surname,
    phone: payload.phone,
    email: payload.email,
    username: payload.username,
    role: payload.role,
    city: { id: payload.cityId },
  })

  return getSingleUserFromResponse(response.data)
}

// Slanje zahteva za reset lozinke.
export const forgotPassword = async (email: string): Promise<void> => {
  await axiosClient.post('/api/users/forgot-password', { email })
}

// Reset lozinke pomoću verifikacionog koda.
export const resetPassword = async (payload: ResetPasswordPayload): Promise<void> => {
  await axiosClient.post('/api/users/reset-password', payload)
}
