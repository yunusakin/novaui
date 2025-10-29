import { useEffect } from 'react'
import { useToastStore } from '@/store/toastStore'
import { cn } from '@/utils/cn'

const toneStyles = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  error: 'border-rose-200 bg-rose-50 text-rose-700',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
}

const ToastItem = ({ id, title, description, type = 'info' }: ReturnType<typeof useToastStore.getState>['toasts'][number]) => {
  const dismiss = useToastStore((state) => state.dismiss)

  useEffect(() => {
    const timer = window.setTimeout(() => dismiss(id), 4000)
    return () => window.clearTimeout(timer)
  }, [dismiss, id])

  return (
    <div
      className={cn(
        'w-full max-w-sm rounded-xl border px-4 py-3 shadow-lg shadow-slate-900/10',
        toneStyles[type],
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          {description ? (
            <p className="mt-1 text-sm opacity-80">{description}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => dismiss(id)}
          className="rounded-md border border-transparent px-2 py-1 text-xs font-semibold transition hover:border-current"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export const ToastViewport = () => {
  const toasts = useToastStore((state) => state.toasts)

  return (
    <div className="pointer-events-none fixed right-4 top-6 z-50 flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  )
}
