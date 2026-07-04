import type { SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice, resolveImageUrl } from '../../api/productTypes'
import type { Product } from '../../api/productTypes'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.images?.[0]?.imageUrl
  const normalizedStatus = (product.status || '').toUpperCase()
  const statusLabel =
    normalizedStatus === 'SOLD'
      ? 'PRODAT'
      : normalizedStatus === 'RESERVED'
        ? 'REZERVISAN'
        : 'AKTIVAN'

  const statusClassName =
    normalizedStatus === 'SOLD'
      ? styles.statusSold
      : normalizedStatus === 'RESERVED'
        ? styles.statusReserved
        : styles.statusActive

  const handleImageError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    if (event.currentTarget.dataset.fallbackApplied === 'true') {
      return
    }

    event.currentTarget.dataset.fallbackApplied = 'true'
    event.currentTarget.src = '/placeholder-product.svg'
  }

  return (
    <article className={styles.card}>
      <Link to={`/products/${product.id}`} className={styles.imageWrap}>
        <span className={`${styles.statusBadge} ${statusClassName}`}>{statusLabel}</span>
        <img
          src={resolveImageUrl(firstImage)}
          alt={product.title}
          className={styles.image}
          loading="lazy"
          onError={handleImageError}
        />
      </Link>

      <div className={styles.content}>
        <Link to={`/products/${product.id}`} className={styles.title}>
          {product.title}
        </Link>
        <p className={styles.price}>{formatPrice(product.price)}</p>
        <p className={styles.meta}>{product.category?.name ?? 'Ostalo'}</p>
      </div>
    </article>
  )
}

export default ProductCard
