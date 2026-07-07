import { useEffect, useState } from 'react'
import type { FormEventHandler } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { verifyEmail } from '../../api/auth/authApi'
import styles from './VerifyEmailPage.module.css'

function VerifyEmailPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const stateEmail = (location.state as { email?: string; message?: string } | null)?.email
  const initialMessage = (location.state as { email?: string; message?: string } | null)?.message ?? ''
  const queryEmail = new URLSearchParams(location.search).get('email') ?? ''

  const [email, setEmail] = useState(stateEmail || queryEmail)
  const [code, setCode] = useState('')
  const [message, setMessage] = useState(initialMessage)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setMessage(initialMessage)
  }, [initialMessage])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    try {
      setSubmitting(true)
      setError('')
      setMessage('')

      await verifyEmail({
        email: email.trim(),
        code: code.trim(),
      })

      setMessage('Nalog je uspešno verifikovan. Preusmeravanje na prijavu...')
      setTimeout(() => {
        navigate('/login')
      }, 1200)
    } catch {
      setError('Verifikacija nije uspela. Proverite email i kod.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={styles.page}>
      <h1>Verifikacija e-mail adrese</h1>

      <p className={styles.description}>Unesite email i kod koji ste dobili kako biste aktivirali nalog.</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="verify-email">
          E-mail adresa
        </label>
        <input
          id="verify-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="ime@email.com"
          required
        />

        <label className={styles.label} htmlFor="verify-code">
          Verifikacioni kod
        </label>
        <input
          id="verify-code"
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Unesite kod"
          required
        />

        <button type="submit" className={styles.primaryButton} disabled={submitting}>
          {submitting ? 'Verifikacija...' : 'Verifikuj nalog'}
        </button>
      </form>

      {message && <p className={styles.successText}>{message}</p>}
      {error && <p className={styles.errorText}>{error}</p>}

      <p className={styles.loginLink}>
        Već imate kod? <Link to="/login">Nazad na prijavu</Link>
      </p>
    </section>
  )
}

export default VerifyEmailPage
