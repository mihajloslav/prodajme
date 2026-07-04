import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Header.module.css'

function Header() {
  const [query, setQuery] = useState('')
  const { currentUser, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleSearch = (event: FormEvent) => {
    event.preventDefault()
    navigate('/', { state: { query: query.trim() } })
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const displayName =
    currentUser?.name ||
    currentUser?.username ||
    currentUser?.email ||
    'Korisnik'

  return (
    <header className={styles.header}>
      <div className={styles.branding}>
        <div className={styles.logoMark}>P</div>
        <Link to="/" className={styles.logoText}>
          ProdajMe
        </Link>
      </div>

      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Pretražite proizvode..."
          className={styles.searchInput}
        />
        <select className={styles.regionSelect} defaultValue="Srbija" aria-label="Region">
          <option value="Srbija">Srbija</option>
        </select>
        <button type="submit" className={styles.searchButton}>
          Pretraži
        </button>
      </form>

      <nav className={styles.actions}>
        {!isAuthenticated && (
          <>
            <Link to="/login" className={styles.ghostButton}>
              Prijava
            </Link>
            <Link to="/register" className={styles.primaryButton}>
              Registracija
            </Link>
          </>
        )}

        {isAuthenticated && (
          <>
            <span className={styles.userName}>{displayName}</span>
            <Link to="/poruke" className={styles.ghostButton}>
              Poruke
            </Link>
            <Link to="/omiljeni" className={styles.ghostButton}>
              Omiljeni oglasi
            </Link>
            <Link to="/kupovine" className={styles.ghostButton}>
              Moje kupovine
            </Link>
            <Link to="/postavi-oglas" className={styles.primaryButton}>
              Postavi oglas
            </Link>
            <Link to="/moji-oglasi" className={styles.ghostButton}>
              Moji oglasi
            </Link>
            <button type="button" className={styles.logoutButton} onClick={handleLogout}>
              Odjavi se
            </button>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header
