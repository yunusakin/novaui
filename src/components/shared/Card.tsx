import type { PropsWithChildren, ReactNode } from 'react'
import { cn } from '@/utils/cn'

type CardProps = PropsWithChildren<{
  className?: string
  title?: string
  description?: string
  actions?: ReactNode
}>

export const Card = ({
  className,
  title,
  description,
  actions,
  children,
}: CardProps) => (
  <section
    className={cn(
      'rounded-xl border border-slate-200 bg-white p-6 shadow-sm',
      className,
    )}
  >
    {(title || description || actions) && (
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          {title && (
            <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-slate-500">{description}</p>
          )}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </header>
    )}
    <div>{children}</div>
  </section>
)
