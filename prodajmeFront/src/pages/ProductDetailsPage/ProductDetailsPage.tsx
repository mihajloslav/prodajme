import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axiosClient from '../../api/axiosClient'
import { useAuth } from '../../context/AuthContext'
import { extractProduct, formatPrice, resolveImageUrl } from '../../api/productTypes'
import type { Product } from '../../api/productTypes'
import styles from './ProductDetailsPage.module.css'

function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, currentUser } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFavoriteMarked, setIsFavoriteMarked] = useState(false)
  const [favoriteFeedback, setFavoriteFeedback] = useState('')
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [messageFeedback, setMessageFeedback] = useState('')
  const [purchaseFeedback, setPurchaseFeedback] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
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

  const isSold = statusLabel === 'SOLD'
  const isOwnProduct = Boolean(currentUser?.id && product.user?.id && currentUser.id === product.user.id)

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

    setMessageText('')
    setIsMessageModalOpen(true)
  }

  const handleMessageSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isAuthenticated || !currentUser?.id) {
      navigate('/login')
      return
    }

    const receiverId = product.user?.id

    if (!receiverId) {
      setMessageFeedback('Primalac poruke nije dostupan.')
      setIsMessageModalOpen(false)
      return
    }

    if (!messageText.trim()) {
      return
    }

    try {
      setSendingMessage(true)
      await axiosClient.post('/api/messages', {
        text: messageText.trim(),
        sender: { id: currentUser.id },
        receiver: { id: receiverId },
        product: { id: product.id },
      })
      setIsMessageModalOpen(false)
      setMessageFeedback('Poruka je uspešno poslata.')
      setMessageText('')
    } catch {
      setMessageFeedback('Nismo uspeli da pošaljemo poruku.')
    } finally {
      setSendingMessage(false)
    }
  }

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated || !currentUser?.id) {
      navigate('/login')
      return
    }

    if (isFavoriteMarked) {
      return
    }

    try {
      await axiosClient.post('/api/favorites', {
        user: { id: currentUser.id },
        product: { id: product.id },
      })
      setIsFavoriteMarked(true)
      setFavoriteFeedback('Oglas je dodat u omiljene.')
    } catch {
      setFavoriteFeedback('Nismo uspeli da dodamo oglas u omiljene.')
    }
  }

  const handleOpenPurchaseModal = () => {
    if (!isAuthenticated || !currentUser?.id) {
      navigate('/login')
      return
    }

    if (isOwnProduct) {
      setPurchaseFeedback('Ne možete kupiti svoj proizvod.')
      return
    }

    if (isSold) {
      return
    }

    setIsPurchaseModalOpen(true)
  }

  const handleConfirmPurchase = async () => {
    if (!currentUser?.id || isSold || isOwnProduct) {
      return
    }

    try {
      setIsPurchasing(true)
      await axiosClient.post('/api/purchases', {
        buyer: { id: currentUser.id },
        product: { id: product.id },
        finalPrice: product.price,
      })

      setIsPurchaseModalOpen(false)
      setPurchaseFeedback('Kupovina je uspešno izvršena.')
      setProduct((previousProduct) =>
        previousProduct
          ? {
              ...previousProduct,
              status: 'SOLD',
            }
          : previousProduct,
      )
    } catch {
      setPurchaseFeedback('Kupovina nije uspela. Pokušajte ponovo.')
      setIsPurchaseModalOpen(false)
    } finally {
      setIsPurchasing(false)
    }
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
              {isSold ? (
                <button type="button" className={styles.purchaseDisabledButton} disabled>
                  Proizvod je prodat
                </button>
              ) : isOwnProduct ? (
                <button type="button" className={styles.purchaseDisabledButton} disabled>
                  Vaš proizvod
                </button>
              ) : (
                <button type="button" className={styles.purchaseAction} onClick={handleOpenPurchaseModal}>
                  Kupi proizvod
                </button>
              )}
              <button type="button" className={styles.primaryAction} onClick={handleSendMessage}>
                Pošalji poruku
              </button>
              <button
                type="button"
                className={`${styles.secondaryAction} ${isFavoriteMarked ? styles.secondaryActionActive : ''}`}
                onClick={handleFavoriteToggle}
                disabled={isFavoriteMarked}
              >
                {isFavoriteMarked ? 'U omiljenima' : 'Dodaj u omiljene'}
              </button>
              {purchaseFeedback && <p className={styles.actionFeedback}>{purchaseFeedback}</p>}
              {messageFeedback && <p className={styles.actionFeedback}>{messageFeedback}</p>}
              {favoriteFeedback && <p className={styles.actionFeedback}>{favoriteFeedback}</p>}
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
            <form onSubmit={handleMessageSubmit} className={styles.messageForm}>
              <textarea
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                placeholder="Unesite tekst poruke..."
                rows={5}
                required
              />

              <div className={styles.messageActions}>
                <button type="button" className={styles.secondaryAction} onClick={() => setIsMessageModalOpen(false)}>
                  Otkaži
                </button>
                <button type="submit" className={styles.primaryAction} disabled={sendingMessage || !messageText.trim()}>
                  {sendingMessage ? 'Slanje...' : 'Pošalji'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPurchaseModalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <h3>Potvrda kupovine</h3>
            <p>Da li ste sigurni da želite da kupite ovaj proizvod?</p>
            <div className={styles.messageActions}>
              <button type="button" className={styles.secondaryAction} onClick={() => setIsPurchaseModalOpen(false)}>
                Otkaži
              </button>
              <button type="button" className={styles.primaryAction} onClick={handleConfirmPurchase} disabled={isPurchasing}>
                {isPurchasing ? 'Kupovina...' : 'Potvrdi kupovinu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductDetailsPage
