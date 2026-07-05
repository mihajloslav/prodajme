import { NavLink } from 'react-router-dom'
import type { ProductCategory } from '../../api/productTypes'
import { CategoryIcon } from '../../utils/categoryIcons'
import styles from './Sidebar.module.css'

interface SidebarProps {
  categories: ProductCategory[]
}

function Sidebar({ categories }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <p className={styles.sectionTitle}>Kategorije</p>
      <nav className={styles.navigation}>
        {/* <NavLink
          to="/"
          end
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          Sve kategorije
        </NavLink>*/}

        {categories.map((category) => (
          <NavLink
            key={category.id}
            to={`/categories/${category.id}`}
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <CategoryIcon categoryName={category.name} size={18} className={styles.icon} />
            {category.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
