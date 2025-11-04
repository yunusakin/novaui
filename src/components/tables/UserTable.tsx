import type { User } from '@/types/user'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingState } from '@/components/shared/LoadingState'

type UserTableProps = {
  items: User[]
  isLoading?: boolean
  onDelete?: (user: User) => void
  isMutating?: boolean
}

export const UserTable = ({
  items,
  isLoading = false,
  onDelete,
  isMutating = false,
}: UserTableProps) => {
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
            {onDelete ? <th className="px-4 py-3 font-semibold">Actions</th> : null}
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
              {onDelete ? (
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onDelete(user)}
                    disabled={isMutating}
                    className="rounded-md border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Delete
                  </button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
