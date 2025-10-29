import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '@/components/shared/Card'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingState } from '@/components/shared/LoadingState'
import { StatCard } from '@/components/shared/StatCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { useNovaStore } from '@/store/novaStore'
import { formatCurrency, formatDate } from '@/utils/format'

const aggregateOrdersByDate = (orders: ReturnType<typeof useNovaStore.getState>['orders']) => {
  const grouped = orders.reduce<Record<string, number>>((acc, order) => {
    const dateKey = formatDate(order.createdAt)
    acc[dateKey] = (acc[dateKey] ?? 0) + order.totalAmount
    return acc
  }, {})

  return Object.entries(grouped).map(([date, total]) => ({ date, total }))
}

export const DashboardPage = () => {
  const { users, products, orders, loading } = useNovaStore((state) => ({
    users: state.users,
    products: state.products,
    orders: state.orders,
    loading: state.loading,
  }))

  const lowStockProducts = useMemo(
    () => products.filter((product) => product.stock <= 5),
    [products],
  )

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + order.totalAmount, 0),
    [orders],
  )

  const chartData = useMemo(() => aggregateOrdersByDate(orders), [orders])
  const recentOrders = useMemo(() => orders.slice(0, 5), [orders])

  const isLoading = loading.users || loading.products || loading.orders

  if (isLoading && !users.length && !products.length && !orders.length) {
    return <LoadingState message="Preparing analytics…" />
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Users"
          value={users.length}
          helperText="Registered customers"
        />
        <StatCard
          title="Products"
          value={products.length}
          helperText="Active catalogue"
          tone="success"
        />
        <StatCard
          title="Orders"
          value={orders.length}
          helperText="Lifetime orders"
          tone="warning"
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(totalRevenue)}
          helperText="Gross sales"
          tone="danger"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card title="Revenue trend" description="Daily gross order value">
          {chartData.length ? (
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 10 }}>
                  <defs>
                    <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    tickFormatter={(value) => `$${value / 1000}k`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fill="url(#revenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              title="No orders yet"
              description="Revenue chart will appear once orders are placed."
            />
          )}
        </Card>

        <Card
          title="Low stock"
          description="Products with five units or fewer"
        >
          {lowStockProducts.length ? (
            <ul className="divide-y divide-slate-100">
              {lowStockProducts.map((product) => (
                <li key={product.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-slate-700">{product.name}</p>
                    <p className="text-xs text-slate-500">
                      Updated {formatDate(product.updatedAt)}
                    </p>
                  </div>
                  <span className="inline-flex min-w-[3rem] justify-center rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">
                    {product.stock}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="Inventory healthy"
              description="All products have more than five units in stock."
            />
          )}
        </Card>
      </section>

      <Card title="Recent orders" description="Latest activity across your services">
        {recentOrders.length ? (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 font-medium">#{order.id.slice(-6)}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {order.user?.name ?? order.userId}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {order.product?.name ?? order.productId}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatCurrency(order.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="Nothing here yet"
            description="Orders will show here as soon as they are created."
          />
        )}
      </Card>
    </div>
  )
}
