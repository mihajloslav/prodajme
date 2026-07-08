import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { AxiosError } from 'axios'
import axiosClient from '../../api/client/axiosClient'
import { sendAdsReportToEmail } from '../../api/auth/authApi'
import { extractProducts } from '../../api/products/productTypes'
import type { Product } from '../../api/products/productTypes'
import ProductCard from '../../components/ProductCard/ProductCard'
import { useAuth } from '../../context/AuthContext'
import styles from './MyAdsPage.module.css'

const readErrorMessage = (caughtError: unknown, fallback: string) => {
  const error = caughtError as AxiosError<{ message?: string }>
  return error.response?.data?.message || fallback
}

function MyAdsPage() {
  const { currentUser } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [reportMessage, setReportMessage] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await axiosClient.get('/api/products')
        setProducts(extractProducts(response.data))
      } catch (caughtError) {
        setError(readErrorMessage(caughtError, 'Došlo je do greške pri učitavanju vaših oglasa.'))
      } finally {
        setLoading(false)
      }
    }

    void loadProducts()
  }, [])

  const myProducts = useMemo(() => {
    if (!currentUser?.id) {
      return []
    }

    return products.filter((product) => product.user?.id === currentUser.id)
  }, [products, currentUser?.id])

  const handleDelete = async (productId: number) => {
    const confirmed = window.confirm('Da li ste sigurni da želite da obrišete ovaj oglas?')

    if (!confirmed) {
      return
    }

    try {
      setActionError('')
      await axiosClient.delete(`/api/products/${productId}`)
      setProducts((previousProducts) => previousProducts.filter((product) => product.id !== productId))
    } catch (caughtError) {
      setActionError(readErrorMessage(caughtError, 'Brisanje oglasa nije uspelo. Pokušajte ponovo.'))
    }
  }

  const handleSendReport = async () => {
    if (!currentUser?.id) {
      setActionError('Korisnik nije prijavljen.')
      return
    }

    try {
      setReportLoading(true)
      setActionError('')
      setReportMessage('')
      await sendAdsReportToEmail(currentUser.id)
      setReportMessage('Izveštaj je uspešno poslat na Vašu email adresu.')
    } catch (caughtError) {
      setActionError(readErrorMessage(caughtError, 'Slanje izveštaja nije uspelo. Pokušajte ponovo.'))
    } finally {
      setReportLoading(false)
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1>Moji oglasi</h1>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.reportButton}
            onClick={handleSendReport}
            disabled={reportLoading || loading || myProducts.length === 0}
          >
            {reportLoading ? 'Slanje...' : 'Pošalji izveštaj na mejl'}
          </button>
          <Link to="/postavi-oglas" className={styles.newAdButton}>
            Postavi oglas
          </Link>
        </div>
      </div>

      {loading && <p className={styles.stateText}>Učitavanje oglasa...</p>}
      {error && <p className={styles.errorText}>{error}</p>}
      {reportMessage && <p className={styles.successText}>{reportMessage}</p>}
      {!error && actionError && <p className={styles.errorText}>{actionError}</p>}

      {!loading && !error && myProducts.length > 0 && (
        <div className={styles.grid}>
          {myProducts.map((product) => (
            <article key={product.id} className={styles.item}>
              <ProductCard product={product} />
              <div className={styles.actions}>
                <Link to={`/products/${product.id}`} className={styles.viewButton}>
                  Pogledaj
                </Link>
                <Link to={`/moji-oglasi/${product.id}/izmeni`} className={styles.editButton}>
                  Izmeni
                </Link>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => handleDelete(product.id)}
                >
                  Obriši
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && !error && myProducts.length === 0 && (
        <div className={styles.emptyState}>
          <h2>Još uvek nemate postavljene oglase.</h2>
          <p>Krenite tako što ćete objaviti prvi oglas.</p>
          <Link to="/postavi-oglas" className={styles.emptyActionButton}>
            Postavi prvi oglas
          </Link>
        </div>
      )}
    </section>
  )
}

export default MyAdsPage
