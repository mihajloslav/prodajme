import type { Product } from '../api/products/productTypes'

export type ProductSortOrder = 'newest' | 'priceAsc' | 'priceDesc'

export const sortProducts = (products: Product[], sortOrder: ProductSortOrder): Product[] => {
  const sortedProducts = [...products]

  switch (sortOrder) {
    case 'priceAsc':
      return sortedProducts.sort((left, right) => left.price - right.price)
    case 'priceDesc':
      return sortedProducts.sort((left, right) => right.price - left.price)
    case 'newest':
    default: {
      return sortedProducts.sort((left, right) => {
        const leftTime = Date.parse(left.datePosted)
        const rightTime = Date.parse(right.datePosted)

        if (Number.isNaN(leftTime) && Number.isNaN(rightTime)) {
          return 0
        }

        if (Number.isNaN(leftTime)) {
          return 1
        }

        if (Number.isNaN(rightTime)) {
          return -1
        }

        return rightTime - leftTime
      })
    }
  }
}
