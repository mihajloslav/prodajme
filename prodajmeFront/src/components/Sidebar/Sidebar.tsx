import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

const categories = [
  'Sve kategorije',
  'Automobili',
  'Nekretnine',
  'Tehnika',
  'Moj dom',
  'Lične stvari',
  'Posao',
  'Sport i hobi',
  'Poljoprivreda',
  'Ostalo',
]

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <p className={styles.sectionTitle}>Kategorije</p>
      <nav className={styles.navigation}>
        {categories.map((category) => (
          <NavLink
            key={category}
            to="/"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive && category === 'Sve kategorije' ? styles.active : ''}`
            }
          >
            {category}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
