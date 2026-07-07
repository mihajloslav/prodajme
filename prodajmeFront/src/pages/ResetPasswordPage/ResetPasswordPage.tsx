import { useEffect, useState } from 'react'
import type { FormEventHandler } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { AxiosError } from 'axios'
import { resetPassword } from '../../api/auth/authApi'
import styles from './ResetPasswordPage.module.css'

function ResetPasswordPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const stateEmail = (location.state as { email?: string; message?: string } | null)?.email
  const initialMessage = (location.state as { email?: string; message?: string } | null)?.message ?? ''
  const queryEmail = new URLSearchParams(location.search).get('email') ?? ''

  const [email, setEmail] = useState(stateEmail || queryEmail)
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [message, setMessage] = useState(initialMessage)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setMessage(initialMessage)
  }, [initialMessage])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    if (!email.trim() || !code.trim() || !newPassword || !confirmPassword) {
      setError('Sva polja su obavezna.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Lozinke se ne podudaraju.')
      return
    }

    if (!/^(?=.*[A-Z])(?=.*\d).{7,}$/.test(newPassword)) {
      setError('Lozinka mora imati najmanje 7 karaktera, najmanje jedno veliko slovo i najmanje jedan broj.')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      setMessage('')

      await resetPassword({
        email: email.trim(),
        code: code.trim(),
        newPassword,
      })

      setMessage('Lozinka je uspešno promenjena. Preusmeravanje na prijavu...')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (caughtError) {
      const error = caughtError as AxiosError<{ message?: string }>
      const backendMessage = error.response?.data?.message
      setError(backendMessage || 'Promena lozinke nije uspela. Proverite verifikacioni kod.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={styles.page}>
      <h1>Resetovanje lozinke</h1>

      <p className={styles.description}>
        Unesite Vašu e-mail adresu, verifikacioni kod i novu lozinku kako biste je promenili.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="reset-email">
          E-mail adresa
        </label>
        <input
          id="reset-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="ime@email.com"
          required
        />

        <label className={styles.label} htmlFor="reset-code">
          Verifikacioni kod
        </label>
        <input
          id="reset-code"
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Unesite šestocifreni kod"
          required
        />

        <label className={styles.label} htmlFor="reset-new-password">
          Nova lozinka
        </label>
        <input
          id="reset-new-password"
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="Unesite novu lozinku"
          required
        />

        <label className={styles.label} htmlFor="reset-confirm-password">
          Potvrdite novu lozinku
        </label>
        <input
          id="reset-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Ponovite novu lozinku"
          required
        />

        <button type="submit" className={styles.primaryButton} disabled={submitting}>
          {submitting ? 'Promena...' : 'Promeni lozinku'}
        </button>
      </form>

      {message && <p className={styles.successText}>{message}</p>}
      {error && <p className={styles.errorText}>{error}</p>}

      <p className={styles.loginLink}>
        Vrati se na <Link to="/login">prijavu</Link>
      </p>
    </section>
  )
}

export default ResetPasswordPage
