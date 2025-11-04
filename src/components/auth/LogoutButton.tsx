import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useNovaStore } from '@/store/novaStore'
import { useToast } from '@/hooks/useToast'

type LogoutButtonProps = {
  onComplete?: () => void
}

export const LogoutButton = ({ onComplete }: LogoutButtonProps) => {
  const navigate = useNavigate()
  const toast = useToast()
  const logout = useAuthStore((state) => state.logout)
  const isLoading = useAuthStore((state) => state.isLoading)
  const resetNovaData = useNovaStore((state) => state.reset)

  const handleLogout = async () => {
    if (isLoading) return
    await logout()
    toast.info('Signed out', 'You have been logged out of NovaUI.')
    navigate('/login', { replace: true })
    // reset data lazily to avoid stale cache when a new user logs in
    resetNovaData()
    onComplete?.()
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H9m9 0l-3 3m3-3l-3-3" />
      </svg>
      Logout
    </button>
  )
}
