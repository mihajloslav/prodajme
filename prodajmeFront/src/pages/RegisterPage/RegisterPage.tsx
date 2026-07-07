import { useEffect, useState } from 'react'
import type { FormEventHandler } from 'react'
import type { AxiosError } from 'axios'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { getCities, registerUser } from '../../api/auth/authApi'
import type { City } from '../../api/auth/authTypes'
import styles from './RegisterPage.module.css'

function RegisterPage() {
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [cityId, setCityId] = useState<number | null>(null)

  const [cities, setCities] = useState<City[]>([])
  const [loadingCities, setLoadingCities] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoadingCities(true)
        const cityList = await getCities()
        setCities(cityList)
        setCityId(cityList[0]?.id ?? null)
      } catch {
        setCities([])
        setCityId(null)
      } finally {
        setLoadingCities(false)
      }
    }

    void loadCities()
  }, [])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      setError('Lozinke se ne poklapaju.')
      return
    }

    if (!/^(?=.*[A-Z])(?=.*\d).{7,}$/.test(password)) {
      setError('Lozinka mora imati najmanje 7 karaktera, najmanje jedno veliko slovo i najmanje jedan broj.')
      return
    }

    if (!/^\+381\d{8,9}$/.test(phone.trim())) {
      setError('Neispravan format telefona. Format mora biti +381XXXXXXXX.')
      return
    }

    if (!cityId) {
      setError('Izaberite grad.')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      await registerUser({
        name: name.trim(),
        surname: surname.trim(),
        phone: phone.trim(),
        email: email.trim(),
        username: username.trim(),
        password,
        role: 'USER',
        cityId,
      })

      navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`, {
        state: {
          email: email.trim(),
          message: 'Verifikacioni kod je poslat na vaš email.',
        },
      })
    } catch (caughtError) {
      const error = caughtError as AxiosError<{ message?: string }>
      setError(error.response?.data?.message || 'Registracija nije uspela. Proverite unete podatke.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.authCard}>
        <h1 className={styles.heading}>Prijava / Registracija</h1>

        <div className={styles.tabs}>
          <Link to="/login" className={styles.tab}>
            Prijava
          </Link>
          <Link to="/register" className={`${styles.tab} ${styles.tabActive}`}>
            Registracija
          </Link>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="register-first-name">
            Ime
          </label>
          <input
            id="register-first-name"
            type="text"
            placeholder="Petar"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label className={styles.label} htmlFor="register-last-name">
            Prezime
          </label>
          <input
            id="register-last-name"
            type="text"
            placeholder="Petrović"
            value={surname}
            onChange={(event) => setSurname(event.target.value)}
            required
          />

          <label className={styles.label} htmlFor="register-phone">
            Telefon
          </label>
          <input
            id="register-phone"
            type="text"
            placeholder="+38161234567"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />

          <label className={styles.label} htmlFor="register-email">
            E-mail adresa
          </label>
          <input
            id="register-email"
            type="email"
            placeholder="ime@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label className={styles.label} htmlFor="register-username">
            Korisničko ime
          </label>
          <input
            id="register-username"
            type="text"
            placeholder="petar123"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label className={styles.label} htmlFor="register-password">
            Lozinka
          </label>
          <input
            id="register-password"
            type="password"
            placeholder="Unesite lozinku"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <label className={styles.label} htmlFor="register-password-repeat">
            Potvrdite lozinku
          </label>
          <input
            id="register-password-repeat"
            type="password"
            placeholder="Ponovite lozinku"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

          <label className={styles.label} htmlFor="register-city">
            Grad
          </label>
          <select
            id="register-city"
            value={cityId ?? ''}
            onChange={(event) => setCityId(Number(event.target.value))}
            className={styles.selectField}
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

          <input type="hidden" value="USER" readOnly />

          <button type="submit" className={styles.primaryButton} disabled={submitting || loadingCities}>
            {submitting ? 'Kreiranje...' : 'Kreiraj nalog'}
          </button>

          {error && <p className={styles.errorText}>{error}</p>}
        </form>

        <p className={styles.switchText}>
          Već imate nalog? <Link to="/login">Prijavite se</Link>
        </p>
      </div>
    </section>
  )
}

export default RegisterPage
