import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useNovaStore } from '@/store/novaStore'
import { useAuthStore } from '@/store/authStore'
import { ToastViewport } from '@/components/feedback/ToastViewport'
import { navigationItems } from '@/constants/navigation'
import { appEnv } from '@/config/env'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { LogoutButton } from '@/components/auth/LogoutButton'

export const AppLayout = () => {
  const refreshAll = useNovaStore((state) => state.refreshAll)
  const fetchOrders = useNovaStore((state) => state.fetchOrders)
  const user = useAuthStore((state) => state.user)
  const role = user?.role
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const environmentLabel = appEnv.appEnv

  useEffect(() => {
    if (!role) return
    if (role === 'COURIER') {
      void fetchOrders()
      return
    }
    void refreshAll()
  }, [refreshAll, fetchOrders, role])

  const allowedItems = navigationItems.filter(
    (item) => !item.roles || (role && item.roles.includes(role)),
  )

  return (
    <>
      <ToastViewport />
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Navbar onMenuClick={() => setIsMobileNavOpen(true)} />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>

      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <aside className="relative z-50 flex h-full w-72 flex-col border-r border-slate-200 bg-white px-6 py-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-white">
                  N
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    NovaUI
                  </p>
                  <p className="text-xs text-slate-500">
                    Operations console
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(false)}
                className="rounded-lg border border-slate-200 p-2 text-slate-500"
              >
                <span className="sr-only">Close navigation</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  className="h-5 w-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="space-y-1">
              {allowedItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 border-t border-slate-200 pt-4">
              <div className="mb-3 text-sm">
                <p className="font-semibold text-slate-900">{user?.name}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase text-slate-500">
                  <span>{role ?? 'GUEST'}</span>
                  <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide text-slate-600">
                    {environmentLabel}
                  </span>
                </div>
              </div>
              <LogoutButton onComplete={() => setIsMobileNavOpen(false)} />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  )
}
