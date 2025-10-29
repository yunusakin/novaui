type StatCardProps = {
  title: string
  value: string | number
  helperText?: string
  tone?: 'primary' | 'success' | 'warning' | 'danger'
}

const toneStyles: Record<Required<StatCardProps>['tone'], string> = {
  primary: 'bg-blue-100 text-blue-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-700',
}

export const StatCard = ({
  title,
  value,
  helperText,
  tone = 'primary',
}: StatCardProps) => (
  <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <header className="flex items-center justify-between">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <span
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${toneStyles[tone]}`}
      >
        {title.slice(0, 1).toUpperCase()}
      </span>
    </header>
    <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
    {helperText ? (
      <p className="mt-2 text-sm text-slate-500">{helperText}</p>
    ) : null}
  </article>
)
