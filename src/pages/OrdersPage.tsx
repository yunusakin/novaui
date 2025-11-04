import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/shared/Card'
import { OrderForm } from '@/components/forms/OrderForm'
import { OrderTable } from '@/components/tables/OrderTable'
import { useNovaStore } from '@/store/novaStore'
import { useAuthStore } from '@/store/authStore'
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
    usersError,
    productsError,
    ordersError,
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
    usersError: state.errors.users,
    productsError: state.errors.products,
    ordersError: state.errors.orders,
  }))

  const role = useAuthStore((state) => state.user?.role)
  const canManageOrders = role === 'ADMIN' || role === 'STAFF'

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
    if (!canManageOrders) return
    if (!users.length) {
      void fetchUsers()
    }
  }, [users.length, fetchUsers, canManageOrders])

  useEffect(() => {
    if (!canManageOrders) return
    if (!products.length) {
      void fetchProducts()
    }
  }, [products.length, fetchProducts, canManageOrders])

  useEffect(() => {
    if (!orders.length) {
      void fetchOrders()
    }
  }, [orders.length, fetchOrders])

  const handleUsersRetry = () => {
    if (!canManageOrders) return
    void fetchUsers()
  }

  const handleProductsRetry = () => {
    if (!canManageOrders) return
    void fetchProducts()
  }

  const handleOrdersRetry = () => {
    void fetchOrders()
  }

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
      {canManageOrders ? (
        <Card
          title="Create order"
          description="Combine users and products to create new orders"
        >
          {usersError ? (
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
              <span>{usersError}</span>
              <button
                type="button"
                onClick={handleUsersRetry}
                className="inline-flex items-center rounded border border-rose-300 px-2 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
              >
                Retry users
              </button>
            </div>
          ) : null}
          {productsError ? (
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
              <span>{productsError}</span>
              <button
                type="button"
                onClick={handleProductsRetry}
                className="inline-flex items-center rounded border border-rose-300 px-2 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
              >
                Retry products
              </button>
            </div>
          ) : null}
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
      ) : (
        <Card
          title="Orders overview"
          description="Couriers can review order status and delivery progress."
        >
          <p className="text-sm text-slate-600">
            Order creation is limited to admin and staff roles. You can still monitor the status of
            assigned deliveries below.
          </p>
        </Card>
      )}

      <Card title="Orders" description="Track order status across services">
        {ordersError ? (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
            <span>{ordersError}</span>
            <button
              type="button"
              onClick={handleOrdersRetry}
              className="inline-flex items-center rounded border border-rose-300 px-2 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
            >
              Retry orders
            </button>
          </div>
        ) : null}
        {tableErrorMessage ? (
          <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
            {tableErrorMessage}
          </p>
        ) : null}
        <OrderTable
          items={sortedOrders}
          isLoading={loading}
          onStatusChange={canManageOrders ? handleStatusChange : undefined}
        />
      </Card>
    </div>
  )
}
