import type { Product } from '@/types/product'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingState } from '@/components/shared/LoadingState'
import { formatCurrency, formatDate } from '@/utils/format'

type ProductTableProps = {
  items: Product[]
  isLoading?: boolean
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
}

export const ProductTable = ({
  items,
  isLoading = false,
  onEdit,
  onDelete,
}: ProductTableProps) => {
  if (isLoading) {
    return <LoadingState message="Fetching products…" />
  }

  if (!items.length) {
    return (
      <EmptyState
        title="No products available"
        description="Add products to make them available for ordering."
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Product</th>
            <th className="px-4 py-3 font-semibold">Price</th>
            <th className="px-4 py-3 font-semibold">Stock</th>
            <th className="px-4 py-3 font-semibold">Updated</th>
            {(onEdit || onDelete) && <th className="px-4 py-3 font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {items.map((product) => (
            <tr key={product.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium">{product.name}</td>
              <td className="px-4 py-3 text-slate-500">
                {formatCurrency(product.price)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex min-w-[3rem] items-center justify-center rounded-full px-2 py-1 text-xs font-semibold ${
                    product.stock <= 5
                      ? 'bg-rose-100 text-rose-600'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {product.stock}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-500">
                {formatDate(product.updatedAt)}
              </td>
              {(onEdit || onDelete) && (
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    {onEdit ? (
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                      >
                        Edit
                      </button>
                    ) : null}
                    {onDelete ? (
                      <button
                        type="button"
                        onClick={() => onDelete(product)}
                        className="rounded-md border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
