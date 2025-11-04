import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import { Card } from '@/components/shared/Card'
import { AuthForm } from '@/components/forms/AuthForm'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/useToast'

type LocationState = {
  from?: Location
}

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const { user, login, isLoading, error, initialize, isInitialized } = useAuthStore((state) => ({
    user: state.user,
    login: state.login,
    isLoading: state.isLoading,
    error: state.error,
    initialize: state.initialize,
    isInitialized: state.isInitialized,
  }))

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (isInitialized && user) {
      navigate('/', { replace: true })
    }
  }, [isInitialized, user, navigate])

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await login(values)
      toast.success('Welcome back', 'You are now signed in.')
      const state = location.state as LocationState | undefined
      const destination = state?.from?.pathname ?? '/'
      navigate(destination, { replace: true })
    } catch {
      toast.error('Login failed', 'Check your credentials and try again.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-16">
      <Card
        title="Sign in to NovaUI"
        description="Use one of the demo accounts below to explore the dashboard."
      >
        <AuthForm onSubmit={handleSubmit} isSubmitting={isLoading} errorMessage={error} />
      </Card>
    </div>
  )
}
