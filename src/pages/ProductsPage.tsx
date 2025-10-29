import { useEffect, useState } from 'react'
import { Card } from '@/components/shared/Card'
import { ProductForm } from '@/components/forms/ProductForm'
import { ProductTable } from '@/components/tables/ProductTable'
import { useNovaStore } from '@/store/novaStore'
import { useToast } from '@/hooks/useToast'
import type { Product } from '@/types/product'
import type { ApiError } from '@/types/common'

export const ProductsPage = () => {
  const {
    products,
    loading,
    mutations,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useNovaStore((state) => ({
    products: state.products,
    loading: state.loading.products,
    mutations: state.mutations.product,
    fetchProducts: state.fetchProducts,
    createProduct: state.createProduct,
    updateProduct: state.updateProduct,
    deleteProduct: state.deleteProduct,
  }))

  const toast = useToast()
  const [editing, setEditing] = useState<Product | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >()
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    if (!products.length) {
      void fetchProducts()
    }
  }, [products.length, fetchProducts])

  const handleSubmit = async (payload: Parameters<typeof createProduct>[0]) => {
    setErrorMessage(null)
    setValidationErrors(undefined)

    try {
      if (editing) {
        const response = await updateProduct(editing.id, payload)
        if (!response.success) {
          setErrorMessage(response.message)
          toast.error('Unable to update product', response.message)
        } else {
          setEditing(null)
          toast.success('Product updated', response.message)
          setFormKey((value) => value + 1)
        }
        return
      }

      const response = await createProduct(payload)
      if (!response.success) {
        setErrorMessage(response.message)
        toast.error('Unable to save product', response.message)
        return
      }
      toast.success('Product created', response.message)
      setFormKey((value) => value + 1)
    } catch (error) {
      const apiError = error as ApiError
      setErrorMessage(apiError.message)
      setValidationErrors(apiError.details)
      toast.error('Product operation failed', apiError.message)
    }
  }

  const handleEdit = (product: Product) => {
    setEditing(product)
    setErrorMessage(null)
    setValidationErrors(undefined)
    setFormKey((value) => value + 1)
  }

  const handleDelete = async (product: Product) => {
    const confirmDeletion = window.confirm(
      `Delete ${product.name}? This action cannot be undone.`,
    )
    if (!confirmDeletion) return

    setErrorMessage(null)
    try {
      const response = await deleteProduct(product.id)
      if (!response.success) {
        setErrorMessage(response.message)
        toast.error('Unable to delete product', response.message)
        return
      }
      toast.success('Product deleted', response.message)
    } catch (error) {
      const apiError = error as ApiError
      setErrorMessage(apiError.message)
      toast.error('Product deletion failed', apiError.message)
    }
  }

  const handleCancelEdit = () => {
    setEditing(null)
    setErrorMessage(null)
    setValidationErrors(undefined)
  }

  return (
    <div className="space-y-6">
      <Card
        title={editing ? 'Update product' : 'Add product'}
        description="Manage products available for ordering"
        actions={
          editing ? (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel edit
            </button>
          ) : undefined
        }
      >
        <ProductForm
          key={formKey}
          onSubmit={handleSubmit}
          isSubmitting={mutations}
          errorMessage={errorMessage}
          validationErrors={validationErrors}
          defaultValues={editing ?? undefined}
          submitLabel={editing ? 'Update product' : 'Save product'}
        />
      </Card>

      <Card title="Products" description="Current inventory list">
        <ProductTable
          items={products}
          isLoading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>
    </div>
  )
}
