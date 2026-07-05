import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import type { ProductCategory } from '../../api/productTypes'
import { CategoryIcon } from '../../utils/categoryIcons'
import styles from './Header.module.css'

interface HeaderProps {
  categories: ProductCategory[]
}

function Header({ categories }: HeaderProps) {
  const [query, setQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { currentUser, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

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
    setIsMenuOpen(false)
    navigate('/')
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
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

            <div className={styles.actionsSecondary}>
              <Link to="/moji-oglasi" className={styles.ghostButton}>
                Moji oglasi
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
                          <div className={styles.actionsPrimary}>
              <Link to="/postavi-oglas" className={styles.primaryButton}>
                + &nbsp;Postavi oglas
              </Link>
              <Link to="/profil" className={styles.primaryButton}>
                {displayName}
              </Link>
            </div>
              <button type="button" className={styles.logoutButton} onClick={handleLogout}>
                Odjavi se
              </button>
            </div>
          </>
        )}
      </nav>

      <button
        type="button"
        className={styles.menuButton}
        aria-label={isMenuOpen ? 'Zatvori meni' : 'Otvori meni'}
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {isMenuOpen && (
        <>
          <button type="button" className={styles.menuBackdrop} aria-label="Zatvori meni" onClick={closeMenu} />
          <aside className={styles.mobileMenu}>
            <div className={styles.menuSection}>
              <p className={styles.menuSectionTitle}>Kategorije</p>
              <nav className={styles.menuNav}>
                <Link to="/" className={styles.menuNavLink} onClick={closeMenu}>
                  Sve kategorije
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/categories/${category.id}`}
                    className={styles.menuNavLink}
                    onClick={closeMenu}
                  >
                    <CategoryIcon categoryName={category.name} size={18} className={styles.menuNavIcon} />
                    {category.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className={styles.menuSection}>
              <p className={styles.menuSectionTitle}>Nalog</p>
              <nav className={styles.menuNav}>
                {!isAuthenticated && (
                  <>
                    <Link to="/login" className={styles.menuNavLink} onClick={closeMenu}>
                      Prijava
                    </Link>
                    <Link to="/register" className={styles.menuNavLink} onClick={closeMenu}>
                      Registracija
                    </Link>
                  </>
                )}

                {isAuthenticated && (
                  <>
                    <Link to="/profil" className={styles.menuNavLink} onClick={closeMenu}>
                      {displayName}
                    </Link>
                    <Link to="/poruke" className={styles.menuNavLink} onClick={closeMenu}>
                      Poruke
                    </Link>
                    <Link to="/omiljeni" className={styles.menuNavLink} onClick={closeMenu}>
                      Omiljeni oglasi
                    </Link>
                    <Link to="/kupovine" className={styles.menuNavLink} onClick={closeMenu}>
                      Moje kupovine
                    </Link>
                    <Link to="/postavi-oglas" className={styles.menuNavLink} onClick={closeMenu}>
                      Postavi oglas
                    </Link>
                    <Link to="/moji-oglasi" className={styles.menuNavLink} onClick={closeMenu}>
                      Moji oglasi
                    </Link>
                    <button type="button" className={styles.menuLogoutButton} onClick={handleLogout}>
                      Odjavi se
                    </button>
                  </>
                )}
              </nav>
            </div>
          </aside>
        </>
      )}
    </header>
  )
}

export default Header
