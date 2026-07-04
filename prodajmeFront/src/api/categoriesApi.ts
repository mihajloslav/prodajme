import axiosClient from './axiosClient'
import { extractCategories } from './productTypes'
import type { ProductCategory } from './productTypes'

export const getCategories = async (): Promise<ProductCategory[]> => {
  const response = await axiosClient.get('/api/categories')
  return extractCategories(response.data)
}
