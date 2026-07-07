import axiosClient from '../client/axiosClient'
import { extractCategories } from '../products/productTypes'
import type { ProductCategory } from '../products/productTypes'

// Učitavanje svih dostupnih kategorija proizvoda.
export const getCategories = async (): Promise<ProductCategory[]> => {
  const response = await axiosClient.get('/api/categories')
  return extractCategories(response.data)
}
