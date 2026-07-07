import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axiosClient from '../../api/client/axiosClient'
import { extractProducts } from '../../api/products/productTypes'
import type { Product } from '../../api/products/productTypes'
import ProductCard from '../../components/ProductCard/ProductCard'
import { sortProducts, type ProductSortOrder } from '../../utils/productList'
import styles from '../CategoryProductsPage/CategoryProductsPage.module.css'

const INITIAL_VISIBLE_COUNT = 8

function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortOrder, setSortOrder] = useState<ProductSortOrder>('newest')
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)

  const searchTerm = searchParams.get('title')?.trim() ?? ''

  useEffect(() => {
    if (!searchTerm) {
      navigate('/', { replace: true })
      return
    }

    const loadProducts = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await axiosClient.get('/api/products/search', {
          params: { title: searchTerm },
        })
        setProducts(extractProducts(response.data))
      } catch {
        setError('Došlo je do greške pri pretrazi oglasa. Pokušajte ponovo kasnije.')
      } finally {
        setLoading(false)
      }
    }

    void loadProducts()
  }, [navigate, searchTerm])

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }, [searchTerm, sortOrder])

  const sortedProducts = useMemo(() => sortProducts(products, sortOrder), [products, sortOrder])
  const visibleProducts = useMemo(() => sortedProducts.slice(0, visibleCount), [sortedProducts, visibleCount])
  const hasMoreProducts = visibleCount < sortedProducts.length

  if (!searchTerm) {
    return null
  }

  return (
    <section className={styles.page}>
      <div className={styles.sectionHeader}>
        <h1>Rezultati pretrage za: "{searchTerm}"</h1>
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
        <p className={styles.stateText}>Nema oglasa za traženi pojam.</p>
      )}
    </section>
  )
}

export default SearchResultsPage
