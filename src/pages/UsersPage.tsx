import { useEffect, useState } from 'react'
import { Card } from '@/components/shared/Card'
import { UserForm } from '@/components/forms/UserForm'
import { UserTable } from '@/components/tables/UserTable'
import { useNovaStore } from '@/store/novaStore'
import { useToast } from '@/hooks/useToast'
import type { ApiError } from '@/types/common'

export const UsersPage = () => {
  const { users, loading, mutations, fetchUsers, createUser } = useNovaStore(
    (state) => ({
      users: state.users,
      loading: state.loading.users,
      mutations: state.mutations.user,
      fetchUsers: state.fetchUsers,
      createUser: state.createUser,
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
        <UserTable items={users} isLoading={loading} />
      </Card>
    </div>
  )
}
