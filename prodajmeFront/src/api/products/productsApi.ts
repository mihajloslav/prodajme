import axiosClient from '../client/axiosClient'
import { extractProduct } from './productTypes'
import type { Product } from './productTypes'

interface CreateProductInput {
  title: string
  description: string
  price: number
  userId: number
  categoryId: number
}

// Kreiranje novog oglasa za korisnika.
export const createProduct = async (input: CreateProductInput): Promise<Product> => {
  const response = await axiosClient.post('/api/products', {
    title: input.title,
    description: input.description,
    price: input.price,
    status: 'ACTIVE',
    user: { id: input.userId },
    category: { id: input.categoryId },
  })

  const product = extractProduct(response.data)

  if (!product) {
    throw new Error('Odgovor prilikom kreiranja oglasa ne sadrži podatke o oglasu.')
  }

  return product
}

// Upload slike za postojeći oglas.
export const uploadProductImage = async (productId: number, file: File): Promise<void> => {
  const formData = new FormData()
  formData.append('file', file)

  await axiosClient.post(`/api/product-images/product/${productId}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
