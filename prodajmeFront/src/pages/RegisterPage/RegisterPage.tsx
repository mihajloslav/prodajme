import { Link } from 'react-router-dom'
import styles from './RegisterPage.module.css'

function RegisterPage() {
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

        <form className={styles.form}>
          <label className={styles.label} htmlFor="register-name">
            Ime i prezime
          </label>
          <input id="register-name" type="text" placeholder="Petar Petrović" />

          <label className={styles.label} htmlFor="register-email">
            E-mail adresa
          </label>
          <input id="register-email" type="email" placeholder="ime@email.com" />

          <label className={styles.label} htmlFor="register-password">
            Lozinka
          </label>
          <input id="register-password" type="password" placeholder="Unesite lozinku" />

          <label className={styles.label} htmlFor="register-password-repeat">
            Potvrdite lozinku
          </label>
          <input id="register-password-repeat" type="password" placeholder="Ponovite lozinku" />

          <button type="button" className={styles.primaryButton}>
            Kreiraj nalog
          </button>
        </form>

        <p className={styles.switchText}>
          Već imate nalog? <Link to="/login">Prijavite se</Link>
        </p>
      </div>
    </section>
  )
}

export default RegisterPage
