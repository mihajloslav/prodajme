import { isObjectRecord, type ApiResponse } from '../utils/apiUtils'

// Osnovni tip za sliku oglasa.
export interface ProductImage {
  id: number
  imageUrl: string
}

// Kategorija proizvoda koju koristimo kroz aplikaciju.
export interface ProductCategory {
  id: number
  name: string
}

// Korisnik koji je objavio oglas.
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
  city?: { id: number; name: string } | string
}

// Pojedinačni oglas.
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

// Proverava da li objekat liči na oglas.
const isProduct = (value: unknown): value is Product => {
  if (!isObjectRecord(value)) {
    return false
  }

  return typeof value.id === 'number'
}

// Proverava da li je odgovor servera u obliku omota sa poljem `data`.
const hasDataField = <TData>(value: unknown): value is ApiResponse<TData> => {
  if (!isObjectRecord(value)) {
    return false
  }

  return Object.prototype.hasOwnProperty.call(value, 'data')
}

// Izvlači niz oglasa iz različitih oblika API odgovora.
export function extractProducts(payload: unknown): Product[] {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!hasDataField<{ products?: Product[] }>(payload)) {
    return []
  }

  const products = payload.data?.products

  if (Array.isArray(products)) {
    return products
  }

  return []
}

// Izvlači jedan oglas iz API odgovora ili direktnog objekta.
export function extractProduct(payload: unknown): Product | null {
  if (hasDataField<{ product?: Product }>(payload)) {
    return payload.data?.product ?? null
  }

  if (isProduct(payload)) {
    return payload
  }

  return null
}

// Izvlači niz kategorija iz različitih oblika API odgovora.
export function extractCategories(payload: unknown): ProductCategory[] {
  if (Array.isArray(payload)) {
    return payload
  }

  if (!hasDataField<{ categories?: ProductCategory[] }>(payload)) {
    return []
  }

  const categories = payload.data?.categories

  if (Array.isArray(categories)) {
    return categories
  }

  return []
}

// Formatira cenu u prikaz za korisnika.
export const formatPrice = (price: number) =>
  new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency: 'RSD',
    maximumFractionDigits: 0,
  }).format(price)

export const DELETED_PRODUCT_STATUS = 'DELETED'
export const UNAVAILABLE_PRODUCT_LABEL = 'Oglas više nije dostupan'

// Proverava da li je oglas obrisan.
export const isProductDeleted = (product?: { status?: string | null }) => {
  const status = product?.status ?? ''

  return status.toUpperCase() === DELETED_PRODUCT_STATUS
}

// Vraća naziv koji treba prikazati za oglas.
export const getProductLabel = (product?: { id?: number; title?: string; status?: string | null }) => {
  if (isProductDeleted(product)) {
    return UNAVAILABLE_PRODUCT_LABEL
  }

  if (product?.title) {
    return product.title
  }

  if (product?.id) {
    return `Oglas #${product.id}`
  }

  return UNAVAILABLE_PRODUCT_LABEL
}

// Pretvara relativnu putanju slike u pun URL za prikaz.
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
