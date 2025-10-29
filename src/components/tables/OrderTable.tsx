import type { Order, OrderStatus } from '@/types/order'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingState } from '@/components/shared/LoadingState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency, formatDate } from '@/utils/format'

type OrderTableProps = {
  items: Order[]
  isLoading?: boolean
  onStatusChange?: (id: string, status: OrderStatus) => void
}

const statusOrder: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
]

export const OrderTable = ({
  items,
  isLoading = false,
  onStatusChange,
}: OrderTableProps) => {
  if (isLoading) {
    return <LoadingState message="Fetching orders…" />
  }

  if (!items.length) {
    return (
      <EmptyState
        title="No orders yet"
        description="Orders will appear here once your team starts taking them."
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Order</th>
            <th className="px-4 py-3 font-semibold">Customer</th>
            <th className="px-4 py-3 font-semibold">Product</th>
            <th className="px-4 py-3 font-semibold">Qty</th>
            <th className="px-4 py-3 font-semibold">Total</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            {onStatusChange ? <th className="px-4 py-3 font-semibold">Actions</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {items.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium">#{order.id.slice(-6)}</td>
              <td className="px-4 py-3 text-slate-500">
                {order.user?.name ?? order.userId}
              </td>
              <td className="px-4 py-3 text-slate-500">
                {order.product?.name ?? order.productId}
              </td>
              <td className="px-4 py-3">{order.quantity}</td>
              <td className="px-4 py-3 text-slate-500">
                {formatCurrency(order.totalAmount)}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <StatusBadge status={order.status} />
                  <span className="text-xs text-slate-400">
                    {formatDate(order.updatedAt)}
                  </span>
                </div>
              </td>
              {onStatusChange ? (
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(event) =>
                      onStatusChange(order.id, event.target.value as OrderStatus)
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 outline-none ring-primary transition focus:ring-2"
                  >
                    {statusOrder.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
