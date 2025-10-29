import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { CreateOrderDto } from '@/types/order'
import type { Product } from '@/types/product'
import type { User } from '@/types/user'

type OrderFormProps = {
  users: User[]
  products: Product[]
  onSubmit: (payload: CreateOrderDto) => Promise<void> | void
  isSubmitting?: boolean
  errorMessage?: string | null
  validationErrors?: Record<string, string[]>
  defaultValues?: Partial<CreateOrderDto>
}

const emptyForm: CreateOrderDto = {
  userId: '',
  productId: '',
  quantity: 1,
}

export const OrderForm = ({
  users,
  products,
  onSubmit,
  isSubmitting = false,
  errorMessage,
  validationErrors,
  defaultValues,
}: OrderFormProps) => {
  const [form, setForm] = useState<CreateOrderDto>(emptyForm)

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      ...defaultValues,
    }))
  }, [defaultValues])

  const handleChange = <Field extends keyof CreateOrderDto>(
    field: Field,
    value: CreateOrderDto[Field],
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit({
      ...form,
      quantity: Number(form.quantity),
    })
  }

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === form.productId),
    [products, form.productId],
  )

  const total = useMemo(() => {
    if (!selectedProduct) return 0
    return selectedProduct.price * Number(form.quantity || 0)
  }, [selectedProduct, form.quantity])

  const fieldError = (field: keyof CreateOrderDto) =>
    validationErrors?.[field]?.join(', ')

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-1 md:col-span-1">
          <span className="text-sm font-medium text-slate-600">Customer</span>
          <select
            value={form.userId}
            onChange={(event) => handleChange('userId', event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary transition focus:ring-2"
            required
          >
            <option value="">Select user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {fieldError('userId') ? (
            <span className="text-xs text-rose-600">{fieldError('userId')}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1 md:col-span-1">
          <span className="text-sm font-medium text-slate-600">Product</span>
          <select
            value={form.productId}
            onChange={(event) => handleChange('productId', event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary transition focus:ring-2"
            required
          >
            <option value="">Select product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          {fieldError('productId') ? (
            <span className="text-xs text-rose-600">
              {fieldError('productId')}
            </span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1 md:col-span-1">
          <span className="text-sm font-medium text-slate-600">Quantity</span>
          <input
            type="number"
            min={1}
            value={form.quantity}
            onChange={(event) => handleChange('quantity', Number(event.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary transition focus:ring-2"
            required
          />
          {fieldError('quantity') ? (
            <span className="text-xs text-rose-600">
              {fieldError('quantity')}
            </span>
          ) : null}
        </label>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-slate-600">Total amount</p>
          <p className="text-sm text-slate-500">
            {selectedProduct ? `× ${selectedProduct.price.toFixed(2)}` : 'Select a product'}
          </p>
        </div>
        <p className="text-2xl font-semibold text-slate-900">
          ${total.toFixed(2)}
        </p>
      </div>

      {errorMessage ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
          {errorMessage}
        </p>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSubmitting ? 'Creating…' : 'Create order'}
        </button>
      </div>
    </form>
  )
}
