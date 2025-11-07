import { Card } from '@/components/shared/Card'
import { useAuthStore } from '@/store/authStore'

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card title="Your profile" description="Account information for your current session">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Name</dt>
            <dd className="text-sm font-medium text-slate-900">{user.name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">E-mail</dt>
            <dd className="text-sm font-medium text-slate-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Role</dt>
            <dd className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
              {user.role}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Token storage</dt>
            <dd className="text-sm font-medium text-slate-900">Session storage (mock)</dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}
