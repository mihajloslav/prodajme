import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEventHandler } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { AxiosError } from 'axios'
import axiosClient from '../../api/client/axiosClient'
import { getCategories } from '../../api/categories/categoriesApi'
import { extractProduct, resolveImageUrl } from '../../api/products/productTypes'
import type { Product, ProductCategory, ProductImage } from '../../api/products/productTypes'
import { useAuth } from '../../context/AuthContext'
import styles from './MyAdsEditPlaceholderPage.module.css'

interface SelectedImage {
  id: string
  file: File
  previewUrl: string
}

const readErrorMessage = (caughtError: unknown, fallback: string) => {
  const error = caughtError as AxiosError<{ message?: string }>
  return error.response?.data?.message || fallback
}

const STATUS_OPTIONS = ['ACTIVE', 'RESERVED', 'SOLD'] as const

function MyAdsEditPlaceholderPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { currentUser } = useAuth()

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const pendingImagesRef = useRef<SelectedImage[]>([])
  const redirectTimeoutRef = useRef<number | null>(null)

  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>('ACTIVE')
  const [categoryId, setCategoryId] = useState('')
  const [existingImages, setExistingImages] = useState<ProductImage[]>([])
  const [newImages, setNewImages] = useState<SelectedImage[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [notAllowed, setNotAllowed] = useState(false)

  useEffect(() => {
    pendingImagesRef.current = newImages
  }, [newImages])

  useEffect(() => {
    return () => {
      pendingImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl))

      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      if (!id || !currentUser?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        const [productResponse, categoriesResponse] = await Promise.all([
          axiosClient.get(`/api/products/${id}`),
          getCategories(),
        ])

        const loadedProduct = extractProduct(productResponse.data)

        if (!loadedProduct) {
          setError('Oglas nije pronađen.')
          return
        }

        setCategories(categoriesResponse)
        setProduct(loadedProduct)

        if (loadedProduct.user?.id !== currentUser.id) {
          setNotAllowed(true)
          return
        }

        setTitle(loadedProduct.title ?? '')
        setDescription(loadedProduct.description ?? '')
        setPrice(String(loadedProduct.price ?? ''))
        setStatus((loadedProduct.status?.toUpperCase() as (typeof STATUS_OPTIONS)[number]) || 'ACTIVE')
        setCategoryId(String(loadedProduct.category?.id ?? ''))
        setExistingImages(loadedProduct.images ?? [])
      } catch (caughtError) {
        setError(readErrorMessage(caughtError, 'Nismo uspeli da učitamo oglas za izmenu.'))
      } finally {
        setLoading(false)
      }
    }

    void loadData()
  }, [id, currentUser?.id])

  const triggerFileDialog = () => {
    fileInputRef.current?.click()
  }

  const appendFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      return
    }

    const selected: SelectedImage[] = Array.from(fileList)
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }))

    setNewImages((previousImages) => [...previousImages, ...selected])

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleNewImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    appendFiles(event.target.files)
  }

  const handleRemoveNewImage = (imageId: string) => {
    setNewImages((previousImages) => {
      const imageToRemove = previousImages.find((image) => image.id === imageId)

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl)
      }

      return previousImages.filter((image) => image.id !== imageId)
    })
  }

  const handleDeleteExistingImage = async (imageId: number) => {
    try {
      setError('')
      await axiosClient.delete(`/api/product-images/${imageId}`)
      setExistingImages((previousImages) => previousImages.filter((image) => image.id !== imageId))
    } catch (caughtError) {
      setError(readErrorMessage(caughtError, 'Brisanje slike nije uspelo.'))
    }
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    if (!id || !product || !currentUser?.id) {
      return
    }

    const numericPrice = Number(price)

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError('Unesite ispravnu cenu veću od 0.')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      await axiosClient.put(`/api/products/${id}`, {
        title: title.trim(),
        description: description.trim(),
        price: numericPrice,
        status,
        datePosted: product.datePosted,
        user: { id: currentUser.id },
        category: { id: Number(categoryId) },
        images: existingImages.map((image) => ({
          id: image.id,
          imageUrl: image.imageUrl,
        })),
      })

      if (newImages.length > 0) {
        await Promise.all(
          newImages.map(async (image) => {
            const formData = new FormData()
            formData.append('file', image.file)

            await axiosClient.post(`/api/product-images/product/${id}/upload`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })

            URL.revokeObjectURL(image.previewUrl)
          }),
        )
      }

      setNewImages([])
      setSuccessMessage('Oglas je uspešno izmenjen.')
      redirectTimeoutRef.current = window.setTimeout(() => {
        navigate(`/products/${id}`)
      }, 1000)
    } catch (caughtError) {
      setError(readErrorMessage(caughtError, 'Izmena oglasa nije uspela. Pokušajte ponovo.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className={styles.stateText}>Učitavanje oglasa...</p>
  }

  if (notAllowed) {
    return (
      <section className={styles.page}>
        <div className={styles.card}>
          <h1>Izmena oglasa</h1>
          <p>Nemate dozvolu da menjate ovaj oglas.</p>
          <Link to="/moji-oglasi" className={styles.backButton}>
            Nazad na moje oglase
          </Link>
        </div>
      </section>
    )
  }

  if (!product) {
    return <p className={styles.errorText}>{error || 'Oglas nije pronađen.'}</p>
  }

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <h1>Izmena oglasa</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Naslov</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </label>

          <label className={styles.field}>
            <span>Opis</span>
            <textarea
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </label>

          <div className={styles.gridRow}>
            <label className={styles.field}>
              <span>Cena (RSD)</span>
              <input
                type="number"
                min="1"
                step="1"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
            </label>

            <label className={styles.field}>
              <span>Status</span>
              <select value={status} onChange={(event) => setStatus(event.target.value as (typeof STATUS_OPTIONS)[number])}>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className={styles.field}>
            <span>Kategorija</span>
            <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} required>
              <option value="">Izaberi kategoriju</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Postojeće slike</h2>
            </div>

            {existingImages.length > 0 ? (
              <div className={styles.imagesGrid}>
                {existingImages.map((image) => (
                  <article key={image.id} className={styles.imageCard}>
                    <img src={resolveImageUrl(image.imageUrl)} alt="Slika oglasa" className={styles.image} />
                    <button
                      type="button"
                      className={styles.inlineDeleteButton}
                      onClick={() => handleDeleteExistingImage(image.id)}
                    >
                      Obriši sliku
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <p className={styles.stateText}>Trenutno nema slika za ovaj oglas.</p>
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Nove slike</h2>
              <button type="button" className={styles.secondaryButton} onClick={triggerFileDialog}>
                Dodaj slike
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className={styles.hiddenInput}
              onChange={handleNewImagesChange}
            />

            {newImages.length > 0 ? (
              <div className={styles.imagesGrid}>
                {newImages.map((image) => (
                  <article key={image.id} className={styles.imageCard}>
                    <img src={image.previewUrl} alt={image.file.name} className={styles.image} />
                    <button
                      type="button"
                      className={styles.inlineDeleteButton}
                      onClick={() => handleRemoveNewImage(image.id)}
                    >
                      Ukloni
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <p className={styles.stateText}>Niste dodali nove slike.</p>
            )}
          </section>

          {error && <p className={styles.errorText}>{error}</p>}
          {successMessage && <p className={styles.successText}>{successMessage}</p>}

          <div className={styles.actionsRow}>
            <Link to="/moji-oglasi" className={styles.backButton}>
              Otkaži
            </Link>
            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? 'Čuvanje...' : 'Sačuvaj izmene'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default MyAdsEditPlaceholderPage
