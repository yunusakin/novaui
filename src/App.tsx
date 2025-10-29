import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { PaymentPage } from '@/pages/PaymentPage'
import { ProductsPage } from '@/pages/ProductsPage'
import { UsersPage } from '@/pages/UsersPage'

export const App = () => (
  <Routes>
    <Route path="/" element={<AppLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="payment" element={<PaymentPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
)

export default App
