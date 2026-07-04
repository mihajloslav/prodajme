import axiosClient from './axiosClient'
import type { AuthUser, City, RegisterPayload, VerifyEmailPayload } from './authTypes'

interface LoginPayload {
  email: string
  password: string
}

interface ApiResponse<TData> {
  data?: TData
  message?: string
  status?: string
}

const unwrapData = <TValue>(responseData: ApiResponse<TValue>, fallbackMessage: string): TValue => {
  if (!responseData?.data) {
    throw new Error(fallbackMessage)
  }

  return responseData.data
}

export const loginUser = async (payload: LoginPayload): Promise<AuthUser> => {
  const response = await axiosClient.post<ApiResponse<{ user?: AuthUser }>>('/api/users/login', payload)
  const data = unwrapData(response.data, 'Login response does not contain data')
  const user = data.user

  if (!user) {
    throw new Error('Login response does not contain user data')
  }

  return user
}

export const registerUser = async (payload: RegisterPayload): Promise<AuthUser> => {
  const response = await axiosClient.post<ApiResponse<{ user?: AuthUser }>>('/api/users', payload)
  const data = unwrapData(response.data, 'Register response does not contain data')
  const user = data.user

  if (!user) {
    throw new Error('Register response does not contain user data')
  }

  return user
}

export const verifyEmail = async (payload: VerifyEmailPayload): Promise<AuthUser> => {
  const response = await axiosClient.post<ApiResponse<{ user?: AuthUser }>>('/api/users/verify', payload)
  const data = unwrapData(response.data, 'Verify response does not contain data')
  const user = data.user

  if (!user) {
    throw new Error('Verify response does not contain user data')
  }

  return user
}

export const getCities = async (): Promise<City[]> => {
  const response = await axiosClient.get<ApiResponse<{ cities?: City[] }>>('/api/cities')
  const data = unwrapData(response.data, 'Cities response does not contain data')
  return Array.isArray(data.cities) ? data.cities : []
}
