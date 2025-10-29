import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
    <h3 className="text-base font-semibold text-slate-700">{title}</h3>
    {description ? (
      <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
    ) : null}
    {action ? <div className="mt-4">{action}</div> : null}
  </div>
)
