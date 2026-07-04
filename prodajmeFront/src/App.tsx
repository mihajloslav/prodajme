import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { getCategories } from './api/categoriesApi'
import type { ProductCategory } from './api/productTypes'
import Layout from './components/Layout/Layout'
import { useAuth } from './context/AuthContext'
import CategoryProductsPage from './pages/CategoryProductsPage/CategoryProductsPage'
import HomePage from './pages/HomePage/HomePage'
import LoginPage from './pages/LoginPage/LoginPage'
import PostAdPage from './pages/PostAdPage/PostAdPage'
import ProductDetailsPage from './pages/ProductDetailsPage/ProductDetailsPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage/VerifyEmailPage'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <section>
      <h1>{title}</h1>
      <p>Stranica je pripremljena i biće povezana u sledećem koraku.</p>
    </section>
  )
}

function App() {
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch {
        setCategories([])
      }
    }

    void loadCategories()
  }, [])

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout categories={categories}>
            <HomePage categories={categories} />
          </Layout>
        }
      />
      <Route
        path="/categories/:categoryId"
        element={
          <Layout categories={categories}>
            <CategoryProductsPage categories={categories} />
          </Layout>
        }
      />
      <Route
        path="/products/:id"
        element={
          <Layout categories={categories}>
            <ProductDetailsPage />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <Layout categories={categories}>
            <LoginPage />
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout categories={categories}>
            <RegisterPage />
          </Layout>
        }
      />
      <Route
        path="/verify-email"
        element={
          <Layout categories={categories}>
            <VerifyEmailPage />
          </Layout>
        }
      />
      <Route
        path="/postavi-oglas"
        element={
          isAuthenticated ? (
            <Layout categories={categories}>
              <PostAdPage categories={categories} />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/moji-oglasi"
        element={
          <Layout categories={categories}>
            <PlaceholderPage title="Moji oglasi" />
          </Layout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
