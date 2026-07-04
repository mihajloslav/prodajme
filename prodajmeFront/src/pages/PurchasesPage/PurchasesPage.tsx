import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import type { AxiosError } from 'axios'
import axiosClient from '../../api/axiosClient'
import { formatPrice } from '../../api/productTypes'
import { useAuth } from '../../context/AuthContext'
import styles from './PurchasesPage.module.css'

interface PurchaseProduct {
  id: number
  title?: string
}

interface PurchaseUser {
  id: number
}

interface PurchaseItem {
  id: number
  datePurchased?: string
  finalPrice: number
  buyer?: PurchaseUser
  product?: PurchaseProduct
}

interface ApiResponse<TData> {
  data?: TData
  message?: string
}

const extractPurchases = (
  payload: PurchaseItem[] | ApiResponse<{ purchases?: PurchaseItem[] }>,
): PurchaseItem[] => {
  if (Array.isArray(payload)) {
    return payload
  }

  const purchases = payload?.data?.purchases
  return Array.isArray(purchases) ? purchases : []
}

const readErrorMessage = (caughtError: unknown, fallback: string) => {
  const error = caughtError as AxiosError<{ message?: string }>
  return error.response?.data?.message || fallback
}

const formatPurchaseDate = (dateValue?: string) => {
  if (!dateValue) {
    return 'N/A'
  }

  return new Date(dateValue).toLocaleString('sr-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function PurchasesPage() {
  const { currentUser, isAuthenticated } = useAuth()
  const [purchases, setPurchases] = useState<PurchaseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPurchases = async () => {
      if (!currentUser?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        const response = await axiosClient.get('/api/purchases')
        setPurchases(extractPurchases(response.data))
      } catch (caughtError) {
        setError(readErrorMessage(caughtError, 'Došlo je do greške pri učitavanju kupovina.'))
      } finally {
        setLoading(false)
      }
    }

    void loadPurchases()
  }, [currentUser?.id])

  const myPurchases = useMemo(() => {
    if (!currentUser?.id) {
      return []
    }

    return purchases.filter((purchase) => purchase.buyer?.id === currentUser.id)
  }, [purchases, currentUser?.id])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1>Moje kupovine</h1>
        <Link to="/" className={styles.backLink}>
          Nazad na oglase
        </Link>
      </div>

      {loading && <p className={styles.stateText}>Učitavanje kupovina...</p>}
      {error && <p className={styles.errorText}>{error}</p>}

      {!loading && !error && myPurchases.length > 0 && (
        <div className={styles.list}>
          {myPurchases.map((purchase) => (
            <article key={purchase.id} className={styles.item}>
              <p className={styles.title}>
                {purchase.product?.id ? (
                  <Link to={`/products/${purchase.product.id}`}>
                    {purchase.product.title || `Oglas #${purchase.product.id}`}
                  </Link>
                ) : (
                  'N/A'
                )}
              </p>

              <p className={styles.metaRow}>
                <span>Cena:</span> <strong>{formatPrice(Number(purchase.finalPrice || 0))}</strong>
              </p>
              <p className={styles.metaRow}>
                <span>Datum kupovine:</span> <strong>{formatPurchaseDate(purchase.datePurchased)}</strong>
              </p>
            </article>
          ))}
        </div>
      )}

      {!loading && !error && myPurchases.length === 0 && (
        <p className={styles.stateText}>Još uvek nemate kupovine.</p>
      )}
    </section>
  )
}

export default PurchasesPage
