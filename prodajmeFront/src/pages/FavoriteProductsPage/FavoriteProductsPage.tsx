import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import type { AxiosError } from 'axios'
import axiosClient from '../../api/axiosClient'
import type { Product } from '../../api/productTypes'
import ProductCard from '../../components/ProductCard/ProductCard'
import { useAuth } from '../../context/AuthContext'
import styles from './FavoriteProductsPage.module.css'

interface FavoriteItem {
  id: number
  product: Product
}

interface ApiResponse<TData> {
  data?: TData
  message?: string
}

const extractFavorites = (
  payload: FavoriteItem[] | ApiResponse<{ favorites?: FavoriteItem[] }>,
): FavoriteItem[] => {
  if (Array.isArray(payload)) {
    return payload
  }

  const favorites = payload?.data?.favorites
  return Array.isArray(favorites) ? favorites : []
}

const readErrorMessage = (caughtError: unknown, fallback: string) => {
  const error = caughtError as AxiosError<{ message?: string }>
  return error.response?.data?.message || fallback
}

function FavoriteProductsPage() {
  const { currentUser, isAuthenticated } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadFavorites = async () => {
      if (!currentUser?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        const response = await axiosClient.get(`/api/favorites/user/${currentUser.id}`)
        setFavorites(extractFavorites(response.data))
      } catch (caughtError) {
        setError(readErrorMessage(caughtError, 'Došlo je do greške pri učitavanju omiljenih oglasa.'))
      } finally {
        setLoading(false)
      }
    }

    void loadFavorites()
  }, [currentUser?.id])

  const favoriteProducts = useMemo(
    () => favorites.map((favorite) => favorite.product).filter(Boolean),
    [favorites],
  )

  const handleRemove = async (productId: number) => {
    if (!currentUser?.id) {
      return
    }

    try {
      await axiosClient.delete(`/api/favorites/user/${currentUser.id}/product/${productId}`)
      setFavorites((previousFavorites) =>
        previousFavorites.filter((favorite) => favorite.product?.id !== productId),
      )
    } catch (caughtError) {
      setError(readErrorMessage(caughtError, 'Uklanjanje iz omiljenih nije uspelo.'))
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1>Omiljeni oglasi</h1>
        <Link to="/" className={styles.backLink}>
          Nazad na oglase
        </Link>
      </div>

      {loading && <p className={styles.stateText}>Učitavanje omiljenih oglasa...</p>}
      {error && <p className={styles.errorText}>{error}</p>}

      {!loading && !error && favoriteProducts.length > 0 && (
        <div className={styles.grid}>
          {favoriteProducts.map((product) => (
            <article key={product.id} className={styles.item}>
              <ProductCard product={product} />
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemove(product.id)}
                >
                  Ukloni iz omiljenih
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && !error && favoriteProducts.length === 0 && (
        <div className={styles.emptyState}>
          <h2>Nemate sačuvanih oglasa.</h2>
        </div>
      )}
    </section>
  )
}

export default FavoriteProductsPage
