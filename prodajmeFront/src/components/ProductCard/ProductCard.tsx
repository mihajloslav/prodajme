import { Link } from 'react-router-dom'
import { formatPrice, resolveImageUrl } from '../../api/productTypes'
import type { Product } from '../../api/productTypes'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.images?.[0]?.imageUrl

  return (
    <article className={styles.card}>
      <Link to={`/products/${product.id}`} className={styles.imageWrap}>
        <img
          src={resolveImageUrl(firstImage)}
          alt={product.title}
          className={styles.image}
          loading="lazy"
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
