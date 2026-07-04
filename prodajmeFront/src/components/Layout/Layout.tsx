import type { ReactNode } from 'react'
import type { ProductCategory } from '../../api/productTypes'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
  categories: ProductCategory[]
}

function Layout({ children, categories }: LayoutProps) {
  return (
    <div className={styles.shell}>
      <Header />
      <div className={styles.body}>
        <Sidebar categories={categories} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  )
}

export default Layout
