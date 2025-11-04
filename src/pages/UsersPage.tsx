import { useEffect, useState } from 'react'
import { Card } from '@/components/shared/Card'
import { UserForm } from '@/components/forms/UserForm'
import { UserTable } from '@/components/tables/UserTable'
import { useNovaStore } from '@/store/novaStore'
import { useToast } from '@/hooks/useToast'
import type { ApiError } from '@/types/common'
import type { User } from '@/types/user'

export const UsersPage = () => {
  const { users, loading, mutations, fetchUsers, createUser, deleteUser, error } = useNovaStore(
    (state) => ({
      users: state.users,
      loading: state.loading.users,
      error: state.errors.users,
      mutations: state.mutations.user,
      fetchUsers: state.fetchUsers,
      createUser: state.createUser,
      deleteUser: state.deleteUser,
    }),
  )
  const toast = useToast()
  const [formKey, setFormKey] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >()

  useEffect(() => {
    if (!users.length) {
      void fetchUsers()
    }
  }, [users.length, fetchUsers])

  const handleRetry = () => {
    void fetchUsers()
  }

  const handleDelete = async (user: User) => {
    const confirmDeletion = window.confirm(
      `Delete ${user.name}? This action cannot be undone.`,
    )
    if (!confirmDeletion) return

    try {
      const response = await deleteUser(user.id)
      if (!response.success) {
        toast.error('Unable to delete user', response.message)
        return
      }
      toast.success('User deleted', response.message)
    } catch (error) {
      const apiError = error as ApiError
      toast.error('User deletion failed', apiError.message)
    }
  }

  const handleSubmit = async (payload: Parameters<typeof createUser>[0]) => {
    setErrorMessage(null)
    setValidationErrors(undefined)

    try {
      const response = await createUser(payload)
      if (!response.success) {
        setErrorMessage(response.message)
        toast.error('Unable to create user', response.message)
        return
      }

      toast.success('User created', response.message)
      setFormKey((value) => value + 1)
    } catch (error) {
      const apiError = error as ApiError
      setErrorMessage(apiError.message)
      setValidationErrors(apiError.details)
      toast.error('User creation failed', apiError.message)
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Create user" description="Register a new Nova customer">
        <UserForm
          key={formKey}
          onSubmit={handleSubmit}
          isSubmitting={mutations}
          errorMessage={errorMessage}
          validationErrors={validationErrors}
        />
      </Card>

      <Card
        title="Users"
        description="Manage all users connected to the Nova platform"
      >
        {error ? (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
            <span>{error}</span>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center rounded border border-rose-300 px-2 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
            >
              Retry
            </button>
          </div>
        ) : null}
        <UserTable
          items={users}
          isLoading={loading}
          onDelete={handleDelete}
          isMutating={mutations}
        />
      </Card>
    </div>
  )
}
