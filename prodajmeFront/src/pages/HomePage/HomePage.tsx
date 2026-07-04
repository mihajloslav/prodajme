import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axiosClient from '../../api/axiosClient'
import { extractProducts } from '../../api/productTypes'
import type { Product, ProductCategory } from '../../api/productTypes'
import ProductCard from '../../components/ProductCard/ProductCard'
import styles from './HomePage.module.css'

interface HomePageProps {
  categories: ProductCategory[]
}

function HomePage({ categories }: HomePageProps) {
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

  const featuredProducts = visibleProducts.slice(0, 5)

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.title}>Pronađi nešto što ti treba.</h1>
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
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className={styles.categoryCard}
            >
              <p className={styles.categoryName}>{category.name}</p>
              <p className={styles.categoryCount}>{category.total} oglasa</p>
            </Link>
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
