type LoadingStateProps = {
  message?: string
}

export const LoadingState = ({ message = 'Loading data…' }: LoadingStateProps) => (
  <div className="flex items-center justify-center py-12 text-sm text-slate-500">
    <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-primary" />
    {message}
  </div>
)
