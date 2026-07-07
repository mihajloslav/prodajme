export interface ApiResponse<TData> {
  data?: TData
  message?: string
  status?: string
  success?: boolean
}

// Jednostavan helper za bezbedno vađenje podataka iz API odgovora.
export const unwrapData = <TValue>(responseData: ApiResponse<TValue> | undefined, fallbackMessage: string): TValue => {
  if (!responseData?.data) {
    throw new Error(fallbackMessage || 'Odgovor servera ne sadrži podatke.')
  }

  return responseData.data
}

// Provera da li je vrednost objekat sa ključevima.
export const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
