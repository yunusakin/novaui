import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/shared/Card'
import { OrderForm } from '@/components/forms/OrderForm'
import { OrderTable } from '@/components/tables/OrderTable'
import { useNovaStore } from '@/store/novaStore'
import { useToast } from '@/hooks/useToast'
import type { ApiError } from '@/types/common'
import type { OrderStatus } from '@/types/order'

export const OrdersPage = () => {
  const {
    users,
    products,
    orders,
    loading,
    mutations,
    fetchUsers,
    fetchProducts,
    fetchOrders,
    createOrder,
    updateOrderStatus,
  } = useNovaStore((state) => ({
    users: state.users,
    products: state.products,
    orders: state.orders,
    loading: state.loading.orders,
    mutations: state.mutations.order,
    fetchUsers: state.fetchUsers,
    fetchProducts: state.fetchProducts,
    fetchOrders: state.fetchOrders,
    createOrder: state.createOrder,
    updateOrderStatus: state.updateOrderStatus,
  }))

  const toast = useToast()
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null)
  const [tableErrorMessage, setTableErrorMessage] = useState<string | null>(
    null,
  )
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >()
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    if (!users.length) {
      void fetchUsers()
    }
  }, [users.length, fetchUsers])

  useEffect(() => {
    if (!products.length) {
      void fetchProducts()
    }
  }, [products.length, fetchProducts])

  useEffect(() => {
    if (!orders.length) {
      void fetchOrders()
    }
  }, [orders.length, fetchOrders])

  const handleSubmit = async (payload: Parameters<typeof createOrder>[0]) => {
    setFormErrorMessage(null)
    setValidationErrors(undefined)

    try {
      const response = await createOrder(payload)
      if (!response.success) {
        setFormErrorMessage(response.message)
        toast.error('Unable to create order', response.message)
        return
      }
      toast.success('Order created', response.message)
      setFormKey((value) => value + 1)
    } catch (error) {
      const apiError = error as ApiError
      setFormErrorMessage(apiError.message)
      setValidationErrors(apiError.details)
      toast.error('Order creation failed', apiError.message)
    }
  }

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    setTableErrorMessage(null)
    try {
      const response = await updateOrderStatus(id, status)
      if (!response.success) {
        setTableErrorMessage(response.message)
        toast.error('Unable to update order', response.message)
        return
      }
      toast.info('Order updated', `Status changed to ${status}`)
    } catch (error) {
      const apiError = error as ApiError
      setTableErrorMessage(apiError.message)
      toast.error('Order update failed', apiError.message)
    }
  }

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [orders],
  )

  return (
    <div className="space-y-6">
      <Card
        title="Create order"
        description="Combine users and products to create new orders"
      >
        <OrderForm
          key={formKey}
          users={users}
          products={products}
          onSubmit={handleSubmit}
          isSubmitting={mutations}
          errorMessage={formErrorMessage}
          validationErrors={validationErrors}
        />
      </Card>

      <Card title="Orders" description="Track order status across services">
        {tableErrorMessage ? (
          <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
            {tableErrorMessage}
          </p>
        ) : null}
        <OrderTable
          items={sortedOrders}
          isLoading={loading}
          onStatusChange={handleStatusChange}
        />
      </Card>
    </div>
  )
}
