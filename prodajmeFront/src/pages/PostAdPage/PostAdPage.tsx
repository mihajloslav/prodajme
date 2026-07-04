import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { AxiosError } from 'axios'
import { createProduct, uploadProductImage } from '../../api/productsApi'
import { useAuth } from '../../context/AuthContext'
import type { ProductCategory } from '../../api/productTypes'
import styles from './PostAdPage.module.css'

interface PostAdPageProps {
  categories: ProductCategory[]
}

interface SelectedImage {
  id: string
  file: File
  previewUrl: string
}

const readErrorMessage = (caughtError: unknown, fallback: string) => {
  const error = caughtError as AxiosError<{ message?: string }>
  return error.response?.data?.message || fallback
}

function PostAdPage({ categories }: PostAdPageProps) {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const redirectTimeoutRef = useRef<number | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    return () => {
      selectedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl))

      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current)
      }
    }
  }, [selectedImages])

  const triggerFileDialog = () => {
    fileInputRef.current?.click()
  }

  const appendFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      return
    }

    const nextImages: SelectedImage[] = Array.from(fileList)
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }))

    setSelectedImages((previousImages) => [...previousImages, ...nextImages])

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    appendFiles(event.target.files)
  }

  const handleRemoveImage = (imageId: string) => {
    setSelectedImages((previousImages) => {
      const imageToRemove = previousImages.find((image) => image.id === imageId)

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl)
      }

      return previousImages.filter((image) => image.id !== imageId)
    })
  }

  const isSubmitDisabled = useMemo(
    () =>
      submitting ||
      !title.trim() ||
      !description.trim() ||
      !price.trim() ||
      !categoryId,
    [submitting, title, description, price, categoryId],
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!currentUser?.id) {
      navigate('/login')
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
      const createdProduct = await createProduct({
        title: title.trim(),
        description: description.trim(),
        price: numericPrice,
        userId: currentUser.id,
        categoryId: Number(categoryId),
      })

      if (selectedImages.length > 0) {
        await Promise.all(
          selectedImages.map((image) => uploadProductImage(createdProduct.id, image.file)),
        )
      }

      setSuccessMessage('Oglas je uspešno postavljen.')
      redirectTimeoutRef.current = window.setTimeout(() => {
        navigate(`/products/${createdProduct.id}`)
      }, 1000)
    } catch (caughtError) {
      setError(readErrorMessage(caughtError, 'Nismo uspeli da postavimo oglas. Pokušajte ponovo.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>ProdajMe</p>
          <h1>Postavi oglas</h1>
          <p>
            Kreiraj oglas u nekoliko koraka. Grad se automatski preuzima iz tvog korisničkog profila.
          </p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Naslov</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Npr. iPhone 13 Pro 256GB"
              maxLength={120}
              required
            />
          </label>

          <label className={styles.field}>
            <span>Opis</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              placeholder="Napiši stanje proizvoda, dodatnu opremu i bitne informacije."
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
                inputMode="numeric"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="25000"
                required
              />
            </label>

            <label className={styles.field}>
              <span>Kategorija</span>
              <select
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                required
              >
                <option value="">Izaberi kategoriju</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.uploadSection}>
            <div className={styles.uploadHeader}>
              <span>Slike oglasa</span>
              <button type="button" className={styles.addMoreButton} onClick={triggerFileDialog}>
                Dodaj još slika
              </button>
            </div>

            <button type="button" className={styles.dropZone} onClick={triggerFileDialog}>
              <strong>Prevuci slike ovde</strong>
              <span>ili klikni da izabereš fajlove (PNG, JPG, WEBP...)</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className={styles.hiddenInput}
              onChange={handleImagesChange}
            />

            {selectedImages.length > 0 ? (
              <div className={styles.previewGrid}>
                {selectedImages.map((image) => (
                  <article key={image.id} className={styles.previewCard}>
                    <img src={image.previewUrl} alt={image.file.name} className={styles.previewImage} />
                    <div className={styles.previewMeta}>
                      <p title={image.file.name}>{image.file.name}</p>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => handleRemoveImage(image.id)}
                      >
                        Obriši sliku
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className={styles.noImagesText}>Još uvek nema izabranih slika.</p>
            )}
          </div>

          {error && <p className={styles.errorText}>{error}</p>}
          {successMessage && <p className={styles.successText}>{successMessage}</p>}

          <button type="submit" className={styles.submitButton} disabled={isSubmitDisabled}>
            {submitting ? 'Postavljanje oglasa...' : 'Postavi oglas'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default PostAdPage
