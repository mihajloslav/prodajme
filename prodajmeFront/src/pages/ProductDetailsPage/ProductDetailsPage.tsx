import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axiosClient from '../../api/axiosClient'
import { useAuth } from '../../context/AuthContext'
import { extractProduct, formatPrice, resolveImageUrl } from '../../api/productTypes'
import type { Product } from '../../api/productTypes'
import styles from './ProductDetailsPage.module.css'

function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFavoriteMarked, setIsFavoriteMarked] = useState(false)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await axiosClient.get(`/api/products/${id}`)
        const extractedProduct = extractProduct(response.data)
        setProduct(extractedProduct)
        setSelectedImageIndex(0)
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

  const images = product.images ?? []
  const hasImages = images.length > 0
  const safeImageIndex = selectedImageIndex < images.length ? selectedImageIndex : 0
  const activeImageUrl = hasImages ? resolveImageUrl(images[safeImageIndex]?.imageUrl) : null

  const normalizedStatus = (product.status || '').toUpperCase()
  const statusLabel =
    normalizedStatus === 'RESERVED'
      ? 'RESERVED'
      : normalizedStatus === 'SOLD'
        ? 'SOLD'
        : 'ACTIVE'

  const statusClassName =
    statusLabel === 'SOLD'
      ? styles.statusSold
      : statusLabel === 'RESERVED'
        ? styles.statusReserved
        : styles.statusActive

  const sellerName =
    product.user?.name ||
    [product.user?.firstName, product.user?.lastName].filter(Boolean).join(' ') ||
    'Nepoznat prodavac'

  const formattedDate = product.datePosted
    ? new Date(product.datePosted).toLocaleString('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A'

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setIsMessageModalOpen(true)
  }

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setIsFavoriteMarked((previousValue) => !previousValue)
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.pageTitle}>Detalj oglasa</h1>

      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link to="/">Početna</Link>
        <span>›</span>
        <span>{product.category?.name ?? 'Kategorija'}</span>
        <span>›</span>
        <span>{product.title}</span>
      </nav>

      <div className={styles.content}>
        <div className={styles.gallerySection}>
          <div className={styles.galleryWrap}>
            {hasImages && (
              <div className={styles.thumbnails}>
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    className={`${styles.thumbnailButton} ${index === safeImageIndex ? styles.thumbnailActive : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={resolveImageUrl(image.imageUrl)}
                      alt={`${product.title} ${index + 1}`}
                      className={styles.thumbnailImage}
                    />
                  </button>
                ))}
              </div>
            )}

            <div className={styles.mainImageWrap}>
              {activeImageUrl ? (
                <img
                  src={activeImageUrl}
                  alt={product.title}
                  className={styles.mainImage}
                />
              ) : (
                <div className={styles.emptyImage}>Nema slike</div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>{product.title}</h1>
            <span className={`${styles.statusBadge} ${statusClassName}`}>{statusLabel}</span>
          </div>

          <p className={styles.price}>{formatPrice(product.price)}</p>

          <div className={styles.metaGrid}>
            <p className={styles.metaItem}>
              <span>Kategorija</span>
              <strong>{product.category?.name ?? 'N/A'}</strong>
            </p>
            <p className={styles.metaItem}>
              <span>Datum objave</span>
              <strong>{formattedDate}</strong>
            </p>
            <p className={styles.metaItem}>
              <span>Status</span>
              <strong>{statusLabel}</strong>
            </p>
          </div>

          <section className={styles.infoSection}>
            <h2>Osnovne informacije</h2>
            <div className={styles.infoTable}>
              <p>
                <span>Kategorija</span>
                <strong>{product.category?.name ?? 'N/A'}</strong>
              </p>
              <p>
                <span>Status</span>
                <strong>{statusLabel}</strong>
              </p>
            </div>
          </section>

          <section className={styles.descriptionSection}>
            <h2>Opis oglasa</h2>
            <p className={styles.description}>{product.description || 'Opis nije dostupan.'}</p>
          </section>
        </div>

        <aside className={styles.sidePanel}>
          <section className={styles.sellerCard}>
            <h2>Prodavac</h2>
            <p>
              <span>Ime:</span> <strong>{sellerName}</strong>
            </p>
            <p>
              <span>Email:</span> <strong>{product.user?.email ?? 'N/A'}</strong>
            </p>

            <div className={styles.sideActions}>
              <button type="button" className={styles.primaryAction} onClick={handleSendMessage}>
                Pošalji poruku
              </button>
              <button
                type="button"
                className={`${styles.secondaryAction} ${isFavoriteMarked ? styles.secondaryActionActive : ''}`}
                onClick={handleFavoriteToggle}
              >
                {isFavoriteMarked ? 'U omiljenima' : 'Dodaj u omiljene'}
              </button>
            </div>
          </section>

          <section className={styles.safeCard}>
            <h2>Bezbedna kupovina</h2>
            <ul>
              <li>Ne šaljite novac unapred.</li>
              <li>Lično preuzimanje je preporučeno.</li>
            </ul>
          </section>
        </aside>
      </div>

      {isMessageModalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <h3>Pošalji poruku</h3>
            <p>Slanje poruka će uskoro biti dostupno. UI je spreman za backend povezivanje.</p>
            <button type="button" className={styles.primaryAction} onClick={() => setIsMessageModalOpen(false)}>
              Zatvori
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductDetailsPage
