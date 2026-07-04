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

    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      navigate('/', { replace: true })
      return
    }

    navigate(`/search?title=${encodeURIComponent(trimmedQuery)}`, { replace: false })
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
        <Link to="/" className={styles.logoLink}>
          <img src="/prodajmelogo.png" alt="ProdajMe" className={styles.logoImage} />
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
            <Link to="/profil" className={styles.userNameLink}>
              <span className={styles.userName}>{displayName}</span>
            </Link>
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
