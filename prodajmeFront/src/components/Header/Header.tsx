import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Header.module.css'

function Header() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (event: FormEvent) => {
    event.preventDefault()
    navigate('/', { state: { query: query.trim() } })
  }

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
        <Link to="/login" className={styles.ghostButton}>
          Prijava
        </Link>
        <Link to="/register" className={styles.primaryButton}>
          Registracija
        </Link>
      </nav>
    </header>
  )
}

export default Header
