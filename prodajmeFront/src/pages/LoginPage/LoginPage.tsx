import { useState } from 'react'
import type { FormEventHandler } from 'react'
import type { AxiosError } from 'axios'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../api/auth/authApi'
import { useAuth } from '../../context/AuthContext'
import styles from './LoginPage.module.css'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    try {
      setSubmitting(true)
      setError('')
      const { user, token } = await loginUser({ email: email.trim(), password })
      login(user, token)
      navigate('/')
    } catch (caughtError) {
      const error = caughtError as AxiosError<{ message?: string }>
      const backendMessage = error.response?.data?.message
      setError(backendMessage || 'Neuspešna prijava. Proverite email i lozinku.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.authCard}>
        <h1 className={styles.heading}>Prijava / Registracija</h1>

        <div className={styles.tabs}>
          <Link to="/login" className={`${styles.tab} ${styles.tabActive}`}>
            Prijava
          </Link>
          <Link to="/register" className={styles.tab}>
            Registracija
          </Link>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="login-email">
            E-mail adresa
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="ime@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label className={styles.label} htmlFor="login-password">
            Lozinka
          </label>
          <input
            id="login-password"
            type="password"
            placeholder="Unesite lozinku"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <div className={styles.utilityRow}>
            <label className={styles.rememberMe}>
              <input type="checkbox" />
              Zapamti me
            </label>
            <Link to="/forgot-password" className={styles.linkAction}>
              Zaboravili ste lozinku?
            </Link>
          </div>

          <button type="submit" className={styles.primaryButton} disabled={submitting}>
            {submitting ? 'Prijava...' : 'Prijavi se'}
          </button>

          {error && <p className={styles.errorText}>{error}</p>}
        </form>
      </div>
    </section>
  )
}

export default LoginPage
