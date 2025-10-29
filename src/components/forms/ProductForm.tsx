import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { SaveProductDto } from '@/types/product'

type ProductFormProps = {
  onSubmit: (payload: SaveProductDto) => Promise<void> | void
  isSubmitting?: boolean
  errorMessage?: string | null
  validationErrors?: Record<string, string[]>
  defaultValues?: Partial<SaveProductDto>
  submitLabel?: string
}

const emptyForm: SaveProductDto = {
  name: '',
  price: 0,
  stock: 0,
}

export const ProductForm = ({
  onSubmit,
  isSubmitting = false,
  errorMessage,
  validationErrors,
  defaultValues,
  submitLabel = 'Save product',
}: ProductFormProps) => {
  const [form, setForm] = useState<SaveProductDto>(emptyForm)

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      ...defaultValues,
    }))
  }, [defaultValues])

  const handleChange = (
    field: keyof SaveProductDto,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === 'name' ? value : Number(value),
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit(form)
  }

  const fieldError = (field: keyof SaveProductDto) =>
    validationErrors?.[field]?.join(', ')

  return (
    <form
      className="grid grid-cols-1 gap-4 md:grid-cols-3"
      onSubmit={handleSubmit}
    >
      <label className="flex flex-col gap-1 md:col-span-2">
        <span className="text-sm font-medium text-slate-600">Product</span>
        <input
          value={form.name}
          onChange={(event) => handleChange('name', event.target.value)}
          placeholder="Nova Keyboard"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary transition focus:ring-2"
          required
        />
        {fieldError('name') ? (
          <span className="text-xs text-rose-600">{fieldError('name')}</span>
        ) : null}
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">Price</span>
        <input
          type="number"
          min={0}
          step={0.01}
          value={form.price}
          onChange={(event) => handleChange('price', event.target.value)}
          placeholder="199.99"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary transition focus:ring-2"
          required
        />
        {fieldError('price') ? (
          <span className="text-xs text-rose-600">{fieldError('price')}</span>
        ) : null}
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">Stock</span>
        <input
          type="number"
          min={0}
          value={form.stock}
          onChange={(event) => handleChange('stock', event.target.value)}
          placeholder="25"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary transition focus:ring-2"
          required
        />
        {fieldError('stock') ? (
          <span className="text-xs text-rose-600">{fieldError('stock')}</span>
        ) : null}
      </label>

      {errorMessage ? (
        <div className="md:col-span-3">
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
            {errorMessage}
          </p>
        </div>
      ) : null}

      <div className="mt-2 md:col-span-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
