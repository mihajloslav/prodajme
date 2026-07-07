import { useState } from 'react'
import type { FormEventHandler } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { AxiosError } from 'axios'
import { forgotPassword } from '../../api/auth/authApi'
import styles from './ForgotPasswordPage.module.css'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    try {
      setSubmitting(true)
      setError('')

      await forgotPassword(email.trim())

      navigate('/reset-password', {
        state: {
          email: email.trim(),
          message: 'Verifikacioni kod je poslat na Vašu email adresu.'
        }
      })
    } catch (caughtError) {
      const error = caughtError as AxiosError<{ message?: string }>
      const backendMessage = error.response?.data?.message
      setError(backendMessage || 'Slanje koda nije uspelo. Proverite unetu email adresu.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={styles.page}>
      <h1>Zaboravljena lozinka</h1>

      <p className={styles.description}>
        Unesite Vašu e-mail adresu i poslaćemo Vam verifikacioni kod za obnovu lozinke.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="forgot-email">
          E-mail adresa
        </label>
        <input
          id="forgot-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="ime@email.com"
          required
        />

        <button type="submit" className={styles.primaryButton} disabled={submitting}>
          {submitting ? 'Slanje...' : 'Pošalji kod'}
        </button>
      </form>

      {error && <p className={styles.errorText}>{error}</p>}

      <p className={styles.loginLink}>
        Vrati se na <Link to="/login">prijavu</Link>
      </p>
    </section>
  )
}

export default ForgotPasswordPage
