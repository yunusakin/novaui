import { Link, useLocation } from 'react-router-dom'
import type { MouseEventHandler } from 'react'
import { appEnv } from '@/config/env'

const titleMap: Record<string, string> = {
  '/': 'Dashboard',
  '/users': 'Users',
  '/products': 'Products',
  '/orders': 'Orders',
  '/payment': 'Payment',
}

type NavbarProps = {
  onMenuClick?: MouseEventHandler<HTMLButtonElement>
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const location = useLocation()
  const pageTitle =
    Object.entries(titleMap)
      .sort((a, b) => b[0].length - a[0].length)
      .find(([path]) => location.pathname.startsWith(path))?.[1] ?? 'NovaUI'

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 md:hidden"
        >
          <span className="sr-only">Open navigation</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            fill="none"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{pageTitle}</h1>
          <p className="text-sm text-slate-500">Nova control center</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
          {appEnv.appEnv}
        </span>
        <Link
          to="/orders"
          className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
        >
          Create order
        </Link>
      </div>
    </header>
  )
}
