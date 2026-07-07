import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../../api/client/axiosClient'
import { extractProducts } from '../../api/products/productTypes'
import type { Product, ProductCategory } from '../../api/products/productTypes'
import ProductCard from '../../components/ProductCard/ProductCard'
import { CategoryIcon } from '../../utils/categoryIcons'
import { sortProducts, type ProductSortOrder } from '../../utils/productList'
import styles from './HomePage.module.css'

interface HomePageProps {
  categories: ProductCategory[]
}

const INITIAL_VISIBLE_COUNT = 8

function HomePage({ categories }: HomePageProps) {
  const [products, setProducts] = useState<Product[]>([])
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
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }, [sortOrder])

  const sortedProducts = useMemo(() => sortProducts(products, sortOrder), [products, sortOrder])
  const visibleProducts = useMemo(() => sortedProducts.slice(0, visibleCount), [sortedProducts, visibleCount])
  const hasMoreProducts = visibleCount < sortedProducts.length

  const popularCategories = useMemo(() => {
    return categories.slice(0, 6).map((category) => {
      const total = products.filter((product) => product.category?.id === category.id).length

      return {
        id: category.id,
        name: category.name,
        total,
      }
    })
  }, [categories, products])

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.title}>Prodaj nešto što ti ne treba.</h1>
          <p className={styles.subtitle}>Brzo, jednostavno, besplatno.</p>
          <div className={styles.heroActions}>
            <Link to="/postavi-oglas" className={styles.ctaButton}>
              Postavite oglas
            </Link>
            <Link to="/register" className={styles.linkButton}>
              Kako funkcioniše?
            </Link>
          </div>
        </div>

        <img src="/hero.png" alt="" className={styles.heroVisual} />
      </section>

      <section className={styles.categorySection}>
        <div className={styles.sectionHeader}>
          <h2>Popularne kategorije</h2>
          <p>Pogledajte sve</p>
        </div>
        <div className={styles.categoryGrid}>
          {popularCategories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className={styles.categoryCard}
            >
              <CategoryIcon categoryName={category.name} size={28} className={styles.categoryIcon} />
              <p className={styles.categoryName}>{category.name}</p>
              <p className={styles.categoryCount}>{category.total} oglasa</p>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.productsSection}>
        <div className={styles.sectionHeader}>
          <h2>Najnoviji oglasi</h2>
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

        {!loading && !error && (
          <div className={styles.grid}>
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && !error && sortedProducts.length === 0 && (
          <p className={styles.stateText}>Nema oglasa trenutno.</p>
        )}

        {!loading && !error && hasMoreProducts && (
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
      </section>
    </div>
  )
}

export default HomePage
