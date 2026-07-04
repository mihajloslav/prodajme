export interface ProductImage {
  id: number
  imageUrl: string
}

export interface ProductCategory {
  id: number
  name: string
}

export interface City {
  id: number
  name: string
}

export interface ProductUser {
  id: number
  name?: string
  firstName?: string
  lastName?: string
  surname?: string
  phone?: string
  email?: string
  username?: string
  role?: string
  city?: City | string
}

export interface Product {
  id: number
  title: string
  description: string
  price: number
  images: ProductImage[]
  datePosted: string
  status: string
  user?: ProductUser
  category?: ProductCategory
}

interface ApiResponse<TData> {
  success?: boolean
  message?: string
  status?: string
  data?: TData
}

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isProduct = (value: unknown): value is Product =>
  isObjectRecord(value) && typeof value.id === 'number'

const isProductApiResponse = (value: unknown): value is ApiResponse<{ product?: Product }> =>
  isObjectRecord(value) && Object.prototype.hasOwnProperty.call(value, 'data')

const isProductsApiResponse = (value: unknown): value is ApiResponse<{ products?: Product[] }> =>
  isObjectRecord(value) && Object.prototype.hasOwnProperty.call(value, 'data')

const isCategoriesApiResponse = (value: unknown): value is ApiResponse<{ categories?: ProductCategory[] }> =>
  isObjectRecord(value) && Object.prototype.hasOwnProperty.call(value, 'data')

export function extractProducts(payload: unknown): Product[] {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!isProductsApiResponse(payload)) {
    return []
  }

  const products = payload.data?.products
  return Array.isArray(products) ? products : []
}

export function extractProduct(payload: unknown): Product | null {
  if (isProductApiResponse(payload)) {
    return payload.data?.product ?? null
  }

  if (isProduct(payload)) {
    return payload
  }

  return null
}

export function extractCategories(payload: unknown): ProductCategory[] {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!isCategoriesApiResponse(payload)) {
    return []
  }

  const categories = payload.data?.categories
  return Array.isArray(categories) ? categories : []
}

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency: 'RSD',
    maximumFractionDigits: 0,
  }).format(price)

export const resolveImageUrl = (imageUrl?: string) => {
  if (!imageUrl) {
    return '/placeholder-product.svg'
  }

  const normalized = imageUrl.trim()

  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    return normalized
  }

  if (normalized.startsWith('/uploads')) {
    return `http://localhost:8080${normalized}`
  }

  if (normalized.startsWith('/')) {
    return normalized
  }

  return `/${normalized}`
}
