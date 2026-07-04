import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axiosClient from '../../api/axiosClient'
import { extractProduct, formatPrice, resolveImageUrl } from '../../api/productTypes'
import type { Product } from '../../api/productTypes'
import styles from './ProductDetailsPage.module.css'

function ProductDetailsPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await axiosClient.get(`/api/products/${id}`)
        setProduct(extractProduct(response.data))
      } catch {
        setError('Nismo uspeli da učitamo detalje oglasa.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      void loadProduct()
    }
  }, [id])

  if (loading) {
    return <p className={styles.stateText}>Učitavanje detalja oglasa...</p>
  }

  if (error || !product) {
    return <p className={styles.errorText}>{error || 'Oglas nije pronađen.'}</p>
  }

  return (
    <section className={styles.page}>
      <Link to="/" className={styles.backLink}>
        ← Nazad na oglase
      </Link>

      <div className={styles.content}>
        <div className={styles.imageWrap}>
          <img
            src={resolveImageUrl(product.images?.[0]?.imageUrl)}
            alt={product.title}
            className={styles.image}
          />
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.price}>{formatPrice(product.price)}</p>
          <p className={styles.meta}>Kategorija: {product.category?.name ?? 'N/A'}</p>
          <p className={styles.meta}>Status: {product.status || 'N/A'}</p>
          <p className={styles.description}>{product.description}</p>
        </div>
      </div>
    </section>
  )
}

export default ProductDetailsPage
