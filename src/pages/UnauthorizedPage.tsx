import { Link } from 'react-router-dom'
import { Card } from '@/components/shared/Card'
import { useAuthStore } from '@/store/authStore'

export const UnauthorizedPage = () => {
  const role = useAuthStore((state) => state.user?.role)

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-16">
      <Card
        title="Access restricted"
        description={
          role
            ? `Your role (${role}) does not grant access to this section.`
            : 'Sign in to access the requested page.'
        }
        actions={
          <Link
            to="/"
            className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
          >
            Go to dashboard
          </Link>
        }
      >
        <p className="text-sm text-slate-600">
          Need additional permissions? Contact your Nova administrator to request access or switch
          accounts.
        </p>
      </Card>
    </div>
  )
}
