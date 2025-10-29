import type { User } from '@/types/user'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingState } from '@/components/shared/LoadingState'

type UserTableProps = {
  items: User[]
  isLoading?: boolean
}

export const UserTable = ({ items, isLoading = false }: UserTableProps) => {
  if (isLoading) {
    return <LoadingState message="Fetching users…" />
  }

  if (!items.length) {
    return (
      <EmptyState
        title="No users yet"
        description="Create your first user to get started."
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Email</th>
            <th className="px-4 py-3 font-semibold">Role</th>
            <th className="px-4 py-3 font-semibold">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {items.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium">{user.name}</td>
              <td className="px-4 py-3 text-slate-500">{user.email}</td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
