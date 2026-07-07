import { useEffect, useState } from 'react'
import type { FormEventHandler } from 'react'
import type { AxiosError } from 'axios'
import { Link, Navigate } from 'react-router-dom'
import { getCities, updateUserProfile } from '../../api/auth/authApi'
import type { City } from '../../api/auth/authTypes'
import { useAuth } from '../../context/AuthContext'
import styles from './ProfilePage.module.css'

function ProfilePage() {
  const { isAuthenticated, currentUser, login } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [cities, setCities] = useState<City[]>([])
  const [loadingCities, setLoadingCities] = useState(false)

  const [name, setName] = useState(currentUser?.name || currentUser?.firstName || '')
  const [surname, setSurname] = useState(currentUser?.surname || currentUser?.lastName || '')
  const [phone, setPhone] = useState(currentUser?.phone || '')
  const [email, setEmail] = useState(currentUser?.email || '')
  const [username, setUsername] = useState(currentUser?.username || '')
  const [cityId, setCityId] = useState<number | null>(
    typeof currentUser?.city === 'object' ? (currentUser.city?.id ?? null) : null,
  )

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />
  }

  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoadingCities(true)
        const cityList = await getCities()
        setCities(cityList)

        if (cityList.length > 0) {
          const existingCityId = typeof currentUser.city === 'object' ? (currentUser.city?.id ?? null) : null
          setCityId(existingCityId ?? cityList[0].id)
        }
      } catch {
        setCities([])
      } finally {
        setLoadingCities(false)
      }
    }

    void loadCities()
  }, [currentUser.city])

  const firstName = currentUser.firstName || currentUser.name || 'N/A'
  const lastName = currentUser.lastName || currentUser.surname || 'N/A'
  const cityName =
    typeof currentUser.city === 'string'
      ? currentUser.city
      : currentUser.city?.name || 'N/A'

  const handleCancelEdit = () => {
    setName(currentUser.name || currentUser.firstName || '')
    setSurname(currentUser.surname || currentUser.lastName || '')
    setPhone(currentUser.phone || '')
    setEmail(currentUser.email || '')
    setUsername(currentUser.username || '')
    setCityId(typeof currentUser.city === 'object' ? (currentUser.city?.id ?? null) : null)
    setIsEditing(false)
    setFeedback('')
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    if (!/^\+381\d{8,9}$/.test(phone.trim())) {
      setFeedback('Neispravan format telefona. Format mora biti +381XXXXXXXX.')
      return
    }

    if (!cityId) {
      setFeedback('Izaberite grad.')
      return
    }

    try {
      setSubmitting(true)
      setFeedback('')

      const updatedUser = await updateUserProfile(currentUser.id, {
        name: name.trim(),
        surname: surname.trim(),
        phone: phone.trim(),
        email: email.trim(),
        username: username.trim(),
        role: currentUser.role || 'USER',
        cityId,
      })

      login(updatedUser)
      setIsEditing(false)
      setFeedback('Podaci su uspešno ažurirani.')
    } catch (caughtError) {
      const error = caughtError as AxiosError<{ message?: string }>
      setFeedback(error.response?.data?.message || 'Ažuriranje nije uspelo. Proverite unete podatke.')
    } finally {
      setSubmitting(false)
    }
  }

  const dashboardLinks = [
    { to: '/moji-oglasi', title: 'Moji oglasi' },
    { to: '/omiljeni', title: 'Omiljeni oglasi' },
    { to: '/poruke', title: 'Poruke' },
    { to: '/kupovine', title: 'Moje kupovine' },
    { to: '/postavi-oglas', title: 'Postavi oglas' },
  ]

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>Moj profil</h1>
        <p>Pregled korisničkog naloga i brzi pristup ključnim sekcijama.</p>
      </header>

      <div className={styles.grid}>
        <article className={styles.card}>
          <h2>Osnovni podaci</h2>
          {!isEditing ? (
            <>
              <div className={styles.infoGrid}>
                <p>
                  <span>Ime</span>
                  <strong>{firstName}</strong>
                </p>
                <p>
                  <span>Prezime</span>
                  <strong>{lastName}</strong>
                </p>
                <p>
                  <span>Email</span>
                  <strong>{currentUser.email || 'N/A'}</strong>
                </p>
                <p>
                  <span>Username</span>
                  <strong>{currentUser.username || 'N/A'}</strong>
                </p>
                <p>
                  <span>Telefon</span>
                  <strong>{currentUser.phone || 'N/A'}</strong>
                </p>
                <p>
                  <span>Grad</span>
                  <strong>{cityName}</strong>
                </p>
              </div>
              <button type="button" className={styles.editButton} onClick={() => setIsEditing(true)}>
                Izmeni podatke
              </button>
            </>
          ) : (
            <form className={styles.editForm} onSubmit={handleSubmit}>
              <label>
                Ime
                <input value={name} onChange={(event) => setName(event.target.value)} required />
              </label>
              <label>
                Prezime
                <input value={surname} onChange={(event) => setSurname(event.target.value)} required />
              </label>
              <label>
                Email
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </label>
              <label>
                Username
                <input value={username} onChange={(event) => setUsername(event.target.value)} required />
              </label>
              <label>
                Telefon
                <input value={phone} onChange={(event) => setPhone(event.target.value)} required />
              </label>
              <label>
                Grad
                <select
                  value={cityId ?? ''}
                  onChange={(event) => setCityId(Number(event.target.value))}
                  disabled={loadingCities || cities.length === 0}
                  required
                >
                  {cities.length === 0 && <option value="">Nema dostupnih gradova</option>}
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={handleCancelEdit} disabled={submitting}>
                  Otkaži
                </button>
                <button type="submit" className={styles.editButton} disabled={submitting || loadingCities}>
                  {submitting ? 'Čuvanje...' : 'Sačuvaj izmene'}
                </button>
              </div>
            </form>
          )}

          {feedback && <p className={styles.feedback}>{feedback}</p>}
        </article>

        <article className={styles.card}>
          <h2>Dashboard</h2>
          <div className={styles.linkGrid}>
            {dashboardLinks.map((item) => (
              <Link key={item.to} to={item.to} className={styles.dashboardLink}>
                {item.title}
              </Link>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

export default ProfilePage
