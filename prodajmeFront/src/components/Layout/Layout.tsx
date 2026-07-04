import type { ReactNode } from 'react'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.shell}>
      <Header />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  )
}

export default Layout
