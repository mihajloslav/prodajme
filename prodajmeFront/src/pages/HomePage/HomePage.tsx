import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axiosClient from '../../api/axiosClient'
import { extractProducts } from '../../api/productTypes'
import type { Product } from '../../api/productTypes'
import ProductCard from '../../components/ProductCard/ProductCard'
import styles from './HomePage.module.css'

const popularCategories = [
  { name: 'Automobili', total: '12.345 oglasa' },
  { name: 'Nekretnine', total: '45.678 oglasa' },
  { name: 'Tehnika', total: '23.456 oglasa' },
  { name: 'Moj dom', total: '18.765 oglasa' },
  { name: 'Sport i hobi', total: '9.876 oglasa' },
  { name: 'Lične stvari', total: '14.321 oglasa' },
]

function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const location = useLocation()
  const query = (location.state as { query?: string } | null)?.query?.toLowerCase() ?? ''

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

  const visibleProducts = useMemo(() => {
    if (!query) {
      return products
    }

    return products.filter((product) => {
      const source = `${product.title} ${product.description} ${product.category?.name ?? ''}`.toLowerCase()
      return source.includes(query)
    })
  }, [products, query])

  const featuredProducts = visibleProducts.slice(0, 5)

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.title}>Pronađi nešto što ti treba.</h1>
          <p className={styles.subtitle}>Brzo, jednostavno, besplatno.</p>
          <div className={styles.heroActions}>
            <button type="button" className={styles.ctaButton}>
              Postavite oglas
            </button>
            <button type="button" className={styles.linkButton}>
              Kako funkcioniše?
            </button>
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.sofaBack} />
          <div className={styles.sofaSeat} />
          <div className={styles.plant} />
        </div>
      </section>

      <section className={styles.categorySection}>
        <div className={styles.sectionHeader}>
          <h2>Popularne kategorije</h2>
          <p>Pogledajte sve</p>
        </div>
        <div className={styles.categoryGrid}>
          {popularCategories.map((category) => (
            <article key={category.name} className={styles.categoryCard}>
              <p className={styles.categoryName}>{category.name}</p>
              <p className={styles.categoryCount}>{category.total}</p>
            </article>
          ))}
        </div>
      </section>

      {!loading && !error && featuredProducts.length > 0 && (
        <section className={styles.featuredSection}>
          <div className={styles.sectionHeader}>
            <h2>Izdvojeni oglasi</h2>
          </div>
          <div className={styles.featuredRow}>
            {featuredProducts.map((product) => (
              <ProductCard key={`featured-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className={styles.productsSection}>
        <div className={styles.sectionHeader}>
          <h2>Najnoviji oglasi</h2>
          <p>{visibleProducts.length} rezultata</p>
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

        {!loading && !error && visibleProducts.length === 0 && (
          <p className={styles.stateText}>Nema oglasa za zadatu pretragu.</p>
        )}
      </section>
    </div>
  )
}

export default HomePage
