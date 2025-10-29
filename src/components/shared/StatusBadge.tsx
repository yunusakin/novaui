import type { OrderStatus } from '@/types/order'
import { cn } from '@/utils/cn'

const statusStyles: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
  COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-rose-100 text-rose-700 border-rose-200',
}

type StatusBadgeProps = {
  status: OrderStatus
}

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
      statusStyles[status],
    )}
  >
    {status}
  </span>
)
