import { Link } from 'react-router-dom'
import styles from './LoginPage.module.css'

function LoginPage() {
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

        <form className={styles.form}>
          <label className={styles.label} htmlFor="login-email">
            E-mail adresa
          </label>
          <input id="login-email" type="email" placeholder="ime@email.com" />

          <label className={styles.label} htmlFor="login-password">
            Lozinka
          </label>
          <input id="login-password" type="password" placeholder="Unesite lozinku" />

          <div className={styles.utilityRow}>
            <label className={styles.rememberMe}>
              <input type="checkbox" />
              Zapamti me
            </label>
            <button type="button" className={styles.linkAction}>
              Zaboravili ste lozinku?
            </button>
          </div>

          <button type="button" className={styles.primaryButton}>
            Prijavi se
          </button>
        </form>
      </div>
    </section>
  )
}

export default LoginPage
