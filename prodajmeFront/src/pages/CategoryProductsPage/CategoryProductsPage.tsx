import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosClient from '../../api/client/axiosClient'
import { getCategories } from '../../api/categories/categoriesApi'
import { extractProducts } from '../../api/products/productTypes'
import type { Product, ProductCategory } from '../../api/products/productTypes'
import ProductCard from '../../components/ProductCard/ProductCard'
import { sortProducts, type ProductSortOrder } from '../../utils/productList'
import styles from './CategoryProductsPage.module.css'

interface CategoryProductsPageProps {
  categories: ProductCategory[]
}

const INITIAL_VISIBLE_COUNT = 8

function CategoryProductsPage({ categories }: CategoryProductsPageProps) {
  const { categoryId } = useParams()
  const parsedCategoryId = Number(categoryId)

  const [products, setProducts] = useState<Product[]>([])
  const [resolvedCategories, setResolvedCategories] = useState<ProductCategory[]>(categories)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortOrder, setSortOrder] = useState<ProductSortOrder>('newest')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)

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

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }, [parsedCategoryId, sortOrder])

  const filteredProducts = useMemo(() => {
    if (!Number.isFinite(parsedCategoryId)) {
      return []
    }

    return products.filter((product) => product.category?.id === parsedCategoryId)
  }, [products, parsedCategoryId])

  const sortedProducts = useMemo(() => sortProducts(filteredProducts, sortOrder), [filteredProducts, sortOrder])
  const visibleProducts = useMemo(() => sortedProducts.slice(0, visibleCount), [sortedProducts, visibleCount])
  const hasMoreProducts = visibleCount < sortedProducts.length

  const categoryName = useMemo(() => {
    if (!Number.isFinite(parsedCategoryId)) {
      return 'Nepoznata kategorija'
    }

    const category = resolvedCategories.find((item) => item.id === parsedCategoryId)
    return category?.name ?? `Kategorija #${parsedCategoryId}`
  }, [resolvedCategories, parsedCategoryId])

  return (
    <section className={styles.page}>
      <div className={styles.sectionHeader}>
        <h1>Oglasi iz kategorije: {categoryName}</h1>
        <div className={styles.sectionHeaderActions}>
          <label className={styles.sortControl}>
            <span>Sortiraj</span>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as ProductSortOrder)}
              className={styles.sortSelect}
            >
              <option value="newest">Najnovije</option>
              <option value="priceAsc">Cena rastuće</option>
              <option value="priceDesc">Cena opadajuće</option>
            </select>
          </label>
          <p>{sortedProducts.length} rezultata</p>
        </div>
      </div>

      {loading && <p className={styles.stateText}>Učitavanje oglasa...</p>}
      {error && <p className={styles.errorText}>{error}</p>}

      {!loading && !error && sortedProducts.length > 0 && (
        <>
          <div className={styles.grid}>
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {hasMoreProducts && (
            <div className={styles.loadMoreWrapper}>
              <button
                type="button"
                className={styles.loadMoreButton}
                onClick={() => setVisibleCount((currentCount) => currentCount + INITIAL_VISIBLE_COUNT)}
              >
                Učitaj još
              </button>
            </div>
          )}
        </>
      )}

      {!loading && !error && sortedProducts.length === 0 && (
        <p className={styles.stateText}>Nema oglasa u ovoj kategoriji.</p>
      )}
    </section>
  )
}

export default CategoryProductsPage
