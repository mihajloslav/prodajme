import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosClient from '../../api/axiosClient'
import { getCategories } from '../../api/categoriesApi'
import { extractProducts } from '../../api/productTypes'
import type { Product, ProductCategory } from '../../api/productTypes'
import ProductCard from '../../components/ProductCard/ProductCard'
import styles from './CategoryProductsPage.module.css'

interface CategoryProductsPageProps {
  categories: ProductCategory[]
}

function CategoryProductsPage({ categories }: CategoryProductsPageProps) {
  const { categoryId } = useParams()
  const parsedCategoryId = Number(categoryId)

  const [products, setProducts] = useState<Product[]>([])
  const [resolvedCategories, setResolvedCategories] = useState<ProductCategory[]>(categories)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await axiosClient.get('/api/products')
        setProducts(extractProducts(response.data))
      } catch {
        setError('Došlo je do greške pri učitavanju oglasa. Pokušajte ponovo kasnije.')
      } finally {
        setLoading(false)
      }
    }

    void loadProducts()
  }, [])

  useEffect(() => {
    const loadCategories = async () => {
      if (categories.length > 0) {
        setResolvedCategories(categories)
        return
      }

      try {
        const fetchedCategories = await getCategories()
        setResolvedCategories(fetchedCategories)
      } catch {
        setResolvedCategories([])
      }
    }

    void loadCategories()
  }, [categories])

  const filteredProducts = useMemo(() => {
    if (!Number.isFinite(parsedCategoryId)) {
      return []
    }

    return products.filter((product) => product.category?.id === parsedCategoryId)
  }, [products, parsedCategoryId])

  const categoryName = useMemo(() => {
    if (!Number.isFinite(parsedCategoryId)) {
      return 'Nepoznata kategorija'
    }

    const category = resolvedCategories.find((item) => item.id === parsedCategoryId)
    return category?.name ?? `Kategorija #${parsedCategoryId}`
  }, [resolvedCategories, parsedCategoryId])

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1>Oglasi iz kategorije: {categoryName}</h1>
        <p>{filteredProducts.length} rezultata</p>
      </div>

      {loading && <p className={styles.stateText}>Učitavanje oglasa...</p>}
      {error && <p className={styles.errorText}>{error}</p>}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <p className={styles.stateText}>Nema oglasa u ovoj kategoriji.</p>
      )}
    </section>
  )
}

export default CategoryProductsPage
