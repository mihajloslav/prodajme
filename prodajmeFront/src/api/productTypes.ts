export interface ProductImage {
  id: number
  imageUrl: string
}

export interface ProductCategory {
  id: number
  name: string
}

export interface ProductUser {
  id: number
  name?: string
  firstName?: string
  lastName?: string
  email?: string
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

export const extractProducts = (payload: Product[] | ApiResponse<{ products?: Product[] }>): Product[] => {
  if (Array.isArray(payload)) {
    return payload
  }

  const products = payload?.data?.products
  return Array.isArray(products) ? products : []
}

export const extractProduct = (payload: Product | ApiResponse<{ product?: Product }>): Product | null => {
  if (payload && !Array.isArray(payload) && 'id' in payload) {
    return payload as Product
  }

  const product = payload?.data?.product
  return product ?? null
}

export const extractCategories = (
  payload: ProductCategory[] | ApiResponse<{ categories?: ProductCategory[] }>,
): ProductCategory[] => {
  if (Array.isArray(payload)) {
    return payload
  }

  const categories = payload?.data?.categories
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
