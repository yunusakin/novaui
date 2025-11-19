import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { LoadingState } from '@/components/shared/LoadingState'
import type { AuthRole } from '@/types/auth'

type ProtectedRouteProps = {
  roles?: AuthRole[]
  children: ReactNode
}

export const ProtectedRoute = ({ roles, children }: ProtectedRouteProps) => {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const isLoading = useAuthStore((state) => state.isLoading)
  const initialize = useAuthStore((state) => state.initialize)
  const hasRole = useAuthStore((state) => state.hasRole)

  useEffect(() => {
    initialize()
  }, [initialize])

  if (!isInitialized || isLoading) {
    return <LoadingState message="Verifying your session…" />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!hasRole(roles)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
