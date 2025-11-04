import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { PaymentPage } from '@/pages/PaymentPage'
import { ProductsPage } from '@/pages/ProductsPage'
import { UsersPage } from '@/pages/UsersPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { UnauthorizedPage } from '@/pages/UnauthorizedPage'

export const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/unauthorized" element={<UnauthorizedPage />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route
        index
        element={
          <ProtectedRoute roles={['ADMIN', 'STAFF']}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="users"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="products"
        element={
          <ProtectedRoute roles={['ADMIN', 'STAFF']}>
            <ProductsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="orders"
        element={
          <ProtectedRoute roles={['ADMIN', 'STAFF', 'COURIER']}>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="payment"
        element={
          <ProtectedRoute roles={['ADMIN', 'STAFF']}>
            <PaymentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
)

export default App
